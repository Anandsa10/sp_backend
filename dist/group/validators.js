"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redistributeValidator = exports.getGroupDataValidator = exports.joinGroupValidator = exports.editGroupValidator = exports.createGroupValidator = void 0;
const express_validator_1 = require("express-validator");
const createGroupValidator = [
    (0, express_validator_1.body)("name")
        .isString()
        .isLength({ min: 1, max: 150 })
        .withMessage("Name must be between 1 and 150 characters"),
];
exports.createGroupValidator = createGroupValidator;
const editGroupValidator = [
    (0, express_validator_1.body)("name")
        .isString()
        .isLength({ min: 1, max: 150 })
        .withMessage("Name must be between 1 and 150 characters"),
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("Id is required")
        .isMongoId()
        .withMessage("Invalid id"),
];
exports.editGroupValidator = editGroupValidator;
const joinGroupValidator = [
    (0, express_validator_1.body)("groupId")
        .notEmpty()
        .withMessage("Group id is required")
        .isMongoId()
        .withMessage("Invalid group id"),
];
exports.joinGroupValidator = joinGroupValidator;
const getGroupDataValidator = [
    (0, express_validator_1.param)("id")
        .notEmpty()
        .withMessage("Id is required")
        .isMongoId()
        .withMessage("Invalid id"),
];
exports.getGroupDataValidator = getGroupDataValidator;
const redistributeValidator = [
    (0, express_validator_1.param)("groupId")
        .notEmpty()
        .withMessage("Group id is required")
        .isMongoId()
        .withMessage("Invalid group id"),
];
exports.redistributeValidator = redistributeValidator;
//# sourceMappingURL=validators.js.map