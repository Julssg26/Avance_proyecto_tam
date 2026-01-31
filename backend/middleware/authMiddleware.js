const jwt = require('jsonwebtoken');

// Este middleware protege las rutas para que solo usuarios logueados entren
const protegerRuta = (req, res, next) => {
    // 1. Obtenemos el token del encabezado de la petición
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ 
            exito: false, 
            mensaje: "Acceso denegado. Se requiere un token de seguridad." 
        });
    }

    try {
        // 2. Verificamos si el token es válido y no ha expirado
        // Quitamos la palabra 'Bearer ' si es que viene en el string
        const tokenLimpio = token.split(' ')[1] || token;
        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        
        // 3. Guardamos los datos del usuario en la petición para usarlo después
        req.usuario = verificado;
        next(); // Si todo está bien, pasamos a la siguiente función
    } catch (error) {
        res.status(401).json({ 
            exito: false, 
            mensaje: "Token inválido o expirado." 
        });
    }
};

module.exports = protegerRuta;