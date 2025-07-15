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

router.put('/password/:matricule', async (req, res) => {
    const { matricule } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Cherche l'admin dans la DB
    connection.query(
        'SELECT * FROM admins WHERE matricule = ?',
        [matricule],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Erreur serveur" });
            if (results.length === 0) return res.status(404).json({ message: "Admin non trouvé" });

            const admin = results[0];
            if (admin.password !== currentPassword) {
                return res.status(400).json({ message: "Mot de passe actuel incorrect" });
            }

            // Mise à jour
            connection.query(
                'UPDATE admins SET password = ? WHERE matricule = ?',
                [newPassword, matricule],
                (err2) => {
                    if (err2) return res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
                    return res.json({ message: "Mot de passe mis à jour avec succès" });
                }
            );
        }
    );
});

// ✅ Route GET - Liste de tous les administrateurs
router.get('/', (req, res) => {
    const query = 'SELECT * FROM admins';

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des administrateurs :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }

        res.json(results);
    });
});

module.exports = router;