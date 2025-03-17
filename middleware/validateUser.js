const { body, validationResult } = require('express-validator');

const validateCreateUser = [
    body('name')
        .optional()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 4 }).withMessage('Name must be at least 4 characters long'),

    body('email')
        .optional()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .optional()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one digit')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@, $, !, %, *, ?, &)'),


    body('image')
        .optional()
        .isURL().withMessage('Image must be a valid URL'),


    body('address')
        .optional()
        .isString().withMessage('Address must be a string'),


    body('role')
        .optional()
        .notEmpty().withMessage('Role is required')
        .isIn(['admin', 'vendor', 'user']).withMessage('Role must be one of: admin, vendor, user'),

    // Middleware to Handle Validation Errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUpdateUser = [
    body('name')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 4 }).withMessage('Name must be at least 4 characters long'),

    body('email')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one digit')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@, $, !, %, *, ?, &)'),


    body('image')
        .optional()
        .isURL().withMessage('Image must be a valid URL'),


    body('address')
        .optional()
        .isString().withMessage('Address must be a string'),


    body('role')
        .isIn(['admin', 'vendor', 'user']).withMessage('Role must be one of: admin, vendor, user'),

    // Middleware to Handle Validation Errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {validateCreateUser, validateUpdateUser};
