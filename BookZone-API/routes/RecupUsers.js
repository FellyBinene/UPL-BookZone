const express = require('express');
const router = express.Router();
const connection = require('../db');

// ✅ Middleware de sécurité basique (optionnel mais conseillé)
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // autorise tout domaine (à restreindre en prod)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ✅ Route GET pour récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    const query = `
        SELECT 
            id,
            email,
            fullName,
            birthDate,
            phone,
            matricule,
            password,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;

    try {
        connection.query(query, (error, results) => {
            if (error) {
                console.error('[SQL ERROR] Impossible de récupérer les utilisateurs :', error);
                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }

            if (!results.length) {
                return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
            }

            res.status(200).json(results);
        });
    } catch (err) {
        console.error('[CATCH ERROR] Une exception est survenue :', err);
        res.status(500).json({ message: 'Erreur critique côté serveur' });
    }
});

router.get('/recup-users', (req, res) => {
    const query = `
    SELECT id, email, fullName, birthDate, phone, matricule, password, created_at
    FROM users
    ORDER BY created_at DESC
  `;

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.json(results);
    });
});

module.exports = router;
