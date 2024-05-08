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
exports.getBillController = exports.changeStatusController = exports.editBillController = exports.deleteBillController = exports.createBillController = void 0;
const db_1 = require("../db");
const types_1 = require("../error/types");
const services_1 = require("../group/services");
const services_2 = require("./services");
function getBillController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const billId = req.params.billId;
        // Find the bill
        const bill = yield db_1.db.bill.findUnique({
            where: {
                id: billId,
            },
            include: {
                creditor: {
                    select: {
                        id: true,
                        name: true,
                        userId: true,
                    },
                },
                owes: {
                    include: {
                        debtor: {
                            select: {
                                id: true,
                                name: true,
                                userId: true,
                            },
                        },
                    },
                },
            },
        });
        // Check if bill exists
        if (!bill) {
            next(new types_1.BadRequestError("Bill does not exist"));
            return;
        }
        res.status(200).json(bill);
    });
}
exports.getBillController = getBillController;
function createBillController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = req.body.title;
        const amount = req.body.amount;
        const groupId = req.body.groupId;
        const owes = new Map(Object.entries(req.body.owes));
        if (groupId) {
            // Find the group
            const group = yield (0, services_1.getGroupById)(groupId);
            // Check if group exists
            if (!group) {
                next(new types_1.BadRequestError("Group does not exist"));
                return;
            }
            // Check if user is in group
            if (!(0, services_1.userInGroup)(group, req.uid)) {
                next(new types_1.BadRequestError("User is not in group"));
                return;
            }
        }
        // Check if all owe keys are valid MongoIds
        if (!Array.from(owes.keys()).every((key) => key.match(/^[0-9a-fA-F]{24}$/))) {
            next(new types_1.BadRequestError("Invalid user id"));
            return;
        }
        // Fetch all debtors
        const debtors = yield db_1.db.user.findMany({
            where: {
                id: {
                    in: Array.from(owes.keys()),
                },
            },
        });
        // Check if all debtors exist
        if (debtors.length !== owes.size) {
            next(new types_1.BadRequestError("Debtor does not exist"));
            return;
        }
        // Check is amount == sum of owes
        const sum = Array.from(owes.values()).reduce((a, b) => a + b, 0);
        if (sum !== amount) {
            next(new types_1.BadRequestError("Amount does not match sum of owes"));
            return;
        }
        const data = {};
        // Only add group if it exists
        if (groupId) {
            data["group"] = {
                connect: {
                    id: groupId,
                },
            };
        }
        // Create bill
        yield db_1.db.bill.create({
            data: Object.assign(Object.assign({}, data), { title,
                amount, creditor: {
                    connect: {
                        id: req.uid,
                    },
                }, owes: {
                    createMany: {
                        data: Array.from(owes.entries()).map(([userId, amount]) => ({
                            amount,
                            status: userId === req.uid ? "PAID" : "PENDING",
                            debtorId: userId,
                        })),
                    },
                } }),
        });

        await db.anotherTable.create({
            data: {
                title: createdBill.title,
                amount: createdBill.amount,
                creditorId: createdBill.creditorId, // Assuming creditorId is the field in anotherTable to store creditor's ID
                // Copy any other relevant fields
            },
        });
        res.status(200).json({
            message: "Bill created successfully",
        });
    });
}
exports.createBillController = createBillController;
function deleteBillController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const billId = req.body.billId;
        // Find the bill
        const bill = yield (0, services_2.getBillById)(billId);
        // Check if bill exists
        if (!bill) {
            next(new types_1.BadRequestError("Bill does not exist"));
            return;
        }
        // Check if user is in group
        if (!(bill.creditorId === req.uid)) {
            next(new types_1.BadRequestError("User is not the creditor"));
            return;
        }
        // Delete all owes
        yield db_1.db.owe.deleteMany({
            where: {
                billId: billId,
            },
        });
        // Delete bill
        yield db_1.db.bill.delete({
            where: {
                id: billId,
            },
        });
        res.status(200).json({
            message: "Bill deleted successfully",
        });
    });
}
exports.deleteBillController = deleteBillController;
function editBillController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const billId = req.params.billId;
        const title = req.body.title;
        const amount = req.body.amount;
        const owes = req.body.owes
            ? new Map(Object.entries(req.body.owes))
            : null;
        // Find the bill
        const bill = yield (0, services_2.getBillById)(billId);
        // Check if bill exists
        if (!bill) {
            next(new types_1.BadRequestError("Bill does not exist"));
            return;
        }
        // Check if user is the creditor
        if (!(bill.creditorId === req.uid)) {
            next(new types_1.BadRequestError("User is not the creditor"));
            return;
        }
        const mutation = {};
        // Only add title if it exists
        if (title) {
            mutation["title"] = title;
        }
        // Only add amount if it exists
        if (amount) {
            mutation["amount"] = amount;
        }
        // Only add owes if it exists
        if (owes) {
            // Check if all owe keys are valid MongoIds
            if (!Array.from(owes.keys()).every((key) => key.match(/^[0-9a-fA-F]{24}$/))) {
                next(new types_1.BadRequestError("Invalid user id"));
                return;
            }
            // Fetch all debtors
            const debtors = yield db_1.db.user.findMany({
                where: {
                    id: {
                        in: Array.from(owes.keys()),
                    },
                },
            });
            // Check if all debtors exist
            if (debtors.length !== owes.size) {
                next(new types_1.BadRequestError("Debtor does not exist"));
                return;
            }
            // Check is amount == sum of owes
            const sum = Array.from(owes.values()).reduce((a, b) => a + b, 0);
            if (sum !== amount) {
                next(new types_1.BadRequestError("Amount does not match sum of owes"));
                return;
            }
            // Delete all owes
            yield db_1.db.owe.deleteMany({
                where: {
                    billId: billId,
                },
            });
            // Create new owes
            yield db_1.db.bill.update({
                where: {
                    id: billId,
                },
                data: {
                    owes: {
                        createMany: {
                            data: Array.from(owes.entries()).map(([userId, amount]) => ({
                                amount,
                                status: "PENDING",
                                debtorId: userId,
                            })),
                        },
                    },
                },
            });
        }
        yield db_1.db.bill.update({
            where: {
                id: billId,
            },
            data: Object.assign({}, mutation),
        });
        res.status(200).json({
            message: "Bill edited successfully",
        });
    });
}
exports.editBillController = editBillController;
function changeStatusController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const oweId = req.body.oweId;
        const status = req.body.status;
        // Find the owe
        const owe = yield (0, services_2.getOweById)(oweId);
        // Check if owe exists
        if (!owe) {
            next(new types_1.BadRequestError("Invalid debt"));
            return;
        }
        // Check if user is the creditor
        if (!(owe.bill.creditorId === req.uid)) {
            next(new types_1.BadRequestError("User is not the creditor"));
            return;
        }
        // Change status
        yield db_1.db.owe.update({
            where: {
                id: oweId,
            },
            data: {
                status,
            },
        });
        res.status(200).json({
            message: "Status changed successfully",
        });
    });
}
exports.changeStatusController = changeStatusController;
//# sourceMappingURL=controllers.js.map
