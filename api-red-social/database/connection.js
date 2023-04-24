const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/red-social');
        console.log('Database connected: red-social');
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }
}

module.exports = {
    connection
}