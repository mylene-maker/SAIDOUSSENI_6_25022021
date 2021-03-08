const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); /* paquage de pré-validation des informations */


/* Modele de donnée utilisateurs */

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); /* verifie que un mail ne puisse pas être utiliser plusieurs fois pour la création d'un compte */

module.exports = mongoose.model('User', userSchema);