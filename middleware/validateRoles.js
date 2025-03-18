const { body } = require("express-validator");

// Allowed permission types
const validActions = ["read", "create", "update", "delete", "update_own", "delete_own"];

const validateCreateRole = [
    body("name")
        .notEmpty().withMessage("Role name is required")
        .isString().withMessage("Role name must be a string"),

    body("permissions").isObject().withMessage("Permissions must be an object"),

    body("permissions").custom((value) => {
        if (typeof value !== "object" || Array.isArray(value)) {
            throw new Error("Permissions must be an object with modules as keys");
        }

        // Loop through each module in permissions (movies, users, comments, etc.)
        for (const key in value) {
            if (!Array.isArray(value[key])) {
                throw new Error(`Permissions for '${key}' must be an array`);
            }

            // Check if all actions are valid
            value[key].forEach(action => {
                if (!validActions.includes(action)) {
                    throw new Error(`Invalid permission action '${action}' for module '${key}'. Allowed actions: ${validActions.join(", ")}`);
                }
            });
        }
        return true;
    }),
];

const validateUpdateRole = [
    body("name")
        .isString().withMessage("Role name must be a string"),

    body("permissions").isObject().withMessage("Permissions must be an object"),

    body("permissions").custom((value) => {
        if (typeof value !== "object" || Array.isArray(value)) {
            throw new Error("Permissions must be an object with modules as keys");
        }

        // Loop through each module in permissions (movies, users, comments, etc.)
        for (const key in value) {
            if (!Array.isArray(value[key])) {
                throw new Error(`Permissions for '${key}' must be an array`);
            }

            // Check if all actions are valid
            value[key].forEach(action => {
                if (!validActions.includes(action)) {
                    throw new Error(`Invalid permission action '${action}' for module '${key}'. Allowed actions: ${validActions.join(", ")}`);
                }
            });
        }
        return true;
    }),
];


module.exports = { validateCreateRole, validateUpdateRole };