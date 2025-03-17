const { body, validationResult } = require('express-validator');

/**  Validation for Creating a Movie */
const validateCreateMovie = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 2 }).withMessage('Title must be at least 2 characters long'),

    body('plot').optional().isString().withMessage('Plot must be a string'),

    body('poster').optional().isURL().withMessage('Poster must be a valid URL'),

    body('rated').optional().isString().withMessage('Rated must be a string'),

    body('released').optional().isISO8601().toDate().withMessage('Released must be a valid date'),

    body('runtime')
        .notEmpty().withMessage('Runtime is required')
        .isInt({ min: 1 }).withMessage('Runtime must be a positive number'),

    body('genres')
        .notEmpty().withMessage('Genres are required')
        .isArray().withMessage('Genres must be an array')
        .custom((value) => {
            if (value.length < 1) throw new Error('At least one genre is required');
            return true;
        }),

    body('cast').optional().isArray().withMessage('Cast must be an array of strings'),

    body('directors').optional().isArray().withMessage('Directors must be an array of strings'),

    body('imdb.rating').optional().isFloat({ min: 0, max: 10 }).withMessage('IMDb rating must be between 0 and 10'),

    body('year')
        .notEmpty().withMessage('Year is required')
        .isInt({ min: 1800, max: new Date().getFullYear() })
        .withMessage(`Year must be between 1800 and ${new Date().getFullYear()}`),

    // Middleware to handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

/** Validation for Updating a Movie */
const validateUpdateMovie = [
    body('title')
        .optional()
        .isString().withMessage('Title must be a string')
        .isLength({ min: 2 }).withMessage('Title must be at least 2 characters long'),

    body('plot').optional().isString().withMessage('Plot must be a string'),

    body('poster').optional().isURL().withMessage('Poster must be a valid URL'),

    body('rated').optional().isString().withMessage('Rated must be a string'),

    body('released').optional().isISO8601().toDate().withMessage('Released must be a valid date'),

    body('runtime')
        .optional()
        .isInt({ min: 1 }).withMessage('Runtime must be a positive number'),

    body('genres')
        .optional()
        .isArray().withMessage('Genres must be an array')
        .custom((value) => {
            if (value.length > 0 && value.some((g) => typeof g !== 'string')) {
                throw new Error('Genres must be an array of strings');
            }
            return true;
        }),

    body('cast').optional().isArray().withMessage('Cast must be an array of strings'),

    body('directors').optional().isArray().withMessage('Directors must be an array of strings'),

    body('imdb.rating').optional().isFloat({ min: 0, max: 10 }).withMessage('IMDb rating must be between 0 and 10'),

    body('year')
        .optional()
        .isInt({ min: 1800, max: new Date().getFullYear() })
        .withMessage(`Year must be between 1800 and ${new Date().getFullYear()}`),

    // Middleware to handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateCreateMovie, validateUpdateMovie };
