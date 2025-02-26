const express = require('express');
const multer = require('multer');
const {
    getAllSchools, getSchoolsByUser, createSchool, updateSchool, deleteSchool,
} = require('../controllers/schoolController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Configuración de multer para guardar archivos en la carpeta "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Guardar archivos en la carpeta "uploads"
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único para el archivo
    },
});

const upload = multer({ storage });

// Ruta para obtener escuelas vinculadas al usuario (para usuarios normales)
router.get('/user', authMiddleware, getSchoolsByUser);

// Rutas protegidas para administradores
router.get('/', authMiddleware, isAdmin, getAllSchools); // Obtener todas las escuelas
router.post('/', authMiddleware, isAdmin, upload.single('foto'), createSchool); // Crear una nueva escuela (con carga de imagen)
router.put('/:id_school', authMiddleware, isAdmin, upload.single('foto'), updateSchool); // Actualizar una escuela (con carga de imagen)
router.delete('/:id_school', authMiddleware, isAdmin, deleteSchool); // Eliminar una escuela

module.exports = router;