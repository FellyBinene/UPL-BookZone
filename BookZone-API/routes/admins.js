// routes/admins.js

const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route POST pour inscrire un utilisateur
router.post('/', (req, res) => {
    const { email, fullName, phone, matricule, password } = req.body;

    // Vérifie que tous les champs sont présents
    if (!email || !fullName || !phone || !matricule || !password) {
        return res.status(400).json({ message: 'Champs manquants' });
    }

    const query = `
        INSERT INTO admins (email, fullName, phone, matricule, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, [email, fullName, phone, matricule, password], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion de l\'administrateur :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        res.status(201).json({ message: 'Administrateur inscrit avec succès' });
    });
});

module.exports = router;