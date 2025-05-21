const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Pedidos
router.get('/pedidos', (req, res) => {
    db.query('SELECT * FROM pedidos', (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Erro al buscar pedidos' });
        } else {
            res.send(results);
        }
    })
});

module.exports = router;