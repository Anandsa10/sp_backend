"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserValidator = exports.editUserValidator = void 0;
const express_validator_1 = require("express-validator");
const editUserValidator = [
    (0, express_validator_1.body)("name").optional().isString().withMessage("Invalid name format"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Invalid email format"),
];
exports.editUserValidator = editUserValidator;
const searchUserValidator = [
    (0, express_validator_1.query)("query")
        .notEmpty()
        .withMessage("Query must be present")
        .isString()
        .withMessage("Invalid query format"),
];
exports.searchUserValidator = searchUserValidator;
//# sourceMappingURL=validators.js.map