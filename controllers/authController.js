const User = require('../models/user');
const { generateToken } = require('../services/authService');
const { check, validationResult } = require('express-validator');
const { sendMail }= require('../services/emailService');


exports.register  = async (req, res) => {
    try {
        const { name, email, password, role, address } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) return res.status(400).json({ message: `Email ${email} already in use`});

        const newUser = await User.create({ name, email, password, role, address });
        console.log(newUser.email);
        await sendMail(newUser.email, 'Welcome to Our App!', 'welcomeEmail', { name: newUser.name });
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser.userID, 
                name: newUser.name,
                email: newUser.email,
                role: newUser.role 
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        await Promise.all([
            check('email')
                .isEmail().withMessage('Invalid email format')
                .run(req),
            
            check('password')
                .notEmpty().withMessage('Password is required')
                .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
                .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
                .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
                .matches(/\d/).withMessage('Password must contain at least one digit')
                .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@, $, !, %, *, ? or &)')
                .run(req)
        ]);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');;
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', authToken: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({userID : req.user.id}).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
