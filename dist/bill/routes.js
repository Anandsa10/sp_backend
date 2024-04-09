"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../error/middlewares");
const controllers_1 = require("./controllers");
const validators_1 = require("./validators");
const router = (0, express_1.Router)();
router.get("/:billId", validators_1.getBillValidator, middlewares_1.validationMiddleware, controllers_1.getBillController);
router.post("/create", validators_1.createBillValidator, middlewares_1.validationMiddleware, controllers_1.createBillController);
router.put("/status", validators_1.changeStatusValidator, middlewares_1.validationMiddleware, controllers_1.changeStatusController);
router.put("/:billId", validators_1.editBillValidator, middlewares_1.validationMiddleware, controllers_1.editBillController);
router.delete("/delete", validators_1.deleteBillValidator, middlewares_1.validationMiddleware, controllers_1.deleteBillController);
exports.default = router;
//# sourceMappingURL=routes.js.map