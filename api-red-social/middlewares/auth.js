//Importar modulos
const jwt = require('jwt-simple');
const moment = require('moment');

//importar clave secreta
const libjwt = require('../services/jwt');
const secret = libjwt.secret;

//middleware de autenticacion
exports.auth = (req, res, next) => {
    //Comprobar si llega autorizacion
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: 'error',
            message: 'La peticion no tiene cabecera de autenticacion'
        });
    }
    //Decodificar el token
    const token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        //Comprobar si el token ha expirado
        if (payload.exp <= moment().unix()) {
            return res.status(401).json({
                status: 'error',
                message: 'El token ha expirado'
            });
        }
    } catch (error) {
        return res.status(404).json({
            status: 'error',
            message: 'El token no es valido'
        });
    }
    //Adjuntar usuario identificado a la request
    req.user = payload;
    //Pasar a la accion
    next();
}

