const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Pedidos
// Crear un nuevo pedido
router.post('/pedidos', (req, res) => {
    const { id_usuario, metodo_pago, productos } = req.body;

    if (!id_usuario || !metodo_pago || !productos) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios'});
    }

    // 1. Calcular total
    let total = 0;
    const productoIds = productos.map(p => p.id_productos);
    const placeholders = productoIds.map(() => '?').join(',');

    db.query(
        `SELECT id_productos, precio FROM productos WHERE id_productos IN (${placeholders})`,
        productoIds,
        (err, rows) => {
            if (err) return res.status(500).json({ error: err });

            productos.forEach(p => {
                const precio = rows.find(r => r.id_productos === p.id_productos)?.precio || 0;
                total += precio * p.cantidad;
            });

            // 2. Insertar en pedidos
            db.query(
                `INSERT INTO pedidos (estado, total_pago, metodo_pago, fecha_pedido, id_usuario) VALUES ('Pendiente', ?, ?, NOW(), ?)`,
                [total, metodo_pago, id_usuario],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err });

                    const id_pedido = result.insertId;

                    // 3. Insertar en detalle_pedido (si tuvieras esa tabla)
                    // 4. Vaciar carrito
                    db.query(
                        `DELETE FROM carrito WHERE id_usuario = ?`,
                        [id_usuario],
                        (err) => {
                            if (err) return res.status(500).json({ error: err });
                            res.json({ mensaje: 'Pedido creado éxito', id_pedido });
                        });
                });
        });
});

module.exports = router;