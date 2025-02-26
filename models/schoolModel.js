const db = require('../config/db');

class School {
    // Obtener todas las escuelas (para administradores)
    static async getAllSchools() {
        try {
            const [rows] = await db.query('SELECT * FROM school');
            return rows;
        } catch (error) {
            console.error('Error al obtener las escuelas:', error);
            throw new Error('Error al obtener las escuelas desde la base de datos');
        }
    }

    // Obtener escuelas vinculadas a un usuario específico (para usuarios normales)
    static async getSchoolsByUserId(id_user) {
        try {
            const [rows] = await db.query('SELECT * FROM school WHERE id_user = ?', [id_user]);
            return rows;
        } catch (error) {
            console.error('Error al obtener las escuelas del usuario:', error);
            throw new Error('Error al obtener las escuelas vinculadas al usuario');
        }
    }

    // Crear una nueva escuela (solo para administradores)
    static async createSchool(school) {
        try {
            const { nombre, direccion, email, foto, latitud, longitud, id_user } = school;
            const [result] = await db.query(
                'INSERT INTO school (nombre, direccion, email, foto, latitud, longitud, id_user) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre, direccion, email, foto, latitud, longitud, id_user]
            );
            return result.insertId; // Retorna el ID de la nueva escuela
        } catch (error) {
            console.error('Error al crear la escuela:', error);
            throw new Error('Error al crear la escuela en la base de datos');
        }
    }

    // Actualizar una escuela (solo para administradores)
    static async updateSchool(id, school) {
        try {
            const { nombre, direccion, email, foto, latitud, longitud, id_user } = school;
            const [result] = await db.query(
                'UPDATE school SET nombre = ?, direccion = ?, email = ?, foto = ?, latitud = ?, longitud = ?, id_user = ? WHERE id_school = ?',
                [nombre, direccion, email, foto, latitud, longitud, id_user, id]
            );
            return result.affectedRows; // Retorna el número de filas afectadas
        } catch (error) {
            console.error('Error al actualizar la escuela:', error);
            throw new Error('Error al actualizar la escuela en la base de datos');
        }
    }

    // Eliminar una escuela (solo para administradores)
    static async deleteSchool(id) {
        try {
            const [result] = await db.query('DELETE FROM school WHERE id_school = ?', [id]);
            return result.affectedRows; // Retorna el número de filas afectadas
        } catch (error) {
            console.error('Error al eliminar la escuela:', error);
            throw new Error('Error al eliminar la escuela de la base de datos');
        }
    }
}

module.exports = School;