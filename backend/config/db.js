// Importamos la librería mysql2 para conectarnos a la base de datos
const mysql = require('mysql2');
// Importamos dotenv para usar las variables del archivo .env
require('dotenv').config();

// Creamos un "pool" de conexiones. Es más eficiente porque reutiliza conexiones
// en lugar de abrir y cerrar una nueva cada vez que alguien entra a la app.
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Se lee desde el .env
    user: process.env.DB_USER,         // Tu usuario de MySQL
    password: process.env.DB_PASSWORD, // Tu contraseña de MySQL
    database: process.env.DB_NAME,     // El nombre: tamsa_logistica
    waitForConnections: true,
    connectionLimit: 10,               // Máximo 10 conexiones simultáneas
    queueLimit: 0,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

// Exportamos el pool usando ".promise()" para poder usar async/await en los controladores,
// lo cual hace que nuestro código sea más moderno y fácil de leer.
module.exports = pool.promise();