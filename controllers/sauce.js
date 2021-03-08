const Sauce = require("../models/sauce"); /* Permet d'utiliser notre modele mongoose des sauces */
const fs = require("fs"); /* gestion (suppressions) des fichiers en backend */

/*** créer une nouvelle sauce ***/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(
    req.body.sauce
  ); /* Analyse des donnes en json */
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject /* Copie tout les éléments de req.body */,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      /* Recuperer les images telecharger */
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLikes: [],
    usersDislikes: [],
  });
  sauce
    .save() /* Enregistre la sauce */
    .then(() =>
      res.status(201).json({ message: "Nouvelle sauce enregistré !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

/* Récupere une sauce en fonction de son id */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/* Modifie une sauce en fonction de son id */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file /* Verifier l'existece d'un fichier ou non */
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
    .then((sauce) => {
      if (req.body.like == 1) {
        /* Si jamais l'utilisateur aime la sauce */
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += req.body.like;
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
            _id: req.params.id,
          }
        )
          .then(() =>
            res.status(210).json({ message: "Vous avez aimé cette sauce!" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (req.body.like == -1) {
        /* Si jamais l'utilisateur n'aime pas la sauce */
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes += req.body.dislike;
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
            _id: req.params.id,
          }
        )
          .then(() =>
            res.status(210).json({ message: "Vous n'aimez pas cette sauce!" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
      /* Pour supprimer un like ou dislike */
      if (sauce.usersLiked.includes(req.body.userId)) {
        /* si l'utilisateur est déjà dans le tableau userLiked */

        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
            _id: req.params.id,
          }
        )
          .then(() => res.status(201).json({ message: "Like supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
            _id: req.params.id,
          }
        )
          .then(() => res.status(201).json({ message: "Dislike supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) =>
      res.status(400).json({ error: "Une erreur est survenue !" })
    );
};

// Récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
