"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillValidator = exports.changeStatusValidator = exports.editBillValidator = exports.deleteBillValidator = exports.createBillValidator = void 0;
const express_validator_1 = require("express-validator");
const getBillValidator = [
    (0, express_validator_1.param)("billId")
        .notEmpty()
        .withMessage("Bill id is required")
        .isMongoId()
        .withMessage("Invalid bill id"),
];
exports.getBillValidator = getBillValidator;
const createBillValidator = [
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string"),
    (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("Amount is required")
        .isNumeric()
        .withMessage("Amount must be a number"),
    (0, express_validator_1.body)("groupId").optional().isMongoId().withMessage("Invalid group id"),
    (0, express_validator_1.body)("owes").notEmpty().withMessage("Owes is required"),
    (0, express_validator_1.body)("owes.*").isNumeric().withMessage("Owes must be a number"),
];
exports.createBillValidator = createBillValidator;
const deleteBillValidator = [
    (0, express_validator_1.body)("billId")
        .notEmpty()
        .withMessage("Bill id is required")
        .isMongoId()
        .withMessage("Invalid bill id"),
];
exports.deleteBillValidator = deleteBillValidator;
const editBillValidator = [
    (0, express_validator_1.param)("billId")
        .notEmpty()
        .withMessage("Bill id is required")
        .isMongoId()
        .withMessage("Invalid bill id"),
    (0, express_validator_1.body)("title").optional().isString().withMessage("Title must be a string"),
    (0, express_validator_1.body)("amount").optional().isNumeric().withMessage("Amount must be a number"),
    (0, express_validator_1.body)("owes.*").optional().isNumeric().withMessage("Owes must be a number"),
];
exports.editBillValidator = editBillValidator;
const changeStatusValidator = [
    (0, express_validator_1.body)("oweId")
        .notEmpty()
        .withMessage("Owe id is required")
        .isMongoId()
        .withMessage("Invalid debt"),
    (0, express_validator_1.body)("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["PENDING", "PAID"])
        .withMessage("Invalid status"),
];
exports.changeStatusValidator = changeStatusValidator;
//# sourceMappingURL=validators.js.map