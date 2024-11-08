const express = require('express');
const { signup, login, signupRepresentative} = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/signup-representative', signupRepresentative);

module.exports = router;
