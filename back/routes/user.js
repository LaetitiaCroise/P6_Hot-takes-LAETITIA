// On importe le package express de node
const express = require ('express');

const router = express.Router();
// On importe les fonctions de notre controllers.
const userCtrl = require('../controllers/user');

// Route POST pour créer un compte.
router.post('/signup',userCtrl.signup); 
// Route POST pour se connecter.
router.post('/login',userCtrl.login);

module.exports = router;