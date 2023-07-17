const validator = require('validator');

const validate = (params) => {
    let errors = {};

    if (!params.name || validator.isEmpty(params.name) || validator.isLength(params.name, { min: 0, max: undefined })) {
        errors.name = 'El nombre es obligatorio';
    }
    if (!params.surname || validator.isEmpty(params.surname) || validator.isLength(params.surname, { min: 0, max: undefined })  ) {
        errors.surname = 'El apellido es obligatorio';
    }
    if (!params.email || validator.isEmpty(params.email)) {
        errors.email = 'El email es obligatorio';
    }
    else if (!validator.isEmail(params.email)) {
        errors.email = 'El email no es válido';
    }
    if (!params.password || validator.isEmpty(params.password)) {
        errors.password = 'La contraseña es obligatoria';
    }
    else if (params.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return errors;
}
module.exports ={ 
    validate
}