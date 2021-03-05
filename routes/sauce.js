const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const likingAlgo = require('../middleware/likingSystem');
const checkUserLiking = require('../middleware/checkUserLiking');

const sauceCtrl = require('../controllers/sauce');

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
router.post("/:id/like ", auth, likingAlgo, checkUserLiking, sauceCtrl.likeSauce);

module.exports = router;
