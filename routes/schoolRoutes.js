const express = require('express');
const multer = require('multer');
const {
    getAllSchools, getSchoolsByUser, createSchool, updateSchool, deleteSchool, getSchoolById
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



// Ruta para obtener una escuela específica (acceso basado en permisos)
router.get('/:id_school', authMiddleware, async (req, res) => {
    try {
        const schoolId = parseInt(req.params.id_school);
        
        // Si es admin, puede ver cualquier escuela
        if (req.user.tipo === 'Administrador') {
            const school = await getSchoolById(schoolId);
            if (!school) {
                return res.status(404).json({ message: 'Escuela no encontrada' });
            }
            return res.json(school);
        }
        
        // Si es usuario normal, solo puede ver la escuela vinculada a su estudiante
        if (req.user.tipo === 'Usuario' && req.user.id_school === schoolId) {
            const school = await getSchoolById(schoolId);
            if (!school) {
                return res.status(404).json({ message: 'Escuela no encontrada' });
            }
            return res.json(school);
        }
        
        // Si el usuario no tiene acceso a esta escuela
        return res.status(403).json({ message: 'No tienes acceso a esta escuela' });
    } catch (error) {
        console.error('Error al obtener la escuela:', error);
        res.status(500).json({ message: 'Error al obtener la escuela' });
    }
});

// Rutas protegidas para administradores
router.get('/', authMiddleware, getAllSchools); // Obtener todas las escuelas
router.post('/', authMiddleware, isAdmin, upload.single('foto'), createSchool); // Crear una nueva escuela (con carga de imagen)
router.put('/:id_school', authMiddleware, upload.single('foto'), updateSchool); // Actualizar una escuela (con carga de imagen)
router.delete('/:id_school', authMiddleware, isAdmin, deleteSchool); // Eliminar una escuela

module.exports = router;