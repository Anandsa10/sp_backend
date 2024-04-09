"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = exports.errorMiddleware = void 0;
const types_1 = require("./types");
const express_validator_1 = require("express-validator");
function errorMiddleware(err, req, res, next) {
    if (err instanceof types_1.BadRequestError) {
        res.status(400).send({
            error: err.message,
        });
    }
    else if (err instanceof types_1.UnauthorizedError) {
        res.status(401).send({
            error: err.message,
        });
    }
    else {
        console.log(err);
        res.status(500).send({
            error: "Something went wrong",
        });
    }
}
exports.errorMiddleware = errorMiddleware;
const validationMiddleware = (req, res, next) => {
    const validationErrors = (0, express_validator_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        throw new types_1.BadRequestError(validationErrors.array()[0].msg);
    }
    next();
};
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=middlewares.js.map