//importar dependencias y modulos
const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publications');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');
const fs = require('fs')
const path = require('path');
const mongoosePagination = require('mongoose-pagination');
const followService = require('../services/followService');
//acciones de prueba
const pruebaUser = (req, res) => {
    res.status(200).json({
        message: 'Mensaje enviado desde: controller/user.js',
        user: req.user
    });
}

//Registro de usuarios
const registerUser = async (req, res) => {
    //Recoger datos de la peticion
    const params = req.body;


    //Validar datos
    if (!params.name || !params.surname || !params.nick || !params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Rellena todos los campos'
        });
    }
    //Control usuarios duplicados
    try {
        const query = User.findOne({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        })
        const user = await query.exec();
        params.nick = params.nick.toLowerCase();
        if (user) {
            if (user && user.email == params.email) {
                return res.status(200).json({
                    status: 'error',
                    message: 'El email ya está registrado'
                });
            }
            if (user && user.nick == params.nick) {
                return res.status(200).json({
                    status: 'error',
                    message: 'El nick ya está registrado'
                });
            }
            return res.status(200).json({
                status: 'error',
                message: 'El usuario ya está registrado'
            });

        }


        //Cifrar contraseña
        try {
            const hash = await bcrypt.hash(params.password, 10);
            params.password = hash;
            
            //Crear objeto de usuario
            let userToSave = new User(params);
            //Guardar usuario en la base de datos
            let userSaved = await userToSave.save();
            userSaved.password = null;
            return res.status(200).json({
                status: 'success',
                message: 'Usuario registrado correctamente',
                user: userSaved
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al guardar usuario'
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'error',
            message: 'Error al comprobar duplicidad de usuario'
        });

    }

}

//Login de usuarios
const loginUser = async (req, res) => {
    //Recoger datos de la peticion
    const params = req.body;
    //Validar datos
    if (!params.email || !params.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Rellena todos los campos'
        });
    }
    //Buscar usuarios que coincidan con el email
    try {
        const query = User.findOne({ email: params.email.toLowerCase() });//.select({"passsword": 0});
        const dataUser = await query.exec();
        if (dataUser) {
            //Comprobar la contraseña (coincidencia de email y password / bcrypt)
            const match = await bcrypt.compare(params.password, dataUser.password);
            //eliminar propiedad password
            delete dataUser.password;
            if (match) {
                //Generar token de jwt y devolverlo
                const token = jwt.createToken(dataUser);
                return res.status(200).json({
                    status: 'success',
                    message: 'Usuario logueado correctamente',
                    user: {
                        id: dataUser._id,
                        name: dataUser.name,
                        surname: dataUser.surname,
                        nick: dataUser.nick
                    },
                    token
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'La contraseña es incorrecta'
                });
            }
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'El usuario no existe'
            });
        }

    } catch (error) {

    }




    return res.status(200).json({
        status: 'success',
        message: 'Usuario logueado correctamente'
    });

}

const profileUser = async (req, res) => {
    //Recibir el parametro del id del usario por la url
    const id = req.params.id;
    //Consulta para sacar los datos del usuario
    try {
        const query = User.findById(id).select({ "password": 0, "role": 0 });
        const user = await query.exec();
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'El usuario no existe'
            });
        }

        //Info de seguimiento
        const followInfo = await followService.followThisUser(req.user.id, id);
        //Posteriormente agregar informacion de follows
        return res.status(200).json({
            status: 'success',
            message: 'Usuario encontrado',
            user,
            following: followInfo.following,
            follower: followInfo.follower
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al buscar el usuario'
        });
    }



    //Devolver respuesta
}

const list = async (req, res) => {
    //Controlar la pagina actual
    let page = req.params.page ? req.params.page : 1;
    page = parseInt(page);
    //Controlar el numero de items por pagina
    let itemsPerPage = req.params.itemsPerPage ? req.params.itemsPerPage : 5;

    //Consulta con mongoose paginate
    try {
        const query = User.find().select({ password: 0, role: 0 }).sort('_id').paginate(page, itemsPerPage);
        const total = await User.countDocuments();
        const users = await query.exec();
        if (!users || users.length == 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No hay usuarios'
            });
        }
        const followUserIds = await followService.followUserIds(req.user.id);
        return res.status(200).json({
            status: 'success',
            users,
            total,
            page,
            itemsPerPage,
            pages: Math.ceil(total / itemsPerPage),
            users_following: followUserIds.follows,
            users_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al buscar los usuarios'
        });
    }

}

