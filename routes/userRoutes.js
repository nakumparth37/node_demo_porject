const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { validateCreateUser , validateUpdateUser } = require('../middleware/validateUser');

// Routes
router.get('/all', auth.adminOnly, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/update/:id', validateCreateUser, userController.updateUser);
router.delete('/delete/:id', validateUpdateUser, userController.deleteUser);

module.exports = router;
