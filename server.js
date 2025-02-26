require('dotenv').config(); // Cargar variables de entorno
const app = require('./app');
const cors = require('cors');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 5000;

// Configurar CORS
app.use(cors());

// Conectar a la base de datos
const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Conexión a la base de datos MySQL establecida');
        global.db = connection; // Hacer la conexión global
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Detener el servidor si falla la conexión
    }
};

// Iniciar la base de datos y luego el servidor
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    }).on('error', (err) => {
        console.error('Error al iniciar el servidor:', err);
    });
});