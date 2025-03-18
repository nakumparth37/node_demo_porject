const Role = require('../models/Role');
const paginate = require('../services/paginationService');
const _ = require('lodash');

exports.createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const role = new Role({ name, permissions });
        await role.save();
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({ roleID: req.params.id });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updateRoleData = req.body;
        const existingRole = await Role.findOne({ roleID: id });
        if (!existingRole) {
            return res.status(404).json({ message: "Role not found" });
        }
        // Update role
        const updatedRole = await Role.findOneAndUpdate(
            { roleID: id },
            { $set: updateRoleData },
            { 
                new: true, 
                runValidators: true
            }
        );
        res.json({ message: "Role updated successfully", role: updatedRole });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findOneAndDelete({ roleID: req.params.id });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted successfully', role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
