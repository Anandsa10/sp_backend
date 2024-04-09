"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("./auth/middlewares");
// App modules
const routes_1 = require("./auth/routes");
const routes_2 = require("./user/routes");
const routes_3 = require("./group/routes");
const routes_4 = require("./bill/routes");
const router = (0, express_1.Router)();
router.use("/auth", routes_1.default);
router.use("/user", middlewares_1.ensureLoggedIn, routes_2.default);
router.use("/group", middlewares_1.ensureLoggedIn, routes_3.default);
router.use("/bill", middlewares_1.ensureLoggedIn, routes_4.default);
exports.default = router;
//# sourceMappingURL=router.js.map