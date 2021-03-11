const bcrypt = require("bcrypt"); /* Paquage de chiffrement pour le mdp */
const jwt = require("jsonwebtoken"); /* Permet de creer et verifier les tokens */
const User = require("../models/user"); /* importation du modele de shema utilisateurs */

const maskData = require("maskdata");

const maskEmail = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 2,
  maskAtTheRate: false,
};

// création d'un nouveau compte
exports.signup = (req, res, next) => {
  // Hash le mot de passe de l'utilisateur
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: maskData.maskEmail2(req.body.email, maskEmail),
        password: hash,
      });
      user
        .save() // Enregistre le compte du client
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Connexion des comptes déjà existant
exports.login = (req, res, next) => {
  User.findOne({
    email: maskData.maskEmail2(req.body.email, maskData),
  }) /* Verifie si l'email existe dans la base de donnée */
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Compare le mdp saisie avec le hash enregistrer avant de valider la connexion
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // le serveur renvoi un id et un token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              /* Encode un nouveau token */
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "2h" } /* Durée de validité du token */
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
