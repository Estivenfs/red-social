//Importar dependencias
const jwt = require('jwt-simple');
const moment = require('moment');

//Clave secreta
const secret = 'clave_secreta_red_social_46546854';

//Crear una funcion para generar el token
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
}

module.exports = {
    createToken,
    secret
};


