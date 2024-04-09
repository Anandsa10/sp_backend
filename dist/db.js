"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.db = void 0;
const client_1 = require("@prisma/client");
// import { PrismaClient } from "@prisma/client";
const db = new client_1.PrismaClient();
exports.db = db;
function initDB() {
    db.$connect().then(() => {
        console.log("Connected to database");
    });
}
exports.initDB = initDB;
//# sourceMappingURL=db.js.map