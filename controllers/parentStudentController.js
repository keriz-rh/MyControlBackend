const ParentStudent = require('../models/parentStudentModel');

// Obtener todas las relaciones padre-alumno
const getAllParentStudents = async (req, res) => {
    try {
        let parentStudents;
        if (req.user.tipo === 'Administrador') {
            parentStudents = await ParentStudent.getAllParentStudents();
        } else {
            parentStudents = await ParentStudent.getAllParentStudentsForStudent(req.user.id_user);
        }
        res.status(200).json({ success: true, message: 'Relaciones obtenidas exitosamente', data: parentStudents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener las relaciones padre-alumno', error: error.message });
    }
};

// Crear una nueva relación padre-alumno
const createParentStudent = async (req, res) => {
    try {
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'No tienes permiso para crear relaciones' });
        }

        const { id_alumno, id_padre, parentesco } = req.body;
        if (!id_alumno || !id_padre || !parentesco) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }

        const newParentStudent = await ParentStudent.createParentStudent({ id_alumno, id_padre, parentesco });
        res.status(201).json({ success: true, message: 'Relación creada exitosamente', data: newParentStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear la relación padre-alumno', error: error.message });
    }
};

// Actualizar una relación padre-alumno
const updateParentStudent = async (req, res) => {
    try {
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'No tienes permiso para modificar relaciones' });
        }

        const { id_padre_alumno } = req.params;
        const { id_alumno, id_padre, parentesco } = req.body;

        if (!id_alumno || !id_padre || !parentesco) {
            return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
        }

        const updated = await ParentStudent.updateParentStudent(id_padre_alumno, { id_alumno, id_padre, parentesco });
        res.status(200).json({ success: true, message: 'Relación actualizada exitosamente', data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la relación padre-alumno', error: error.message });
    }
};

// Eliminar una relación padre-alumno
const deleteParentStudent = async (req, res) => {
    try {
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar relaciones' });
        }

        const { id_padre_alumno } = req.params;
        const deleted = await ParentStudent.deleteParentStudent(id_padre_alumno);
        res.status(200).json({ success: true, message: 'Relación eliminada exitosamente', data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar la relación padre-alumno', error: error.message });
    }
};

module.exports = { getAllParentStudents, createParentStudent, updateParentStudent, deleteParentStudent };