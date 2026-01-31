const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Librería para generar el token de seguridad

// --- REGISTRO DE USUARIOS ---
exports.registrarUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        res.status(201).json({
            exito: true,
            mensaje: "Usuario de Tamsa registrado correctamente",
            usuarioId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// --- LOGIN DE USUARIOS (NUEVO) ---
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Buscamos si el usuario existe en la base de datos
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            return res.status(401).json({ exito: false, mensaje: "Correo o contraseña incorrectos" });
        }

        const usuario = usuarios[0];

        // 2. Verificamos si la contraseña coincide con la encriptada
        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) {
            return res.status(401).json({ exito: false, mensaje: "Correo o contraseña incorrectos" });
        }

        // 3. Generamos el Token JWT (Dura 2 horas)
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({
            exito: true,
            mensaje: `¡Bienvenido(a) al sistema, ${usuario.nombre}!`,
            token // Este token lo usaremos para proteger las rutas de logística
        });
    } catch (error) {
        next(error);
    }
};