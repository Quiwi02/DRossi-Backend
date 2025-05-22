const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Crear un comentario
router.post('/comentario', (req, res) => {
    const { id_usuario, id_productos, comentario } = req.body;
    db.query(`
    INSERT INTO comentarios (id_usuario, id_productos, comentario, fecha)
    VALUES (?, ?, ?, NOW())
  `, [id_usuario, id_productos, comentario], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ mensaje: 'Comentario enviado' });
    });
});

module.exports = router;