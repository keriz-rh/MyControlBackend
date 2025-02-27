const express = require('express');
const {
    getAllParents,
    createParent,
    updateParent,
    deleteParent,
} = require('../controllers/parentController');

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para obtener todos los padres
router.get('/', authMiddleware, isAdmin, getAllParents); // Acceso para todos los usuarios autenticados

// Ruta para crear un nuevo padre
router.post('/', authMiddleware, isAdmin, createParent); // Solo administradores

// Ruta para actualizar un padre
router.put('/:id', authMiddleware, isAdmin, updateParent); // Solo administradores

// Ruta para eliminar un padre
router.delete('/:id', authMiddleware, isAdmin, deleteParent); // Solo administradores

module.exports = router;