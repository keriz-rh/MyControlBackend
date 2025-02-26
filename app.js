const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // Para mejorar la seguridad
const rateLimit = require('express-rate-limit'); // Para limitar la tasa de solicitudes

const morgan = require('morgan'); // Para registrar solicitudes HTTP

// Importar rutas y middleware
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const parentRoutes = require('./routes/parentRoutes');
const parentStudentRoutes = require('./routes/parentStudentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();

// Configuración de seguridad
app.use(helmet()); // Añade cabeceras de seguridad
app.use(cors()); // Permitir solicitudes desde el FrontEnd
app.set('trust proxy', 1);

// Configuración de límite de tasa (rate limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 solicitudes por IP
});
app.use(limiter);

// Middleware para registrar solicitudes HTTP
app.use(morgan('combined'));

// Middleware para manejar datos JSON en las solicitudes
app.use(express.json());

// Servir archivos estáticos para las imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Rutas públicas (no requieren autenticación)
app.use('/api/auth', authRoutes);

// Rutas de escuelas (protegidas por middlewares dentro de schoolRoutes)
app.use('/api/schools', schoolRoutes);

// Rutas de estudiantes (protegidas por autenticación)
app.use('/api/students', authMiddleware, studentRoutes);

// Rutas de padres (protegidas por autenticación)
app.use('/api/parents', authMiddleware, parentRoutes);

// Rutas de asignación padres-estudiantes (protegidas por autenticación)
app.use('/api/parent-students', authMiddleware, parentStudentRoutes);

// Rutas de archivos (protegidas por autenticación)
app.use('/api/upload', authMiddleware, uploadRoutes);

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Manejar errores específicos
    if (err.name === 'ValidationError') {
        return res.status(400).json({ success:false,message: 'Error de validación', error: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({success:false, message: 'No autorizado', error: err.message });
    }

    if (err.name === 'ForbiddenError') {
        return res.status(403).json({success:false, message: 'Acceso denegado', error: err.message });
    }

    if (err.name === 'NotFoundError') {
        return res.status(404).json({ success:false, message: 'Recurso no encontrado', error: err.message });
    }

    // Error genérico
    res.status(500).json({ success:false, message: 'Algo salió mal en el servidor', error: err.message });
});

module.exports = app;