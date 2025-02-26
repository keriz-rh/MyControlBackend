const Parent = require('../models/parentModel');

// Obtener todos los padres (filtrado por escuela si el usuario no es administrador)
const getAllParents = async (req, res) => {
    try {
        const { id_padre, tipo } = req.user;
        
        // Si el usuario no es administrador, filtra por su escuela
        const parents = await Parent.getAllParents(tipo === 'Administrador' ? null : id_padre);
        res.json({ success: true, parents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener los padres', error });
    }
};

// Crear un nuevo padre
const createParent = async (req, res) => {
    try {
        const { id_padre, tipo } = req.user;
        
        // Si el usuario no es administrador, asigna su escuela al nuevo padre
        const parentData = {
            ...req.body,
            id_padre: tipo === 'Administrador' ? req.body.id_padre : id_padre,
        };
        
        const newParent = await Parent.createParent(parentData);
        res.status(201).json({ success: true, id: newParent, ...parentData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al crear el padre', error });
    }
};

// Actualizar un padre
const updateParent = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_padre, tipo } = req.user;
        
        // Verificar si el padre existe
        const parent = await Parent.getParentById(id);
        if (!parent) {
            return res.status(404).json({ success: false, message: 'Padre no encontrado' });
        }
        
        // Si el usuario no es administrador, verificar que el padre pertenezca a su escuela
        if (tipo !== 'Administrador' && parent.id_padre !== id_padre) {
            return res.status(403).json({ success: false, message: 'Acceso denegado' });
        }
        
        // Actualizar el padre
        const updated = await Parent.updateParent(id, req.body);
        if (updated) {
            res.json({ success: true, message: 'Padre actualizado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Padre no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el padre', error });
    }
};

// Eliminar un padre
const deleteParent = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_padre, tipo } = req.user;
        
        // Verificar si el padre existe
        const parent = await Parent.getParentById(id);
        if (!parent) {
            return res.status(404).json({ success: false, message: 'Padre no encontrado' });
        }
        
        // Si el usuario no es administrador, verificar que el padre pertenezca a su escuela
        if (tipo !== 'Administrador' && parent.id_padre !== id_padre) {
            return res.status(403).json({ success: false, message: 'Acceso denegado' });
        }
        
        // Eliminar el padre
        const deleted = await Parent.deleteParent(id);
        if (deleted) {
            res.json({ success: true, message: 'Padre eliminado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Padre no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar el padre', error });
    }
};

module.exports = { getAllParents, createParent, updateParent, deleteParent };
