
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const {validateCreateUser} = require('../middleware/validateUser');

router.post('/register',validateCreateUser, authController.register);
router.post('/login', authController.login);

module.exports = router;