const express = require('express');
const router = express.Router();
const db = require('../config/db');
const crypto = require('crypto');
const {sendResetPassword} = require('../config/email');
require('dotenv').config();

router.post('olvide-contraseña', async(req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({message: 'El correo es obligatorio'});
    }

    try {
        // Verificar si el correo existe en la base de datos
        db.query(
            'SELECT * FROM usuario WHERE email = ?', 
            [email],
            async(err, results) => {
                if (err) {
                    console.log('Error en la consulta');
                    return res.status(500).send('Error interno');
                }

                if (results.length == 0){
                    return res.status(200).send('Si el correo existe recibiras una url')
                }
                const usuario = results [0];

                // Generando token del usuario
                const resetToken = crypto.randomBytes(20).toString('hex');
                const resetTokentExpiry = Date.now() + 3600000; // 1h de validez

                // Guardar en la db 
                db.query(
                    'UPDATE usuario SET reset_token = ?, reset_tokent_expyri = ? WHERE id = ?',
                    [resetToken, resetTokentExpiry, usuario.id],
                    async(updateErr) => {
                        if (updateErr) {
                        console.error('Error al realizar la actualizacion');
                        return res.status(500).send('Error interno');
                        }

                        const frontendUrl =process.env.FRONTEND || 'http://localhost:5500';
                        const resetUrl = `${frontendUrl}/reset.html?tokend=${resetToken}`;
                        try {
                            // Usar la funcion de envio de correo
                            await sendResetPassword(email, resetUrl);
                            res.status(200).send('Si el correo existe recibiras un link');
                        } catch(mailError) {
                            console.error('Error al enviar el correo', mailError);
                            return res.status(500).send('Error al enviar el correo de restablecimiento');
                        }
                    })
            }
        );
    } catch (err) {
        console.error('Error en olvide contraseña');
        res.status(500).send('Error interno');
    }
});

module.exports = router;