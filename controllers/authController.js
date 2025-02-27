const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey'; 

// Función para el login de usuarios
const login = async (req, res) => {
    console.log(req.body);
    
    const { usuario, password } = req.body;

    try {
        const query = 'SELECT * FROM usuarios WHERE usuario = ?';
        const [user] = await db.query(query, [usuario]);

        if (user.length === 0) {
            return res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        
        if (!validPassword) {
            return res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id_user: user[0].id_user, tipo: user[0].tipo, id_school: user[0].id_school },
            jwtSecret, 
            { expiresIn: '1h' } 
        );

        res.status(200).json({ success: true, tipo: user[0].tipo, message: 'Autenticación exitosa', token });
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor al iniciar sesión' });
    }
};

// Función para el registro de nuevos usuarios
const register = async (req, res) => {
    const { nombre, usuario, password, tipo, id_school } = req.body;

    if (!nombre || !usuario || !password || !tipo || !id_school) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    try {
        const [existingUser] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'El usuario ya está registrado' });
        }

        if (tipo !== 'Administrador' && tipo !== 'Usuario') {
            return res.status(400).json({ success: false, message: 'Tipo de usuario no válido (Administrador o Usuario)' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO usuarios (nombre, usuario, password, tipo, id_school) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [nombre, usuario, hashedPassword, tipo, id_school]);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado con éxito',
            user: { nombre, usuario, tipo, id_school }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor al registrar usuario' });
    }
};

module.exports = { login, register };
