const express = require('express');
const { login, register } = require('../controllers/authController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para el login (sin protección, ya que es para obtener el token)
router.post('/login', login);

// Ruta para el registro (solo los administradores pueden registrar usuarios)
router.post('/register', authMiddleware, isAdmin, register);

module.exports = router;
