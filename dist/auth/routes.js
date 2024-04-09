"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../error/middlewares");
const controllers_1 = require("./controllers");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
router.post("/signup", validators_1.signUpValidation, middlewares_1.validationMiddleware, controllers_1.signUpController);
router.post("/signin", validators_1.signInValidation, middlewares_1.validationMiddleware, controllers_1.signInController);
exports.default = router;
//# sourceMappingURL=routes.js.map