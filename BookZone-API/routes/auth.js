// routes/auth.js
const express = require('express');
const router = express.Router();
const connection = require('../db');

// Route POST pour connecter un utilisateur
router.post('/signin', (req, res) => {
    const { matricule, password } = req.body;

    if (!matricule || !password) {
        return res.status(400).json({ message: 'Champs manquants' });
    }

    const query = 'SELECT * FROM users WHERE matricule = ? AND password = ?';

    connection.query(query, [matricule, password], (err, results) => {
        if (err) {
            console.error('Erreur MySQL :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Connexion réussie' });
        } else {
            res.status(401).json({ message: 'Matricule ou mot de passe incorrect' });
        }
    });
});

module.exports = router;