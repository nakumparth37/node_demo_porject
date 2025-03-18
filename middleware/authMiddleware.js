const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/Role');
const mongoose = require("mongoose");

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.id }).select('-password');
        if (!user) return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

// Middleware to restrict access to only Admin users
exports.adminOnly = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized: No user found' });
        const role = await Role.findOne({ roleID: req.user.roleID });
        
        if (!role || role.name !== 'Admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Middleware to check if the user has permission to perform the action
exports.checkPermission = (collection, action) => {
    return async (req, res, next) => {
        try {
            const role = await mongoose.model("Role").findOne({ roleID: req.user.roleID });

            if (!role) return res.status(403).json({ message: "Access denied. Role not found." });
            const permissions = role.permissions[collection] || [];

            // Full permission (Admin)
            if (role.name === "Admin" || permissions.includes(action)) {
                return next();
            }

            // Check "_own" permission (only allow if the user owns the resource)
            if (permissions.includes(`${action}_own`)) {
                const ModelName = collection.charAt(0).toUpperCase() + collection.slice(1, -1);
                const Model = mongoose.models[ModelName] || mongoose.model(ModelName);

                if (!Model) return res.status(400).json({ message: "Invalid collection" });
                // Find the resource dynamically
                console.log(req.params.id);
                
                const resource = await Model.findOne({ [`${collection.slice(0, -1)}ID`]: req.params.id });
                console.log(resource);
                if (!resource) {
                    return res.status(404).json({ message: "Resource not found" });
                }
                if (ModelName !== "User" && resource.createdBy.toString() === req.user.userID.toString()) {
                    return next();
                } else if (ModelName === "User" && resource.email === req.user.email) {
                    return next();
                }
            }

            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};