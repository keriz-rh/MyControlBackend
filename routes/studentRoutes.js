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


router.get('/', authMiddleware, getAllStudents);

// Solo administradores pueden crear estudiantes
router.post('/', authMiddleware, isAdmin, upload.single('foto'), createStudent);

// Solo administradores pueden actualizar estudiantes
router.put('/:id', authMiddleware, isAdmin, upload.single('foto'), updateStudent);

// Solo administradores pueden eliminar estudiantes
router.delete('/:id', authMiddleware, isAdmin, deleteStudent);

module.exports = router;