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
    const { email, fullName, birthDate, phone, matricule } = req.body;

    if (!email || !fullName || !birthDate || !phone || !matricule) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const query = `
        UPDATE users 
        SET email = ?, fullName = ?, birthDate = ?, phone = ?, matricule = ?
        WHERE id = ?
    `;

    connection.query(query, [email, fullName, birthDate, phone, matricule, id], (err, result) => {
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

// PUT - Modifier le mot de passe d’un utilisateur
router.put('/password/:matricule', (req, res) => {
    const { matricule } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const selectQuery = 'SELECT * FROM users WHERE matricule = ?';
    connection.query(selectQuery, [matricule], (err, results) => {
        if (err) {
            console.error('Erreur lors de la recherche de l’utilisateur :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const user = results[0];

        if (user.password !== currentPassword) {
            return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        }

        const updateQuery = 'UPDATE users SET password = ? WHERE matricule = ?';
        connection.query(updateQuery, [newPassword, matricule], (updateErr) => {
            if (updateErr) {
                console.error('Erreur lors de la mise à jour du mot de passe :', updateErr);
                return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
            }

            return res.json({ message: 'Mot de passe mis à jour avec succès' });
        });
    });
});

// ✅ Route GET - Liste de tous les utilisateurs
router.get('/', (req, res) => {
    const query = 'SELECT * FROM users';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des utilisateurs :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        res.json(results);
    });
});

module.exports = router;