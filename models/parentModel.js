const db = require('../config/db');

class Parent {
    // Obtener todos los padres (con filtro por escuela si se proporciona)
    static async getAllParents(id_school = null) {
        let query = `
            SELECT 
                p.id_padre, 
                p.nombre AS nombre_padre, 
                p.direccion, 
                p.telefono, 
                p.id_school, 
                s.nombre AS nombre_escuela
            FROM padres p
            JOIN school s ON p.id_school = s.id_school
        `;
        const params = [];

        if (id_school !== null) {
            query += ' WHERE p.id_school = ?';
            params.push(id_school);
        }

        const [rows] = await db.query(query, params);
        return rows;
    }

    // Obtener un padre por ID y validar que pertenezca a la escuela del usuario
    static async getParentById(id, id_school = null) {
        let query = `
            SELECT 
                p.id_padre, 
                p.nombre AS nombre_padre, 
                p.direccion, 
                p.telefono, 
                p.id_school, 
                s.nombre AS nombre_escuela
            FROM padres p
            JOIN school s ON p.id_school = s.id_school
            WHERE p.id_padre = ?
        `;
        const params = [id];

        if (id_school !== null) {
            query += ' AND p.id_school = ?';
            params.push(id_school);
        }

        const [rows] = await db.query(query, params);
        return rows[0];
    }

    // Crear un nuevo padre
    static async createParent(parent) {
        const { nombre, direccion, telefono, id_school } = parent;
        const [result] = await db.query(
            'INSERT INTO padres (nombre, direccion, telefono, id_school) VALUES (?, ?, ?, ?)',
            [nombre, direccion, telefono, id_school]
        );
        return result.insertId;
    }

    // Actualizar un padre
    static async updateParent(id, parent) {
        const { nombre, direccion, telefono, id_school } = parent;
        const [result] = await db.query(
            'UPDATE padres SET nombre = ?, direccion = ?, telefono = ?, id_school = ? WHERE id_padre = ?',
            [nombre, direccion, telefono, id_school, id]
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