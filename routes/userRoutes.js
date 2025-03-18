const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { validateCreateUser , validateUpdateUser } = require('../middleware/validateUser');

// Routes
router.get('/:id', userController.getUserById);
router.put('/update/:id', auth.checkPermission('users', 'update'),validateCreateUser, userController.updateUser);

router.use(auth.adminOnly);
router.get('/all', userController.getAllUsers);
router.delete('/delete/:id', userController.deleteUser);
router.get('/', userController.getUsers);

module.exports = router;
