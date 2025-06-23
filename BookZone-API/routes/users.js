const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/', (req, res) => {
    const { email, fullName, birthDate, phone, password } = req.body;

    if (!email || !fullName || !birthDate || !phone || !password) {
        return res.status(400).json({ message: 'Champs manquants' });
    }

    const query = 'INSERT INTO users (email, fullName, birthDate, phone, password) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [email, fullName, birthDate, phone, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
        }

        return res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
    });
});

module.exports = router;
