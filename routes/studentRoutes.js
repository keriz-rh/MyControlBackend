const express = require('express');
const multer = require('multer');
const { 
    getAllStudents, createStudent, updateStudent, deleteStudent 
} = require('../controllers/studentController');
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


// Rutas protegidas para los alumnos

// Los administradores pueden ver todos los estudiantes, los usuarios solo los de su escuela
router.get('/', authMiddleware, getAllStudents);

// Solo administradores pueden crear estudiantes
router.post('/', authMiddleware, isAdmin, createStudent);

// Solo administradores pueden actualizar estudiantes
router.put('/:id', authMiddleware, isAdmin, updateStudent);

// Solo administradores pueden eliminar estudiantes
router.delete('/:id', authMiddleware, isAdmin, deleteStudent);

module.exports = router;