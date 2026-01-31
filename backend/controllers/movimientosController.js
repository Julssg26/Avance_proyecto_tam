const db = require('../config/db');

// --- REGISTRAR UN MOVIMIENTO ---
exports.registrarMovimiento = async (req, res, next) => {
    try {
        const { unidad_tracto, placa_plana, chofer_nombre, ubicacion_actual, observaciones } = req.body;
        const [result] = await db.query(
            'INSERT INTO movimientos (unidad_tracto, placa_plana, chofer_nombre, ubicacion_actual, observaciones) VALUES (?, ?, ?, ?, ?)',
            [unidad_tracto, placa_plana, chofer_nombre, ubicacion_actual, observaciones]
        );
        res.status(201).json({
            exito: true,
            mensaje: "Movimiento registrado en el sistema Tamsa",
            id: result.insertId
        });
    } catch (error) { next(error); }
};

// --- OBTENER TODOS LOS MOVIMIENTOS ---
exports.obtenerMovimientos = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM movimientos ORDER BY fecha_registro DESC');
        res.json({ exito: true, data: rows });
    } catch (error) { next(error); }
};

// --- ACTUALIZAR UN MOVIMIENTO (NUEVA FUNCIÓN) ---
exports.actualizarMovimiento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { unidad_tracto, placa_plana, chofer_nombre, ubicacion_actual, observaciones } = req.body;
        
        const [result] = await db.query(
            'UPDATE movimientos SET unidad_tracto=?, placa_plana=?, chofer_nombre=?, ubicacion_actual=?, observaciones=? WHERE id=?',
            [unidad_tracto, placa_plana, chofer_nombre, ubicacion_actual, observaciones, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ exito: false, mensaje: "No se encontró el registro para actualizar" });
        }
        res.json({ exito: true, mensaje: "Movimiento actualizado correctamente" });
    } catch (error) { next(error); }
};

// --- ELIMINAR UN MOVIMIENTO ---
exports.eliminarMovimiento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM movimientos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ exito: false, mensaje: "No se encontró el registro" });
        }
        res.json({ exito: true, mensaje: "Registro eliminado de la logística de Tamsa" });
    } catch (error) { next(error); }
};