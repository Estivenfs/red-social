const express = require('express');
const router = express.Router();
const multer = require('multer');
const PublicationController = require('../controllers/publication');
const md_auth = require('../middlewares/auth');

//Configurar el modulo de subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/publications/');
    },
    filename: (req, file, cb) => {
        cb(null, 'pub-'+Date.now()+'-'+file.originalname);
    }
});

const uploads = multer({ storage: storage });

//Definir rutas
router.get('/prueba-publication', PublicationController.pruebaPublication);
router.post('/save', md_auth.auth, PublicationController.savePublication);
router.get('/detail/:id', md_auth.auth, PublicationController.detailPublication);
router.delete('/remove/:id', md_auth.auth, PublicationController.deletePublication);
router.get('/user/:id/:page?',md_auth.auth, PublicationController.getPublications);
router.post('/upload/:id', [md_auth.auth, uploads.single('file0')], PublicationController.uploadImage);
router.get('/media/:file', PublicationController.media);
router.get('/feed/:page?', md_auth.auth, PublicationController.feed);

module.exports = router;