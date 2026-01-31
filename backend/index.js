const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const movimientosRoutes = require('./routes/movimientosRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 1. RUTAS API
app.use('/api/auth', authRoutes);
app.use('/api/movimientos', movimientosRoutes);

// 2. ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, '../frontend')));

// 3. CATCH-ALL PARA SPA (Node 22 ✔️)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 4. ERRORES
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 Servidor en: http://localhost:${PORT}`);
    console.log(`==========================================`);
});
