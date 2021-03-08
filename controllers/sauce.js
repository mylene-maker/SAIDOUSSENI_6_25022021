const Sauce = require("../models/sauce");
const fs = require("fs");

/// créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLikes: [],
    usersDislikes: [],
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "Nouvelle sauce enregistré !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Récupere une sauce en fonction de son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Modifie une sauce en fonction de son id
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprime une sauce en fonction de son id
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

/// Aimer une sauce
exports.likeSauce = (req, res, next) => {
  
  let message = "";
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
      if(req.body.like==1) {
          sauce.usersLiked.push(req.body.userId);
          sauce.likes+= req.body.like;
          message = "Vous aimez cette sauce ";
      } else if (req.body.like==-1) {
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes+=1;
          message = "Vous détestez cette sauce ";
      } else if (req.body.like == 0 && sauce.usersLiked.includes(req.body.userId)){
        sauce.userLiked.remove(req.body.userId)
        sauce.likes -= 1
      }
      else if (req.body.like == 0 && sauce.usersDisliked.includes(req.body.userId)){
        sauce.usersDisliked.remove(req.body.userId)
        sauce.disliked -= 1
      }
      /*req.body.sauce = sauce;
      req.body.message = message
      next();*/
  })
  .catch(error => res.status(400).json({ error: "Une erreur est survenue !" }));
};

// Récupère toute les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};


