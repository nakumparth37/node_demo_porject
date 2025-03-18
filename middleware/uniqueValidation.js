const mongoose = require("mongoose");

/**
 * Middleware to enforce unique field validation manually
 * @param {String} modelName - Name of the Mongoose model
 * @param {String} field - Field to enforce uniqueness
 */
const uniqueValidator = function (modelName, field) {
    return async function (next) {
        if (!this.isNew && !this.isModified(field)) {
            return next(); // Skip validation if not a new document or field not modified
        }

        const Model = mongoose.model(modelName);
        const exists = await Model.findOne({ [field]: this[field] });

        if (exists) {
            return next(new Error(`${modelName} with ${field} '${this[field]}' already exists.`));
        }
        next();
    };
};

module.exports = uniqueValidator;
