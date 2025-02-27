const db = require('../config/db');

class Parent {
    // Obtener todos los padres (sin filtro por escuela)
    static async getAllParents() {
        const query = `
            SELECT 
                id_padre, 
                nombre AS nombre_padre, 
                direccion, 
                telefono
            FROM padres
        `;
        
        const [rows] = await db.query(query);
        return rows;
    }

    // Obtener un padre por ID (sin validación por escuela)
    static async getParentById(id) {
        const query = `
            SELECT 
                id_padre, 
                nombre AS nombre_padre, 
                direccion, 
                telefono
            FROM padres
            WHERE id_padre = ?
        `;
        
        const [rows] = await db.query(query, [id]);
        return rows[0];
    }

    // Crear un nuevo padre (sin id_school)
    static async createParent(parent) {
        const { nombre, direccion, telefono } = parent;
        const [result] = await db.query(
            'INSERT INTO padres (nombre, direccion, telefono) VALUES (?, ?, ?)',
            [nombre, direccion, telefono]
        );
        return result.insertId;
    }

    // Actualizar un padre (sin id_school)
    static async updateParent(id, parent) {
        const { nombre, direccion, telefono } = parent;
        const [result] = await db.query(
            'UPDATE padres SET nombre = ?, direccion = ?, telefono = ? WHERE id_padre = ?',
            [nombre, direccion, telefono, id]
        );
        return result.affectedRows;
    }

    // Eliminar un padre
    static async deleteParent(id) {
        const [result] = await db.query('DELETE FROM padres WHERE id_padre = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Parent;