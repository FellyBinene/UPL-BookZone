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

// Route PUT pour modifier un administrateur
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { email, fullName, phone, matricule } = req.body;

    // Vérifie que les champs essentiels sont présents
    if (!email || !fullName || !phone || !matricule) {
        return res.status(400).json({ message: 'Champs manquants pour la mise à jour' });
    }

    const query = `
        UPDATE admins 
        SET email = ?, fullName = ?, phone = ?, matricule = ?
        WHERE id = ?
    `;

    connection.query(query, [email, fullName, phone, matricule, id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'administrateur :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Administrateur non trouvé' });
        }

        res.json({ message: 'Administrateur mis à jour avec succès' });
    });
});

// DELETE /api/admins/:id
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM admins WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erreur suppression admin :', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Administrateur non trouvé' });
        }

        res.status(200).json({ message: 'Administrateur supprimé avec succès' });
    });
});

module.exports = router;