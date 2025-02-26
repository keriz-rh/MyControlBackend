const Student = require('../models/studentModel');

// Obtener todos los alumnos (administrador) o alumnos de una escuela (usuario)
const getAllStudents = async (req, res) => {
    try {
        let students;
        if (req.user.tipo === 'Administrador') {
            // Si es administrador, obtener todos los estudiantes
            students = await Student.getAllStudents();
        } else {
            // Si es usuario, obtener solo los estudiantes de su escuela
            students = await Student.getStudentsBySchool(req.user.id_school); // Asegúrate de que req.user.id_school esté disponible
        }

        // Formatear la respuesta
        const formattedStudents = students.map(student => ({
            id_alumno: student.id_alumno, 
            nombre_completo: student.nombre_completo,
            direccion: student.direccion,
            telefono: student.telefono,
            email: student.email,
            foto: student.foto, 
            genero: student.genero,
            latitud: student.latitud,
            longitud: student.longitud,
            id_grado: student.id_grado,
            id_seccion: student.id_seccion,
            id_school: student.id_school,
            padres: student.padres || [] // Incluir los padres vinculados (o un array vacío si no hay padres)
        }));

        res.json({ success: true, students: formattedStudents });
    } catch (error) {
        console.error('Error en getAllStudents:', error.message, error.stack); // Log detallado
        res.status(500).json({ success: false, message: 'Error al obtener los alumnos' });
    }
};

const createStudent = async (req, res) => {
    try {
        // Verificar si el usuario es administrador
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'Solo los administradores pueden crear alumnos' });
        }

        // Extraer datos del cuerpo de la solicitud
        const { nombre_completo, direccion, telefono, email, genero, latitud, longitud, id_grado, id_seccion, id_school, padres } = req.body;

        // Validar campos requeridos
        if (!nombre_completo || !id_grado || !id_seccion || !id_school) {
            return res.status(400).json({ success: false, message: 'Campos requeridos faltantes' });
        }

        // Obtener la ruta de la foto (si se proporciona)
        const foto = req.file ? req.file.path : null;

        // Crear el alumno
        const newStudentId = await Student.createStudentWithParents({
            nombre_completo,
            direccion,
            telefono,
            email,
            foto,
            genero,
            latitud,
            longitud,
            id_grado,
            id_seccion,
            id_school,
        }, padres || []);

        // Respuesta exitosa
        res.status(201).json({ success: true, id: newStudentId, message: 'Alumno y padres vinculados correctamente' });
    } catch (error) {
        console.error('Error en createStudent:', error.message, error.stack); // Log detallado
        res.status(500).json({ success: false, message: 'Error al crear el alumno y vincular padres' });
    }
};

  //// Actualiza un alumno (solo administrador)
  const updateStudent = async (req, res) => {
    try {
      // Verificar si el usuario es administrador
      if (req.user.tipo !== 'Administrador') {
        return res.status(403).json({ success: false, message: 'Solo los administradores pueden actualizar alumnos' });
      }
  
      const { id } = req.params;
  
      // Validar si los campos de la solicitud están vacíos o mal formateados
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: 'No se proporcionaron datos para actualizar' });
      }
  
      // Adjuntar la foto al cuerpo de la solicitud
      const foto = req.file ? req.file.path : null;
  
      // Actualizar el alumno
      const updated = await Student.updateStudent(id, {
        ...req.body,
        foto,
      });
  
      if (updated) {
        res.json({ success: true, message: 'Alumno actualizado correctamente', data: req.body });
      } else {
        res.status(404).json({ success: false, message: 'Alumno no encontrado' });
      }
    } catch (error) {
      console.error(error); // Agregar log para depuración
      res.status(500).json({ success: false, message: 'Error al actualizar el alumno' });
    }
  };

// Eliminar un alumno (solo administrador)
const deleteStudent = async (req, res) => {
    try {
        // Verificar si el usuario es administrador
        if (req.user.tipo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'Solo los administradores pueden eliminar alumnos' });
        }

        // Obtener el ID del alumno de los parámetros de la ruta
        const { id } = req.params;

        // Validar que el ID no sea undefined
        if (!id) {
            return res.status(400).json({ success: false, message: 'ID del alumno no proporcionado' });
        }

        // Eliminar el alumno
        const deleted = await Student.deleteStudent(id);
        if (deleted) {
            res.json({ success: true, message: 'Alumno eliminado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Alumno no encontrado' });
        }
    } catch (error) {
        console.error('Error en deleteStudent:', error.message, error.stack); // Log detallado
        res.status(500).json({ success: false, message: 'Error al eliminar el alumno' });
    }
};

module.exports = { getAllStudents, createStudent, updateStudent, deleteStudent };
