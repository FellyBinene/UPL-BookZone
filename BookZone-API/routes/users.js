// routes/users.js

const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route POST pour inscrire un utilisateur
router.post('/', (req, res) => {
    const { email, fullName, birthDate, phone, matricule, password } = req.body;

    // Vérifie que tous les champs sont présents
    if (!email || !fullName || !birthDate || !phone || !matricule || !password) {
        return res.status(400).json({ message: 'Champs manquants' });
    }

    const query = `
        INSERT INTO users (email, fullName, birthDate, phone, matricule, password)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [email, fullName, birthDate, phone, matricule, password], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
    });
});

router.get('/users/:matricule', (req, res) => {
    const { matricule } = req.params;
    const query = 'SELECT * FROM users WHERE matricule = ?';

    connection.query(query, [matricule], (err, results) => {
        if (err) {
            console.error('Erreur serveur:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.json(results[0]);
    });
});

module.exports = router;