"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInGroup = exports.getGroupById = void 0;
// import { Group } from "@prisma/client";
const db_1 = require("../db");
function getGroupById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db_1.db.group.findFirst({
            where: {
                id: id,
            },
        });
    });
}
exports.getGroupById = getGroupById;
function userInGroup(group, uid) {
    return group.usersIds.includes(uid);
}
exports.userInGroup = userInGroup;
//# sourceMappingURL=services.js.map