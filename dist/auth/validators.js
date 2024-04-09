"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInValidation = exports.signUpValidation = void 0;
const express_validator_1 = require("express-validator");
const signUpValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Missing name")
        .isString()
        .withMessage("Invalid name format"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Missing password")
        .isString()
        .withMessage("Invalid password format"),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Missing email")
        .isEmail()
        .withMessage("Invalid email format"),
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("Missing userId")
        .isString()
        .withMessage("Invalid userId format")
        .matches(/^[a-zA-Z0-9_]*$/)
        .withMessage("Invalid username format"),
];
exports.signUpValidation = signUpValidation;
const signInValidation = [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("Missing userId")
        .isString()
        .withMessage("Invalid userId format"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Missing password")
        .isString()
        .withMessage("Invalid password format"),
];
exports.signInValidation = signInValidation;
//# sourceMappingURL=validators.js.map