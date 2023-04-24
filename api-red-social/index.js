//dependencias
const { connection } = require('./database/connection');
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const followRoutes = require('./routes/follow');
const publicationRoutes = require('./routes/publication');


//mensaje de bienvenida
console.log('Bienvenido a la API de red-social');
// conexion a bbdd
connection();
//crear servidor node
const app = express();
const port = 3900;


//configurar cors
app.use(cors());

//convertir los datos del body a objetos js
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cargar conf rutas
app.use('/api/user', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/publication', publicationRoutes);

//tuta de prueba
app.get('/prueba', (req, res) => {
    res.status(200).json({ message: 'Bienvenido a la red social' });
});

//poner servidor a escuchar peticiones http
app.listen(port, () => {
    console.log('Servidor corriendo en puerto ' , port);
});