const update = async (req, res) => {
    //Recoger info del usuario a actualizar
    const userIdentity = req.user;
    let userToUpdate = req.body;

    //Eliminar campos sobrantes
    delete userIdentity.iat;
    delete userIdentity.exp;
    delete userIdentity.role;
    delete userIdentity.image;

    //Comproba si el usuario ya existe
    try {
        let query = User.find({
            $or: [
                { email: userToUpdate.email.toLowerCase() },
                { nick: userToUpdate.nick.toLowerCase() }
            ]
        })
        const users = await query.exec();
        let userIsset = false;
        users.forEach((user) => {
            if (user && user._id != userIdentity.id) {
                userIsset = true;
            }
        });

        if (userIsset) {
            return res.status(200).json({
                status: 'success',
                message: 'El usuario ya existe'
            });
        }

        if (userToUpdate.password) {
            try {
                const hash = await bcrypt.hash(userToUpdate.password, 10);
                userToUpdate.password = hash;
            } catch (error) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al encriptar'
                });
            }
        }else{
            delete userToUpdate.password;
        }
        query = User.findByIdAndUpdate({_id : userIdentity.id}, userToUpdate, { new: true });
        const userUpdated = await query.exec();

        if (!userUpdated) {
            return res.status(404).json({
                status: 'error',
                message: 'El usuario no existe'
            });
        }
        delete userUpdated.password;
        delete userUpdated.role;
        delete userUpdated.image;
        delete userUpdated.__v;
        return res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado correctamente',
            user: userUpdated
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'error',
            message: 'Error al comprobar duplicidad de usuario o al actualizar'
        });

    }


    //Si me llega la password cifrar

    //Buscar y actualizar
    return res.status(200).json({
        status: 'success',
        message: 'Metodo de actualizar usuario',
        userToUpdate
    })
}

const uploadImage = async (req, res) => {

    //recoger el fichero de la peticion
    if (!req.file) {
        return res.status(404).json({
            status: 'error',
            message: 'Peticion no incluye la imagen'
        })
    }


    //conseguir el nombre y la extension del archivo
    let image = req.file.originalname;


    //comprobar la extension, solo imagenes, si no es valida borrar el archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath)
        return res.status(400).json({
            status: "error",
            message: "Extension del fichero invalida"
        })
    }

    //si todo es valido, sacar el id del usuario identificado
    try {
        const userUpdated = await User.findByIdAndUpdate({_id : req.user.id}, { image: req.file.filename }, { new: true })
        if (!userUpdated) {
            return res.status(500).json({
                status: "error",
                message: "No se pudo subir el archivo"
            })
        }
        return res.status(200).json({
            status: 'success',
            user: userUpdated,
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se pudo subir el archivo"
        })
    }
}

const avatar = async (req, res) => {
    //sacar el parametro de la url
    const fileName = req.params.file;


    //Montar el path real de la imagen
    const filePath = './uploads/avatars/' + fileName;

    //Comprobar que existe el fichero
    fs.stat(filePath, (err, stats) => {
        if (err || !stats) {
            return res.status(404).json({
                status: 'error',
                message: 'La imagen no existe'
            })
        }
        //Si existe, devolver la imagen
        return res.status(200).sendFile(path.resolve(filePath));

    })
    


}

const counters = async (req, res) => {
    const userId = req.params.id || req.user.id;
    try {
        
        const following = await Follow.countDocuments({ user: userId }).exec();
        
        const followed = await Follow.countDocuments({ followed: userId }).exec();
        
        const publications = await Publication.countDocuments({ user: userId }).exec();
        
        return res.status(200).json({
            status: 'success',
            userId,
            following,
            followed,
            publications
        })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al devolver los datos',
        })
    }
}

module.exports = {
    pruebaUser,
    registerUser,
    loginUser,
    profileUser,
    list,
    update,
    uploadImage,
    avatar,
    counters
}