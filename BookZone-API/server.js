const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importation des routes
const usersRoutes = require('./routes/users');
const recupUsersRoute = require('./routes/RecupUsers');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books'); // ✅ Nouvelle route

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


// Servir les fichiers statiques (images/pdf)
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/pdfs', express.static(path.join(__dirname, 'uploads/pdfs')));

// Utilisation des routes
app.use('/api/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/api/recup-users', recupUsersRoute);
app.use('/api/books', booksRoutes); // ✅ Route pour les livres

// Lancement du serveur
app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
