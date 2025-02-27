const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    // Buscar un usuario por su nombre de usuario
    static async findByUsername(username) {
        const [rows] = await db.query(`
            SELECT u.*, s.id_school, s.nombre AS nombre_escuela
            FROM usuarios u
            LEFT JOIN school s ON s.id_user = u.id_user
            WHERE u.usuario = ?`,
            [username]
        );
        return rows[0];
    }

    // Buscar un usuario por su ID
    static async findById(id) {
        const [rows] = await db.query(`
            SELECT u.*, s.id_school, s.nombre AS nombre_escuela
            FROM usuarios u
            LEFT JOIN school s ON s.id_user = u.id_user
            WHERE u.id_user = ?`,
            [id]
        );
        return rows[0];
    }

    // Crear un nuevo usuario con encriptación de contraseña
    static async createUser(user) {
        const { nombre, usuario, password, tipo } = user;
        const validRoles = ['Administrador', 'Usuario'];
        if (!validRoles.includes(tipo)) {
            throw new Error('Tipo de usuario no válido');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, usuario, password, tipo) VALUES (?, ?, ?, ?)',
            [nombre, usuario, hashedPassword, tipo]
        );
        return result.insertId;
    }

    // Comparar la contraseña en texto plano con la encriptada
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Obtener todos los usuarios con la información de la escuela si existe
    static async getAllUsers() {
        const [rows] = await db.query(`
            SELECT u.id_user, u.nombre, u.usuario, u.tipo, s.id_school, s.nombre AS nombre_escuela
            FROM usuarios u
            LEFT JOIN school s ON s.id_user = u.id_user
        `);
        return rows;
    }
}

module.exports = User;
