const db = require('../config/db');

class Student {
    // Obtener todos los alumnos (para administradores)
    static async getAllStudents() {
        const [rows] = await db.query(`
            SELECT 
                a.id_alumno,
                a.nombre_completo,
                a.direccion,
                a.telefono,
                a.email,
                a.foto,
                a.genero,
                a.latitud,
                a.longitud,
                a.id_grado,
                a.id_seccion,
                a.id_school,
                s.nombre AS nombre_school,  -- Agregar el nombre de la escuela
                p.id_padre,
                p.nombre AS nombre_padre,
                p.direccion AS direccion_padre,
                p.telefono AS telefono_padre,
                pa.parentesco
            FROM 
                alumnos a
            LEFT JOIN 
                padres_alumnos pa ON a.id_alumno = pa.id_alumno
            LEFT JOIN 
                padres p ON pa.id_padre = p.id_padre
            LEFT JOIN 
                school s ON a.id_school = s.id_school  -- Unir con la tabla school
        `);
    
        const estudiantes = rows.reduce((acc, row) => {
            const alumno = acc.find(a => a.id_alumno === row.id_alumno);
            if (alumno) {
                // Si el alumno ya existe, agrega los padres
                if (row.id_padre) {
                    alumno.padres.push({
                        id_padre: row.id_padre,
                        nombre: row.nombre_padre,
                        direccion: row.direccion_padre,
                        telefono: row.telefono_padre,
                        parentesco: row.parentesco
                    });
                }
            } else {
                // Si el alumno no existe, crea el objeto completo
                acc.push({
                    id_alumno: row.id_alumno,
                    nombre_completo: row.nombre_completo,
                    direccion: row.direccion,
                    telefono: row.telefono,
                    email: row.email,
                    foto: row.foto,
                    genero: row.genero,
                    latitud: row.latitud,
                    longitud: row.longitud,
                    id_grado: row.id_grado,
                    id_seccion: row.id_seccion,
                    id_school: row.id_school,
                    nombre_school: row.nombre_school,  // Agregar el nombre de la escuela
                    padres: row.id_padre ? [{
                        id_padre: row.id_padre,
                        nombre: row.nombre_padre,
                        direccion: row.direccion_padre,
                        telefono: row.telefono_padre,
                        parentesco: row.parentesco
                    }] : []
                });
            }
            return acc;
        }, []);
    
        return estudiantes;
    }
    
    static async getStudentsBySchool(id_school) {
        const [alumnos] = await db.query(`
            SELECT 
                a.*, 
                s.nombre AS nombre_school,  -- Agregar el nombre de la escuela
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id_padre', p.id_padre,
                        'nombre_padre', p.nombre,
                        'parentesco', pa.parentesco
                    )
                ) AS padres
            FROM alumnos a
            LEFT JOIN padres_alumnos pa ON a.id_alumno = pa.id_alumno
            LEFT JOIN padres p ON pa.id_padre = p.id_padre
            LEFT JOIN school s ON a.id_school = s.id_school  -- Unir con la tabla school
            WHERE a.id_school = ?
            GROUP BY a.id_alumno
        `, [id_school]);
    
        // Convertir los padres a objetos JSON
        alumnos.forEach(alumno => {
            alumno.padres = alumno.padres ? JSON.parse(`[${alumno.padres}]`) : [];
        });
    
        return alumnos;
    }

static async getParentsByStudentId(id_alumno) {
    const [rows] = await db.query(
        `SELECT 
            a.id_alumno, 
            a.nombre_completo, 
            p.id_padre, 
            p.nombre AS nombre_padre, 
            pa.parentesco
         FROM alumnos a
         INNER JOIN padres_alumnos pa ON a.id_alumno = pa.id_alumno
         INNER JOIN padres p ON pa.id_padre = p.id_padre
         WHERE a.id_alumno = ?`, 
        [id_alumno]
    );
    return rows;
}

    // Crear un nuevo alumno y vincular padres
    static async createStudentWithParents(student, parents = []) {
        const { nombre_completo, direccion, telefono, email, foto, genero, latitud, longitud, id_grado, id_seccion, id_school } = student;

        // Insertar alumno
        const [result] = await db.query(
            'INSERT INTO alumnos (nombre_completo, direccion, telefono, email, foto, genero, latitud, longitud, id_grado, id_seccion, id_school) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre_completo, direccion, telefono, email, foto, genero, latitud, longitud, id_grado, id_seccion, id_school]
        );
        const id_alumno = result.insertId;

        // Vincular padres (si se proporcionan)
        for (const parent of parents) {
            const { id_padre, parentesco } = parent;
            await this.linkParentToStudent(id_alumno, id_padre, parentesco);
        }

        return id_alumno;
    }

    // Vincular un padre a un alumno
    static async linkParentToStudent(id_alumno, id_padre, parentesco) {
        const [result] = await db.query(
            'INSERT INTO padres_alumnos (id_alumno, id_padre, parentesco) VALUES (?, ?, ?)',
            [id_alumno, id_padre, parentesco]
        );
        return result;
    }

    
// Actualizar un alumno (solo para administradores)
static async updateStudent(id, student) {
    const { 
        nombre_completo, direccion, telefono, email, foto, genero, 
        latitud, longitud, id_grado, id_seccion, id_school, padres 
    } = student;

    // Actualizar los datos del alumno
    const [result] = await db.query(
        `UPDATE alumnos 
         SET nombre_completo = ?, direccion = ?, telefono = ?, email = ?, foto = ?, 
             genero = ?, latitud = ?, longitud = ?, id_grado = ?, id_seccion = ?, id_school = ?
         WHERE id_alumno = ?`,
        [nombre_completo, direccion, telefono, email, foto, genero, latitud, longitud, id_grado, id_seccion, id_school, id]
    );

    // Si no se actualizó ningún alumno, retornamos 0
    if (result.affectedRows === 0) return 0;

    // Actualizar la relación de padres
    if (padres && padres.length > 0) {
        // Eliminar relaciones antiguas
        await db.query('DELETE FROM padres_alumnos WHERE id_alumno = ?', [id]);

        // Insertar las nuevas relaciones de padres
        for (const padre of padres) {
            const { id_padre, parentesco } = padre;
            await db.query(
                `INSERT INTO padres_alumnos (id_alumno, id_padre, parentesco)
                 VALUES (?, ?, ?)`,
                [id, id_padre, parentesco]
            );
        }
    }

    return result.affectedRows;
}

    // Eliminar un alumno (solo para administradores)
    static async deleteStudent(id) {
        const [result] = await db.query('DELETE FROM alumnos WHERE id_alumno = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Student;