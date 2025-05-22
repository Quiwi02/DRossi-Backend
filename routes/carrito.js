const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Carrito
// Ver el carrito por usuario
router.get('/carrito', (req, res) => {
    const { id_usuario } = req.query;
    db.query(`
    SELECT c.id_carrito, p.nombre, c.cantidad, p.precio
    FROM carrito c
    JOIN productos p ON c.id_productos = p.id_productos
    WHERE c.id_usuario = ?
  `, [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Agregar al carrito
router.post('/', (req, res) => {
    const { id_usuario, id_productos, cantidad } = req.body;
    db.query(`
    INSERT INTO carrito (id_usuario, id_productos, cantidad)
    VALUES (?, ?, ?)
  `, [id_usuario, id_productos, cantidad], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: 'Producto agregado al carrito' });
    });
});

module.exports = router;