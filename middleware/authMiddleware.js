const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized !' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({email : decoded.id}).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.adminOnly = async (req, res, next) => {
    await exports.protect(req, res, async () => {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    });
};
