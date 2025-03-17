const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const paginate = require('../services/paginationService')


exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const paginatedUsers = await paginate(User,page,limit,{},'-password');
        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            ...paginatedUsers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({userID : req.params.id}).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ User : user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (req.body.email) {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser && existingUser.userID !== userId) {
                return res.status(400).json({
                    status: false,
                    message: `Email ${req.body.email} already in use`
                });
            }
        }
        const existingUser = await User.findOne({userID : userId});
        if (!existingUser) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        if (req.body.password) {
            req.body.password = await existingUser.hashPassword(req.body.password);
        }
        const updatedUserOject = _.merge(existingUser.toObject(),req.body)
        const updatedUser = await User.findOneAndUpdate(
            { userID :userId},
            { $set : updatedUserOject },
            { 
                new: true, 
                runValidators: true,
                context:'query' 
            }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({userID : req.params.id});
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



