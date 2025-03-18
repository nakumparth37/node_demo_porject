const mongoose = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);
const uniqueValidator = require("../middleware/uniqueValidation");

const RoleSchema = new mongoose.Schema({
    roleID:  {type: Number, unique: true},
    name: { type: String, required: true, unique: true },
    permissions: {
        movies: { type: [String], default: [] },   // Example: ["read", "create", "update", "delete"]
        users: { type: [String], default: [] },
        roles: { type: [String], default: [] },
        comments: { type: [String], default: [] }
    }
}, { timestamps: true });

RoleSchema.plugin(AutoIncrement, { inc_field: 'roleID' });
// Apply unique validation for `name`
RoleSchema.pre("save", uniqueValidator("Role", "name"));
const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;

