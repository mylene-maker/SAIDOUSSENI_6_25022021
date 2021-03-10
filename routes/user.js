const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');
const password = require('../middleware/password');

/* Routes pour la création de compte */
router.post('/signup', password, userCtrl.signup);
/* Routes pour la connexion de compte */
router.post('/login', userCtrl.login);

module.exports = router;