const express = require("express");
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');

/// créer une nouvelle sauce

router.post("/",  sauceCtrl.createSauce);

/// recupère toutes les sauces

router.get("/", sauceCtrl.getAllSauces);

/// recupère une sauce
router.get("/:id", sauceCtrl.getOneSauce);

/// Modifier une sauce existante
router.put("/:id", sauceCtrl.modifySauce);

//// Supprimer une sauce
router.delete("/:id", sauceCtrl.deleteSauce);

/// Post des likes ou dislikes
router.post("/:id/like ", sauceCtrl.addLikes);

module.exports = router;
