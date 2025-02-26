const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { handleFileUpload } = require('../controllers/uploadController');

const router = express.Router();

// Asegurarse que la carpeta uploads existe
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Ruta para subir archivos
router.post('/', upload.single('file'), handleFileUpload);

module.exports = router;