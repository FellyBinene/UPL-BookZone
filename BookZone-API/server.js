const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { DataTypes } = require('sequelize');

// Importation de la connexion Sequelize
const sequelize = require('./config/db');

// Importation des routes externes
const usersRoutes = require('./routes/users');
const recupUsersRoute = require('./routes/RecupUsers');
const recupAdminsRoute = require('./routes/RecupAdmins');
const authRoutes = require('./routes/auth');
const adminsRoutes = require('./routes/admins');
const authAdminRoutes = require('./routes/authAdmins');

// server.js ou app.js
const booksRoutes = require('./routes/books');


const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/files', express.static(path.join(__dirname, 'uploads/files')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/books', booksRoutes);

// Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Définition du modèle Book
const Book = sequelize.define('Book', {
    titre: DataTypes.STRING,
    auteur: DataTypes.STRING,
    genre: DataTypes.STRING,
    resume: DataTypes.TEXT,
    fichier_nom: DataTypes.STRING,
    fichier_type: DataTypes.STRING,
    image_nom: DataTypes.STRING,
    image_type: DataTypes.STRING
});

// Définition du modèle Notification
const Notification = sequelize.define('Notification', {
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

// Association Notification <-> Book
Notification.belongsTo(Book, { foreignKey: 'bookId' });
Book.hasMany(Notification, { foreignKey: 'bookId' });

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isPdf = file.mimetype === 'application/pdf';
        const isImage = file.mimetype.startsWith('image');
        if (isPdf) cb(null, 'uploads/files');
        else if (isImage) cb(null, 'uploads/images');
        else cb(null, 'uploads/others');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
        cb(null, unique);
    }
});
const upload = multer({ storage });

// Routes API externes
app.use('/api/users', usersRoutes);
app.use('/api/recup-users', recupUsersRoute);
app.use('/api/recup-admins', recupAdminsRoute);
app.use('/auth', authRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/authAdmin', authAdminRoutes);

// Routes API livres
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.findAll({ order: [['createdAt', 'DESC']] });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Upload livre + créer notification
app.post('/api/books/upload', upload.fields([
    { name: 'fichier', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    try {
        const { titre, auteur, genre, resume } = req.body;
        const fichier = req.files['fichier']?.[0];
        const image = req.files['image']?.[0];

        if (!fichier || !image) {
            return res.status(400).json({ success: false, message: 'Fichier ou image manquant' });
        }

        const newBook = await Book.create({
            titre,
            auteur,
            genre,
            resume,
            fichier_nom: fichier.filename,
            fichier_type: fichier.mimetype,
            image_nom: image.filename,
            image_type: image.mimetype
        });

        // Création d'une notification pour ce nouveau livre
        await Notification.create({
            bookId: newBook.id,
            message: `Nouveau livre ajouté : ${titre}`,
            seen: false
        });

        res.json({ success: true, bookId: newBook.id });
    } catch (error) {
        console.error('Erreur API:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

app.put('/api/books/:id', upload.fields([
    { name: 'fichier', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    try {
        const id = req.params.id;
        const { titre, auteur, genre, resume } = req.body;
        const fichier = req.files['fichier']?.[0];
        const image = req.files['image']?.[0];

        const book = await Book.findByPk(id);
        if (!book) return res.status(404).json({ success: false, message: 'Livre non trouvé' });

        book.titre = titre || book.titre;
        book.auteur = auteur || book.auteur;
        book.genre = genre || book.genre;
        book.resume = resume || book.resume;

        if (fichier) {
            book.fichier_nom = fichier.filename;
            book.fichier_type = fichier.mimetype;
        }
        if (image) {
            book.image_nom = image.filename;
            book.image_type = image.mimetype;
        }

        await book.save();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const book = await Book.findByPk(id);
        if (!book) return res.status(404).json({ success: false, message: 'Livre non trouvé' });

        const imagePath = path.join(__dirname, 'uploads/images', book.image_nom);
        const fichierPath = book.fichier_type.startsWith('image')
            ? path.join(__dirname, 'uploads/images', book.fichier_nom)
            : path.join(__dirname, 'uploads/files', book.fichier_nom);

        [imagePath, fichierPath].forEach(fp => {
            fs.unlink(fp, err => {
                if (err) console.warn('Fichier non supprimé :', fp);
            });
        });

        await book.destroy();
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Récupérer notifications non vues avec livre associé
app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { seen: false },
            include: [{ model: Book }],
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        res.json({ success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Marquer notification comme vue
app.put('/api/notifications/:id/seen', async (req, res) => {
    try {
        const id = req.params.id;
        const notif = await Notification.findByPk(id);
        if (!notif) return res.status(404).json({ success: false, message: 'Notification non trouvée' });

        notif.seen = true;
        await notif.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// Lancer le serveur
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ Erreur MySQL :', err);
});
