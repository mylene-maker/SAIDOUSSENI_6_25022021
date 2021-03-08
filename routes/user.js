const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

/* Routes pour la création de compte */
router.post('/signup', userCtrl.signup);
/* Routes pour la connexion de compte */
router.post('/login', userCtrl.login);

module.exports = router;