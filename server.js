const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Cargar las rutas
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const passwordRoutes = require('./routes/password');
const carritoRoutes = require('./routes/carrito');
const productosRoutes = require('./routes/productos');
const pedidosRoutes = require('./routes/pedidos');
const comentarioRoutes = require('./routes/comentario');

// Middleware para pasear json
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', loginRoutes);
app.use('/api', passwordRoutes);
app.use('/api', carritoRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', comentarioRoutes);

// Inicializar el puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando ${PORT}`);
});