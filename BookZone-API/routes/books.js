const express = require('express');
const router = express.Router();
const connection = require('../db');

// GET /api/books/notifications
router.get('/notifications', (req, res) => {
    const sql = 'SELECT * FROM books ORDER BY id DESC LIMIT 5';

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Erreur SQL :', error);
            return res.status(500).json({ success: false, message: 'Erreur serveur' });
        }
        res.json({ success: true, notifications: results });
    });
});

module.exports = router;
