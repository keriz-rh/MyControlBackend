const db = require('../config/db');

class ParentStudent {
    // Obtener todas las relaciones padre-alumno con detalles
    static async getAllParentStudents() {
        try {
            const [rows] = await db.query(`
                SELECT 
                    pa.id_padre_alumno,
                    pa.id_alumno,
                    a.nombre_completo AS nombre_alumno,
                    pa.id_padre,
                    p.nombre AS nombre_padre,
                    pa.parentesco
                FROM padres_alumnos pa
                JOIN alumnos a ON pa.id_alumno = a.id_alumno
                JOIN padres p ON pa.id_padre = p.id_padre
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las relaciones padre-alumno: ' + error.message);
        }
    }

    // Obtener relaciones padre-alumno por ID de alumno con detalles
    static async getAllParentStudentsForStudent(id_alumno) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    pa.id_padre_alumno,
                    pa.id_alumno,
                    a.nombre_completo AS nombre_alumno,
                    pa.id_padre,
                    p.nombre AS nombre_padre,
                    pa.parentesco
                FROM padres_alumnos pa
                JOIN alumnos a ON pa.id_alumno = a.id_alumno
                JOIN padres p ON pa.id_padre = p.id_padre
                WHERE pa.id_alumno = ?
            `, [id_alumno]);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las relaciones padre-alumno para el alumno: ' + error.message);
        }
    }

    // Obtener una relación padre-alumno por su ID con detalles
    static async getParentStudentById(id_padre_alumno) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    pa.id_padre_alumno,
                    pa.id_alumno,
                    a.nombre_completo AS nombre_alumno,
                    pa.id_padre,
                    p.nombre AS nombre_padre,
                    pa.parentesco
                FROM padres_alumnos pa
                JOIN alumnos a ON pa.id_alumno = a.id_alumno
                JOIN padres p ON pa.id_padre = p.id_padre
                WHERE pa.id_padre_alumno = ?
            `, [id_padre_alumno]);
            if (rows.length === 0) {
                throw new Error('Relación padre-alumno no encontrada');
            }
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener la relación padre-alumno: ' + error.message);
        }
    }

    // Crear una nueva relación padre-alumno
    static async createParentStudent(data) {
        const { id_alumno, id_padre, parentesco } = data;

        // Validar que los campos no estén vacíos
        if (!id_alumno || !id_padre || !parentesco) {
            throw new Error('Todos los campos (id_alumno, id_padre, parentesco) son obligatorios');
        }

        // Verificar si el alumno y el padre existen
        const [alumno] = await db.query('SELECT * FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        if (alumno.length === 0) {
            throw new Error('El alumno no existe');
        }

        const [padre] = await db.query('SELECT * FROM padres WHERE id_padre = ?', [id_padre]);
        if (padre.length === 0) {
            throw new Error('El padre no existe');
        }

        // Verificar si ya existe una relación duplicada
        const [existing] = await db.query(
            'SELECT * FROM padres_alumnos WHERE id_alumno = ? AND id_padre = ?',
            [id_alumno, id_padre]
        );
        if (existing.length > 0) {
            throw new Error('Ya existe una relación entre este alumno y este padre');
        }

        try {
            const [result] = await db.query(
                'INSERT INTO padres_alumnos (id_alumno, id_padre, parentesco) VALUES (?, ?, ?)',
                [id_alumno, id_padre, parentesco]
            );
            return { id_padre_alumno: result.insertId, message: 'Relación creada exitosamente' };
        } catch (error) {
            throw new Error('Error al crear la relación padre-alumno: ' + error.message);
        }
    }

    // Actualizar una relación padre-alumno
    static async updateParentStudent(id_padre_alumno, data) {
        const { id_alumno, id_padre, parentesco } = data;

        // Validar que los campos no estén vacíos
        if (!id_alumno || !id_padre || !parentesco) {
            throw new Error('Todos los campos (id_alumno, id_padre, parentesco) son obligatorios');
        }

        // Verificar si el alumno y el padre existen
        const [alumno] = await db.query('SELECT * FROM alumnos WHERE id_alumno = ?', [id_alumno]);
        if (alumno.length === 0) {
            throw new Error('El alumno no existe');
        }

        const [padre] = await db.query('SELECT * FROM padres WHERE id_padre = ?', [id_padre]);
        if (padre.length === 0) {
            throw new Error('El padre no existe');
        }

        try {
            const [result] = await db.query(
                'UPDATE padres_alumnos SET id_alumno = ?, id_padre = ?, parentesco = ? WHERE id_padre_alumno = ?',
                [id_alumno, id_padre, parentesco, id_padre_alumno]
            );
            if (result.affectedRows === 0) {
                throw new Error('Relación padre-alumno no encontrada');
            }
            return { message: 'Relación actualizada exitosamente', affectedRows: result.affectedRows };
        } catch (error) {
            throw new Error('Error al actualizar la relación padre-alumno: ' + error.message);
        }
    }

    // Eliminar una relación padre-alumno
    static async deleteParentStudent(id_padre_alumno) {
        try {
            const [result] = await db.query('DELETE FROM padres_alumnos WHERE id_padre_alumno = ?', [id_padre_alumno]);
            if (result.affectedRows === 0) {
                throw new Error('Relación padre-alumno no encontrada');
            }
            return { message: 'Relación eliminada exitosamente', affectedRows: result.affectedRows };
        } catch (error) {
            throw new Error('Error al eliminar la relación padre-alumno: ' + error.message);
        }
    }
}

module.exports = ParentStudent;