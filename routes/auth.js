const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Registro usuario
router.post('/registro', async (req, res) => {
    const { nombre_usuario, email, contraseña } = req.body;

    // validacion basica
    if (!nombre_usuario || !email || !contraseña) {
        return res.status(400).send('Faltan datos obligatorios');
    }

    try {
        //Aqui se encripta la contraseña
        const hash = await bcrypt.hash(contraseña, 10);
        const fecha = new Date();

        // Insertar en la base de datos
        const query = `INSERT INTO usuario (nombre_usuario, email, contraseña, fecha_creacion)
        VALUES (?, ?, ?, ?)`;

        // Consumir el query
        db.query(query, [nombre_usuario, email, hash, fecha], (err, results) => {
            if (err) {
                console.log('Error al registrar el usuario', err);
                return res.status(400).send('Error al registrar el usuario');
            }
            res.status(200).send('Usuario registrado correctamente');
        });
    } catch (error) {
        console.log('Error al registrar el usuario');
        res.status(500).send('Error interno');
    }
});

module.exports = router;
