const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Productos
router.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al obtener la lista de productos' });
        } else {
            res.json(rows);
        }
    })
});

module.exports = router;