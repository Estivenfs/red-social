const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user');
const md_auth = require('../middlewares/auth');

//Configurar el modulo de subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/avatars');
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar-'+Date.now()+'-'+file.originalname);
    }
});

const uploads = multer({ storage: storage });


//Definir rutas
router.get('/prueba-usuario',md_auth.auth, UserController.pruebaUser);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/profile/:id',md_auth.auth, UserController.profileUser);
router.get('/list/:page?/:itemsPerPage?',md_auth.auth, UserController.list);
router.put('/update',md_auth.auth, UserController.update);
router.post('/upload-image',[md_auth.auth, uploads.single("file0")], UserController.uploadImage);
router.get('/avatar/:file', UserController.avatar);
router.get('/counters/:id',md_auth.auth, UserController.counters);

module.exports = router;