const express = require ('express');
//const fetch = require ('node-fetch');
const path = require ('path');
//const bodyParser = require ('body-parser');
const translate = require ('node-google-translate-skidz');

const fetch = (...args) => import('node-fetch').then(module => module.default(...args));

const app = express();
const PORT = 3000;

//app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })

// Middleware para parsear el body de las peticiones POST en formato JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
//app.use(express.static(path.join(process.cwd(), 'public')));

app.use(express.static(path.join(__dirname, 'public')));



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




app.post('/translate', (req, res) => {
    const { text, targetLang } = req.body;
    //console.log({ text, targetLang });
    // Usamos el traductor para traducir el texto
    translate({
        text: text,
        source: 'en', // Idioma original
        target: targetLang // Idioma objetivo
    
    }, (result) => {
        
        //console.log(result);
        if (result && result.translation) {
            res.json({ translatedText: result.translation });
        } else {
            res.status(500).json({ error: 'Error del servidor' });
        }
    });
});


app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});