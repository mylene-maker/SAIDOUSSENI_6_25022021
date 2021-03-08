const express = require('express'); /* utilisation du Framework express pour l'application */
const bodyParser = require('body-parser'); /* Permet d'extraire les objets json des demande POST */
const mongoose = require('mongoose'); /* Permet l'interaction avec la base de donnée */
const path = require('path'); /* Permet gerer et utiliser les chemins de fichiers */
const helmet = require('helmet'); 
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user'); 

/***  Connexion de l'api au cluster ***/
mongoose.connect('mongodb+srv://mylene:louisette@cluster0.c7qjx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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

app.use(bodyParser.json());
app.use(helmet());
app.use('/images', express.static(path.join(__dirname, 'images'))); /* Gestionnaire de routage */
app.use('/api/sauces', sauceRoutes); /* Route pour les demandes contenues dans la sauceRoute */
app.use('/api/auth', userRoutes); /* Route pour les demandes contenues dans la userRoute */


module.exports = app;