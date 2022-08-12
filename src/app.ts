import express from 'express';
import bodyParser from 'body-parser';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import * as path from 'path';

import api from './api.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'style.css'));
});

app.use('/api', api);

app.listen(3000, 'localhost', () => {
    console.log('Server started on port 3000');
});
