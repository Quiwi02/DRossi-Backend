const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Login de usuario
router.post('/login', (req, res) => {
    const {email, contraseña } = req.body;

    // Validacion basica
    if (!email || !contraseña) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    // Buscar el usuario en la base de datos
    db.query(
        "select * from usuario where email= ?",
        [email],
        async (err, results) => {
            
            if (err){
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

module.exports = router;
