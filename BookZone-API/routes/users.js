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


// ✅ Route PUT - Modifier un utilisateur par ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { email, fullName, phone, matricule } = req.body;

    if (!email || !fullName || !phone || !matricule) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const query = `
        UPDATE users 
        SET email = ?, fullName = ?, phone = ?, matricule = ?
        WHERE id = ?
    `;

    connection.query(query, [email, fullName, phone, matricule, id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    });
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ message: 'Utilisateur supprimé avec succès' });
    });
});

module.exports = router;