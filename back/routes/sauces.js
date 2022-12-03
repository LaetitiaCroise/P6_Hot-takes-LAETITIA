const express = require('express');
const router = express.Router();
// On importe le middleware auth.
const auth = require('../middleware/auth');
// On importe le middleware où se trouve le package multer.
const multer = require('../middleware/multer-config');
// On importe la logique métier de nos sauces.
const sauceCtrl = require('../controllers/sauce');

// Route POST pour enregistrer une sauce.
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
// Route poste pour enregistrer l'ajout ou le retrait d'un like sur une sauce.
router.post('/:id/like',auth, sauceCtrl.likeDislike);

module.exports = router;

