const School = require('../models/schoolModel');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// Obtener todas las escuelas (solo para administradores)
const getAllSchools = async (req, res) => {
    try {
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'Acceso solo permitido a administradores' });
        }

        const schools = await School.getAllSchools();
        res.json({ success: true, data: schools });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las escuelas', error: error.message });
    }
};

// Obtener escuelas vinculadas al usuario (para usuarios normales)
const getSchoolsByUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id_user) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
        }

        const schools = await School.getSchoolsByUserId(req.user.id_user);
        res.json({ success: true, data: schools });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las escuelas del usuario', error: error.message });
    }
};

// Crear una nueva escuela (solo para administradores)
const createSchool = async (req, res) => {
    try {
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'Acceso solo permitido a administradores' });
        }

        const { nombre, direccion, email, latitud, longitud, id_user } = req.body;
        if (!nombre) {
            return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
        }

        const lat = latitud ? parseFloat(latitud) : null;
        const lng = longitud ? parseFloat(longitud) : null;

        if ((latitud && isNaN(lat)) || (longitud && isNaN(lng))) {
            return res.status(400).json({ success: false, message: 'Latitud y longitud deben ser números válidos' });
        }

        const foto = req.file ? req.file.path : null;
        const newSchool = await School.createSchool({
            nombre,
            direccion,
            email,
            foto,
            id_user,
            latitud: lat,
            longitud: lng,
        });

        res.status(201).json({ success: true, message: 'Escuela creada con éxito', id_school: newSchool });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear la escuela', error: error.message });
    }
};

// Actualizar escuela (solo para administradores)
const updateSchool = async (req, res) => {
    try {
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'Acceso solo permitido a administradores' });
        }

        const { id_school } = req.params;
        const { nombre, direccion, email, id_user, latitud, longitud } = req.body;

        if (!nombre) {
            return res.status(400).json({ success: false, message: 'El nombre es obligatorio' });
        }

        const lat = latitud ? parseFloat(latitud) : null;
        const lng = longitud ? parseFloat(longitud) : null;

        if ((latitud && isNaN(lat)) || (longitud && isNaN(lng))) {
            return res.status(400).json({ success: false, message: 'Latitud y longitud deben ser números válidos' });
        }

        const foto = req.file ? req.file.path : null;
        const updated = await School.updateSchool(id_school, {
            nombre,
            direccion,
            email,
            foto,
            id_user,
            latitud: lat,
            longitud: lng,
        });

        if (updated) {
            res.json({ success: true, message: 'Escuela actualizada correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Escuela no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la escuela', error: error.message });
    }
};

// Eliminar escuela (solo para administradores)
const deleteSchool = async (req, res) => {
    try {
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'Acceso solo permitido a administradores' });
        }

        const { id_school } = req.params;
        const deleted = await School.deleteSchool(id_school);

        if (deleted) {
            res.json({ success: true, message: 'Escuela eliminada correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Escuela no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar la escuela', error: error.message });
    }
};

module.exports = {
    getAllSchools,
    getSchoolsByUser,
    createSchool,
    updateSchool,
    deleteSchool,
};
