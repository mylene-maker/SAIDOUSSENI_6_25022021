const express = require('express'); /* utilisation du Framework express pour l'application */
const bodyParser = require('body-parser'); /* Permet d'extraire les objets json des demande POST */
const mongoose = require('mongoose'); /* Permet l'interaction avec la base de donnée */
const path = require('path'); /* Permet gerer et utiliser les chemins de fichiers */
// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
// il sécurise nos requêtes HTTP, sécurise les en-têtes, contrôle la prélecture DNS du navigateur, empêche le détournement de clics
// et ajoute une protection XSS mineure et protège contre le reniflement de TYPE MIME
// cross-site scripting, sniffing et clickjacking
const helmet = require('helmet'); 

// dotenv pour masquer les information de connexion à la base de donnée
require ('dotenv').config();
const rateLimit = require("express-rate-limit"); 

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user'); 

/***  Connexion de l'api au cluster ***/
mongoose.connect(process.env.DB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
const app = express();

/*** Gestion des erreurs CORS ***/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); /* Permet d'acceder à l'api depuis n'importe quelle origine */
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); /* Autorise toute les methodes d'envoi cité */
    next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // chaque api est limité à 100 requête par fenêtre
});

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);
app.use('/images', express.static(path.join(__dirname, 'images'))); /* Gestionnaire de routage */
app.use('/api/sauces', sauceRoutes); /* Route pour les demandes contenues dans la sauceRoute */
app.use('/api/auth', userRoutes); /* Route pour les demandes contenues dans la userRoute */


module.exports = app;