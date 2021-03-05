const express = require('express');
const router = express.Router();
//const checkDataSignup = require('../middleware/ckeckDataSignup');

const userCtrl = require('../controllers/user');

router.post('/signup', /*checkDataSignup,*/ userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;