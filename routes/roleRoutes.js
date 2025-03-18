const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { validateCreateRole, validateUpdateRole } = require('../middleware/validateRoles');

router.post('/', validateCreateRole, roleController.createRole);
router.get('/', roleController.getRoles);
router.get('/:id' ,roleController.getRoleById);
router.put('/update/:id', validateUpdateRole,roleController.updateRole);
router.delete('/delete/:id', roleController.deleteRole);
module.exports = router;