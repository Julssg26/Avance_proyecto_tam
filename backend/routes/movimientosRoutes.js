const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientosController');

// Importamos el middleware de seguridad
const protegerRuta = require('../middleware/authMiddleware');

// --- RUTAS PROTEGIDAS CON JWT ---
// Solo alguien con TOKEN puede registrar, ver, editar o eliminar movimientos

// Ruta para Crear: POST http://localhost:3000/api/movimientos
router.post('/', protegerRuta, movimientosController.registrarMovimiento);

// Ruta para Leer todos: GET http://localhost:3000/api/movimientos
router.get('/', protegerRuta, movimientosController.obtenerMovimientos);

// NUEVA RUTA para Editar: PUT http://localhost:3000/api/movimientos/:id
// Esta ruta permite actualizar los datos cuando te equivocas en el registro
router.put('/:id', protegerRuta, movimientosController.actualizarMovimiento);

// Ruta para Eliminar: DELETE http://localhost:3000/api/movimientos/:id
router.delete('/:id', protegerRuta, movimientosController.eliminarMovimiento);

module.exports = router;