import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
const translate = require('node-google-translate-skidz');//


const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(process.cwd(), 'public')));

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// Ruta para obtener departamentos
app.get('/api/departments', async (req, res) => {
    try {
        const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/departments');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});



//traductor
app.post('/translate', (req, res) => {
    const { text, targetLang } = req.body;

    translate({
        text: text,
        source: 'en', // Idioma de origen (Inglés)
        target: targetLang, // Idioma de destino (Español)
    }, (result) => {
        if (result && result.translation) {
            res.json({ translatedText: result.translation });
        } else {
            res.status(500).json({ error: 'Error al traducir el texto' });
        }
    });
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});