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
exports.searchUserController = exports.editUserController = exports.userDataController = void 0;
const db_1 = require("../db");
const types_1 = require("../error/types");
function userDataController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        // Fetch the user
        const user = yield db_1.db.user.findFirst({
            where: {
                userId: id,
            },
            include: {
                // Fetches the groups the user is in
                groups: {
                    include: {
                        // Includes basic information about the users in the group
                        users: {
                            select: {
                                id: true,
                                userId: true,
                                name: true,
                            },
                        },
                    },
                },
                // All the bills the user is the creditor of which are not in a group
                bills: {
                    where: {
                        group: null,
                    },
                },
                // All the bills the user is the debtor of which are not in a group
                owes: {
                    where: {
                        bill: {
                            group: null,
                            creditor: {
                                userId: {
                                    not: id,
                                },
                            },
                        },
                    },
                    include: {
                        // Bill information is included
                        bill: {
                            include: {
                                // Basic information about the creditor is included
                                creditor: {
                                    select: {
                                        id: true,
                                        userId: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        // Ensures the user exists
        if (user == null) {
            next(new types_1.BadRequestError("User not found"));
            return;
        }
        const response = {
            id: user.id,
            userId: user.userId,
            name: user.name,
        };
        // Only returns the email and groups if the user is requesting their own data
        if (req.uid === user.id) {
            response["email"] = user.email;
            response["groups"] = user.groups;
            response["bills"] = user.bills;
            response["owes"] = user.owes;
        }
        res.json(response);
    });
}
exports.userDataController = userDataController;
function editUserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.userId;
        const name = req.body.name;
        const email = req.body.email;
        const mutation = {};
        // Only updates the name and email if they are not null
        if (name != null) {
            mutation["name"] = name;
        }
        if (email != null) {
            mutation["email"] = email;
        }
        // Updates the user
        yield db_1.db.user.update({
            where: {
                userId: id,
            },
            data: mutation,
        });
        res.json({
            message: "User updated",
        });
    });
}
exports.editUserController = editUserController;
function searchUserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = req.query.query;
        if (query.length < 2) {
            res.json([]);
            return;
        }
        // Fetches the users
        const users = yield db_1.db.user.findMany({
            where: {
                userId: {
                    startsWith: query,
                },
            },
        });
        const response = users.map((user) => {
            return {
                id: user.id,
                userId: user.userId,
                name: user.name,
            };
        });
        res.json({
            users: response,
        });
    });
}
exports.searchUserController = searchUserController;
//# sourceMappingURL=controllers.js.map