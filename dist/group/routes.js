"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../error/middlewares");
const controllers_1 = require("./controllers");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
router.get("/:id", validators_1.getGroupDataValidator, middlewares_1.validationMiddleware, controllers_1.getGroupDataController);
router.get("/redis/:groupId", validators_1.redistributeValidator, middlewares_1.validationMiddleware, controllers_1.redistributeController);
router.post("/create", validators_1.createGroupValidator, middlewares_1.validationMiddleware, controllers_1.createGroupController);
router.put("/:id", validators_1.editGroupValidator, middlewares_1.validationMiddleware, controllers_1.editGroupController);
router.post("/join", validators_1.joinGroupValidator, middlewares_1.validationMiddleware, controllers_1.joinGroupController);
router.post("/leave", validators_1.joinGroupValidator, middlewares_1.validationMiddleware, controllers_1.leaveGroupController);
exports.default = router;
//# sourceMappingURL=routes.js.map