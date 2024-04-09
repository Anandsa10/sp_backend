"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../error/middlewares");
const controllers_1 = require("./controllers");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
router.put("/", validators_1.editUserValidator, middlewares_1.validationMiddleware, controllers_1.editUserController);
router.get("/search", validators_1.searchUserValidator, middlewares_1.validationMiddleware, controllers_1.searchUserController);
router.get("/:id", controllers_1.userDataController);
exports.default = router;
//# sourceMappingURL=routes.js.map