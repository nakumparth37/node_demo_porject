const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.email, role: user.role },
        process.env.JWT_SECRET, 
        { expiresIn: '30d' }
    );
};

module.exports = { generateToken };
