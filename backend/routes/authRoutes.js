const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para crear cuenta: POST http://localhost:3000/api/auth/registro
router.post('/registro', authController.registrarUsuario);

// Ruta para entrar: POST http://localhost:3000/api/auth/login
router.post('/login', authController.login);

module.exports = router;