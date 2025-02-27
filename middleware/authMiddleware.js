const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); 

// Middleware de autenticación
const authMiddleware = async (req, res, next) => {
   // console.log(req.header('Authorization').split(' ')[1]);
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

    try {
        console.log(jwt.verify(token, process.env.JWT_SECRET))

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(user.findById);

        const user = await User.findById(decoded.id_user);
        
        if (!user) return res.status(404).json({ message: 'no se encontró el user' });

        req.user = user; // Guardar el usuario completo en la request
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar si el usuario está vinculado a la escuela
const isUser = (req, res, next) => {
    if (req.user.tipo === 'Usuario' && req.user.id_school === req.body.id_school) {
        return next();
    }
    return res.status(403).json({ message: 'Acceso no autorizado a esta escuela' });
};

// Middleware para verificar si el usuario es un administrador
const isAdmin = (req, res, next) => {
    if (req.user.tipo === 'Administrador') {
        return next();
    }
    return res.status(403).json({ successes:true, message: 'Acceso solo permitido a administradores' });
};

// Middleware para permitir que un estudiante solo vea o actualice su propio registro
const isOwnStudent = (req, res, next) => {
    const studentId = req.params.id;
    
    if (req.user.tipo === 'Usuario' && req.user.id === parseInt(studentId)) {
        return next();
    }
    return res.status(403).json({ successes:false, message: 'No tienes permiso para modificar otros estudiantes' });
};

module.exports = { authMiddleware, isUser, isAdmin, isOwnStudent };