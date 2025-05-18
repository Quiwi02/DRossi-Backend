const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Carrito
router.post('/carrito', async (req, res) => {
    const { id_carrito, id_usuario, id_productos, cantidad } = req.body;

    try {
        // Inserta datos en la db
        const query = `INSERT INTO carrito (id_carrito, id_usuario, id_productos, cantidad) 
        VALUES (?, ?, ?, ?)`;

        // Se consume el query
        db.query(query, [id_carrito, id_usuario, id_productos, cantidad], (err, results) => {
            if (err) {
                console.log('Error al añadir al carrito', err);
                return res.status(400).send('Error al añador al carrito');
            }
            res.status(200).send('Producto añadido correctamente');
        });
    } catch (error) {
        console.log('Error al añadir al carrito');
        res.status(500).send('Error interno');
    }
});

module.exports = router;