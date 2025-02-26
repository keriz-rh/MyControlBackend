const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Carpeta donde se guardarán los archivos

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`; // URL del archivo subido
    res.json({ fileUrl });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

app.listen(5000, () => {
    console.log('Server running on port 5000');
});