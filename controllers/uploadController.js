const path = require('path');

const handleFileUpload = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se ha subido ningún archivo' });
        }

        // Validar el tipo de archivo si es necesario
        const allowedTypes = ['image/png']; 
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                success: false,
                message: 'Tipo de archivo no permitido. Solo se permiten archivos JPEG, PNG y PDF' 
            });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            success: true,
            message: 'Archivo subido exitosamente',
            fileUrl,
            fileName: req.file.originalname
        });
    } catch (error) {
        console.error('Error en handleFileUpload:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al procesar la subida del archivo',
            error: error.message 
        });
    }
};

module.exports = { handleFileUpload };
