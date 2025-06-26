const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

const router = express.Router();

// 🔧 Vérifie et crée les dossiers
['uploads/images', 'uploads/pdfs'].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuration multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'cover_image') {
            cb(null, 'uploads/images');
        } else if (file.fieldname === 'fichier') {
            cb(null, 'uploads/pdfs');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'cover_image' && !file.mimetype.startsWith('image/')) {
            return cb(new Error('Format image non valide'), false);
        }
        if (file.fieldname === 'fichier' && file.mimetype !== 'application/pdf') {
            return cb(new Error('Le fichier doit être un PDF'), false);
        }
        cb(null, true);
    }
});

// Ajouter un livre
router.post('/addBook', upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'fichier', maxCount: 1 }
]), (req, res) => {
    console.log('📝 Données reçues :', req.body);
    console.log('📁 Fichiers reçus :', req.files);

    const { titre, auteur, publication_date, genre } = req.body;
    const coverImagePath = req.files['cover_image']?.[0]?.path || '';
    const pdfPath = req.files['fichier']?.[0]?.path || '';

    if (!titre || !auteur || !publication_date || !genre || !coverImagePath || !pdfPath) {
        return res.status(400).json({ success: false, message: "Champs manquants." });
    }

    const sql = `
        INSERT INTO books (titre, auteur, publication_date, genre, cover_image, fichier)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [titre, auteur, publication_date, genre, coverImagePath, pdfPath], (err, result) => {
        if (err) {
            console.error('❌ Erreur SQL :', err);
            return res.status(500).json({ success: false, message: "Erreur MySQL." });
        }
        console.log('✅ Livre inséré avec ID :', result.insertId);
        res.json({ success: true, message: "📚 Livre ajouté avec succès." });
    });
});


module.exports = router;
