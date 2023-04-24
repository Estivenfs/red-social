const express = require('express');
const router = express.Router();
const md_auth = require('../middlewares/auth');
const FollowController = require('../controllers/follow');

//Definir rutas

router.get('/prueba-follow', FollowController.pruebaFollow);
router.post('/save', md_auth.auth, FollowController.saveFollow);
router.delete('/unfollow/:id', md_auth.auth, FollowController.unfollow);
router.get('/following/:id?/:page?', md_auth.auth, FollowController.getFollowingUsers);
router.get('/followers/:id?/:page?', md_auth.auth, FollowController.getFollowedUsers);

module.exports = router;