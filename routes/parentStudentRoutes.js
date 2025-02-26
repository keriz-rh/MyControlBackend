const express = require('express');
const {
    getAllParentStudents,
    createParentStudent,
    updateParentStudent,
    deleteParentStudent
} = require('../controllers/parentStudentController');
const { authMiddleware, isAdmin, isUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas protegidas para las relaciones padres-alumnos

// Obtener todas las relaciones (accesible para administradores y usuarios, pero con restricciones)
router.get('/', authMiddleware, getAllParentStudents);

// Crear una nueva relación (solo para administradores)
router.post('/', authMiddleware, isAdmin, createParentStudent);

// Actualizar una relación (solo para administradores)
router.put('/:id_padre_alumno', authMiddleware, isAdmin, updateParentStudent);

// Eliminar una relación (solo para administradores)
router.delete('/:id_padre_alumno', authMiddleware, isAdmin, deleteParentStudent);

module.exports = router;