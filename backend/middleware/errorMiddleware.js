// Este middleware captura cualquier error que ocurra en nuestras rutas [cite: 30]
const errorHandler = (err, req, res, next) => {
    // Si el error no tiene un código de estado, ponemos 500 (Error interno del servidor)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Mostramos el error en la terminal del backend para que tú puedas debuguear
    console.error(`[Error Log]: ${err.message}`);

    // Respondemos al cliente (Postman o Frontend) con un JSON claro [cite: 31]
    res.status(statusCode).json({
        exito: false,
        mensaje: "Ocurrió un problema en el servidor de Tamsa",
        error: err.message, // Explicación del error
        // El "stack" (rastro del error) solo se muestra si no estamos en producción
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;