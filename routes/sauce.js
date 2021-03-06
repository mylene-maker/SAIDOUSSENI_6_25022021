const express = require("express"); /* Framework express */
const router = express.Router(); /* Router express */
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


/// créer une nouvelle sauce

router.post("/", auth, multer, sauceCtrl.createSauce);

/// recupère toutes les sauces

router.get("/", auth, sauceCtrl.getAllSauces);

/// recupère une sauce
router.get("/:id", auth, sauceCtrl.getOneSauce);

/// Modifier une sauce existante
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

//// Supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);

/// Post des likes ou dislikes
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
