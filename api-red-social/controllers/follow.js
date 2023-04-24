//Importar modelo
const Follow = require('../models/follow');
const User = require('../models/user');
//Importar servicio
const followService = require('../services/followService');
//Acciones de prueba
const pruebaFollow = (req, res) => {
    res.status(200).json({ message: 'Mensaje enviado desde: controller/follow.js' });
}

//Accion de guardar un follow
const saveFollow = async (req, res) => {
    const params = req.body;
    const identity = req.user;
    const follow = new Follow({
        user: identity.id,
        followed: params.followed
    });
    try {
        const followStored = await follow.save();
        if (!followStored) return res.status(404).json({
            status: 'error',
            message: 'El seguimiento no se ha guardado'
        });
        return res.status(200).json({
            status: 'success',
            follow: followStored
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al guardar el seguimiento'
        });
    }

}

//Accion de dejar de seguir
const unfollow = async (req, res) => {
    const userId = req.user.id;
    const followedId = req.params.id;
  
    const follow = await Follow.findOne({ user: userId, followed: followedId });
  
    if (!follow) {
      return res.status(404).json({
        status: 'error',
        message: 'El seguimiento no existe'
      });
    }
  
    try {
      await follow.deleteOne();
  
      return res.status(200).json({
        status: 'success',
        message: 'El seguimiento se eliminó correctamente'
      });
    } catch (error) {
      console.log("error", error)
      return res.status(500).json({
        status: 'error',
        message: 'Error al eliminar el seguimiento'
      });
    }
  }
  


//Accion de listar los usuarios que sigo
const getFollowingUsers = async (req, res) => {
    const userId = req.params.id || req.user.id;
    const page = parseInt(req.params.page) || 1;
    const itemsPerPage = 5;
    try {
        const follows = await Follow.find({ user: userId })
            .populate({ path: 'user followed', select: '-password -__v -role -email -created_at' })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec();
        const total = await Follow.countDocuments({ user: userId });
        const followUserIds = await followService.followUserIds(req.user.id);
        if (!follows) {
            return res.status(404).json({
                status: 'error',
                message: 'No estás siguiendo a ningún usuario'
            });
        }
        return res.status(200).json({
            status: 'success',
            follows,
            total,
            pages: Math.ceil(total / itemsPerPage),
            users_following: followUserIds.follows,
            users_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al devolver el seguimiento'
        });
    }
}

//Accion de listar los usuarios que me siguen
const getFollowedUsers = async (req, res) => {
    const userId = req.params.id || req.user.id;
    const page = parseInt(req.params.page) || 1;
    const itemsPerPage = 5;
    try {
        const follows = await Follow.find({ followed: userId })
            .populate({ path: 'user', select: '-password -__v -role -email -created_at' })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .exec();
        const total = await Follow.countDocuments({ followed: userId });
        if(!follows) {
            return res.status(404).json({
                status: 'error',
                message: 'No te sigue ningún usuario'
            });
        }
        const followUserIds = await followService.followUserIds(req.user.id);
        return res.status(200).json({
            status: 'success',
            message: 'Listado de usuarios que me siguen',
            follows,
            total,
            pages: Math.ceil(total / itemsPerPage),
            users_following: followUserIds.follows,
            users_follow_me: followUserIds.followers
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error al devolver el seguimiento'
        });
    }
}

module.exports = {
    pruebaFollow,
    saveFollow,
    unfollow,
    getFollowingUsers,
    getFollowedUsers
}