"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const router_1 = require("./router");
const morgan = require("morgan");
const middlewares_1 = require("./error/middlewares");
const db_1 = require("./db");
dotenv.config();
const app = express();
(0, db_1.initDB)();
// Middlewares
app.use(express.json());
app.use(morgan(process.env.LOG_LEVEL || "dev"));
app.use("/api", router_1.default);
app.use(middlewares_1.errorMiddleware);
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening on port ${process.env.PORT || 5000}`);
});
//# sourceMappingURL=index.js.map