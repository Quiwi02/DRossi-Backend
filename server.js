const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Cargar las rutas
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');

// Middleware para pasear json
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', loginRoutes);

// Inicializar el puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando ${PORT}`);
});