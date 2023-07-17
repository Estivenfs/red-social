const Publication = require('../models/publications');
const mongoosePagination = require('mongoose-pagination');
const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');


//Importar servicio
const followService = require('../services/followService');

//acciones de prueba
const pruebaPublication = (req, res) => {
    res.status(200).json({ message: 'Mensaje enviado desde: controller/publication.js' });
}

//Guardar publicacion
const savePublication = async(req, res) =>{
    //Recoger los datos del body
    const params = req.body;
    //Validar los datos
    if(!params.text) return res.status(400).json({ status: 'error', message: 'Debes enviar el texto de la publicacion' });
    //Crear objeto de publicacion
    let newPublication = new Publication(params);
    //Asignar usuario a la publicacion
    newPublication.user = req.user.id;
    //Guardar publicacion
    try {
        const savedPublication = await newPublication.save();
        if(!savedPublication) return res.status(400).json({ status: 'error', message: 'La publicacion no se ha guardado' });
        return res.status(200).json({ status: 'success', message: 'Publicacion guardada correctamente', publication: savedPublication });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error al guardar la publicacion', error });
        
    }

}

//Obtener una publicacion
const detailPublication = async(req, res) => {
    //Recoger el id de la publicacion
    const publicationId = req.params.id;
    //Buscar la publicacion
    try {
        const publication = await Publication.findById(publicationId);
        if(!publication) return res.status(400).json({ status: 'error', message: 'No existe la publicacion' });
        return res.status(200).json({ 
            status: 'success', 
            message: 'Publicacion encontrada',
            publication
        });
        
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error al buscar la publicacion', error });
        
    }

}


//Eliminar publicaciones
const deletePublication = async(req, res) => {
    //Recoger el id de la publicacion
    const publicationId = req.params.id;
    //Buscar la publicacion
    try {
        const publication = await Publication.findOne({'user': req.user.id, '_id': publicationId});
        if(!publication) return res.status(400).json({ status: 'error', message: 'No existe la publicacion o no tienes permiso para eliminarla' });
        //Comprobar si el usuario es el dueño de la publicacion
        if(publication.user != req.user.id) return res.status(400).json({ status: 'error', message: 'No tienes permiso para eliminar esta publicacion' });
        //Eliminar la publicacion
        const deletedPublication = await Publication.findByIdAndDelete(publication._id);
        if(!deletedPublication) return res.status(400).json({ status: 'error', message: 'No se ha podido eliminar la publicacion' });
        return res.status(200).json({
            status: 'success',
            message: 'Publicacion eliminada correctamente',
            publication: deletedPublication._id
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error eliminando la publicacion', error });
    }
}


//Listar Todas las publicaciones de un usuario
const getPublications = async (req, res) => {
    //Recoger el id del usuario
    const userId = req.params.id;
    let page = req.params.page || 1;
    const itemsPerPage = 5;
    console.log(userId)
    //Comprobar que el usuario existe
    try {
        const publications = await Publication.find({'user': userId})
        .sort('-created_at')
        .populate({ path: 'user', select: '-password -__v -role -email -created_at' })
        .paginate(page, itemsPerPage)
        .exec();
        const total = await Publication.countDocuments({'user': userId});
        if(!publications || publications?.length<=0) return res.status(404).json({ status: 'error', message: 'No hay publicaciones para mostrar' });
        return res.status(200).json({
            status: 'success',
            message: 'Publicaciones del perfil de un usuario',
            total,
            pages: Math.ceil(total/itemsPerPage),
            publications
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error al buscar las publicaciones', error });
    }
}
    




//Subir ficheros
const uploadImage = async (req, res) => {

    //recoger el fichero de la peticion
    if (!req.file) {
        return res.status(404).json({
            status: 'error',
            message: 'Peticion no incluye la imagen'
        })
    }
    const publicationId = req.params.id;


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
        const publicationUpdated = await Publication.findByIdAndUpdate({user: req.user.id, "_id": publicationId}, { file: req.file.filename }, { new: true })
        if (!publicationUpdated) {
            return res.status(500).json({
                status: "error",
                message: "No se pudo subir el archivo"
            })
        }
        return res.status(200).json({
            status: 'success',
            publication: publicationUpdated,
            file: req.file
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "No se pudo subir el archivo"
        })
    }
}

//Devolver archivos multimedia (imagenes)
const media = async (req, res) => {
    //sacar el parametro de la url
    const fileName = req.params.file;


    //Montar el path real de la imagen
    const filePath = './uploads/publications/' + fileName;

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

//Listar todas las publicaciones (FEED)
const feed = async (req, res) => {
    //Recoger el id del usuario
    const userId = req.params.id;
    let page = req.params.page || 1;
    const itemsPerPage = 5;
    //Obtener un array de identificadores de usuario que yo sigo como usuario logueado
    
    //Comprobar que el usuario existe
    try {
        const myFollows = (await followService.followUserIds(req.user.id)).follows;
        const publications = await Publication.find({
            'user': { $in: myFollows }
        })
        .sort('-created_at')
        .populate({ path: 'user', select: '-password -__v -role -email' })
        .paginate(page, itemsPerPage)
        .exec();
        const total = await Publication.countDocuments({
            'user': { $in: myFollows }
        });
        if(!publications || publications?.length<=0) return res.status(404).json({ status: 'error', message: 'No hay publicaciones para mostrar' });
        return res.status(200).json({
            status: 'success',
            message: 'Publicaciones del perfil de un usuario',
            total,
            pages: Math.ceil(total/itemsPerPage),
            publications
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Error al buscar las publicaciones', error });
    }
}

module.exports = {
    pruebaPublication,
    savePublication,
    detailPublication,
    deletePublication,
    getPublications,
    uploadImage,
    media,
    feed
}