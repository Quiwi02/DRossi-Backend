const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Habilitar CORS para el frontend
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

//Inicializa el puerto
const PORT = process.env.PORT || 3000;

// Middleware para parsear json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Servidor corriendo',
        timestamp: new Date().toISOString()
    });
});

//Ruta de api
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'API funcionando',
        enpoints: ['POST api/login', 'POST api/registro', 'POST api/login/google']
    });
});

// Cargar las rutas
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const passwordRoutes = require('./routes/password');
const carritoRoutes = require('./routes/carrito');
const productosRoutes = require('./routes/productos');
const pedidosRoutes = require('./routes/pedidos');
const comentarioRoutes = require('./routes/comentario');

app.use('/api', authRoutes);
app.use('/api', loginRoutes);
app.use('/api', passwordRoutes);
app.use('/api', carritoRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', comentarioRoutes);


app.listen(PORT, () => {
    console.log(`Servidor escuchando ${PORT}`);
    console.log(`Api disponible en ${PORT}/api`);
});