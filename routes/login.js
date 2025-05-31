const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Login de usuario
router.post('/login', (req, res) => {
    const { email, contraseña } = req.body;

    // Validacion basica
    if (!email || !contraseña) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    // Buscar el usuario en la base de datos
    db.query(
        "select * from usuario where email= ?",
        [email],
        async (err, results) => {

            if (err) {
                console.log('Error en la consulta', err);
                return res.status(400).send('Error interno');
            }

            if (results.length === 0) {
                return res.status(500).send('Usuario no existe');
            }
            const usuario = results[0];
            // Comparar si las contraseñas son iguales
            const match = await bcrypt.compare(contraseña, usuario.contraseña);
            if (match) {
                return res.status(401).send('Contraseña incorrecta');
            }

            return res.status(200).json({
                mensaje: 'login susefuly',
                usuario: {
                    id: usuario.id,
                    nombre_usuario: usuario.nombre_usuario,
                    email: usuario.email,
                },
            });
        }
    );
});

// Ruta de login con google
router.post('/login/google', async (req, res) => {
    const { nombre_usuario, email, firebase_uid, email_verified } = req.body;

    if (!email || !firebase_uid) {
        return res.status(400).send('Faltan datos obligatorios');
    }

    db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error en consulta:', err);
            return res.status(500).send('Error en el servidor');
        }

        if (results.length === 0) {
            // Usuario no existe, lo registramos
            const insertQuery = `
    INSERT INTO usuario (nombre_usuario, email, fecha_creacion, firebase_uid, email_verified, auth_provider)
    VALUES (?, ?, NOW(), ?, ?, 'Google')
   `;

            db.query(insertQuery, [nombre_usuario, email, firebase_uid, email_verified ? 1 : 0], (err, result) => {
                if (err) {
                    console.error('Error al insertar usuario Google:', err);
                    return res.status(500).send('Error al registrar usuario');
                }

                return res.status(201).json({
                    mensaje: 'Usuario registrado con Google',
                    usuario: {
                        id: result.insertId,
                        nombre_usuario,
                        email,
                        auth_provider: 'Google'
                    }
                });
            });
        } else {
            // Usuario ya existe
            return res.status(200).json({
                mensaje: 'Login con Google exitoso',
                usuario: results[0]
            });
        }
    });
});

module.exports = router;
