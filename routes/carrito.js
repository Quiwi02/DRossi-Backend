const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Carrito
// Ver el carrito por usuario (con usuario fijo para pruebas)
router.get('/carrito', (req, res) => {
    const id_usuario = 1; // usuario fijo para pruebas
    db.query(`
      SELECT c.id_carrito, p.nombre, c.cantidad, p.precio, p.id_productos
      FROM carrito c
      JOIN productos p ON c.id_productos = p.id_productos
      WHERE c.id_usuario = ?
    `, [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Agregar al carrito (usuario fijo)
router.post('/carrito', (req, res) => {
    const id_usuario = 1; // usuario fijo para pruebas
    const { id_producto, cantidad } = req.body;

    if (!id_producto || !cantidad) {
      return res.status(400).json({ error: "Faltan datos (id_producto o cantidad)" });
    }

    db.query(`
      INSERT INTO carrito (id_usuario, id_productos, cantidad)
      VALUES (?, ?, ?)
    `, [id_usuario, id_producto, cantidad], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Producto agregado al carrito' });
    });
});

module.exports = router;
