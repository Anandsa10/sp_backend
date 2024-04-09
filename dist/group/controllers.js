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
exports.redistributeController = exports.getGroupDataController = exports.leaveGroupController = exports.joinGroupController = exports.editGroupController = exports.createGroupController = void 0;
// import { MaxHeap, MinHeap } from "@datastructures-js/heap";
const heap_1 = require("@datastructures-js/heap");
// import { Status } from "@prisma/client";
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const types_1 = require("../error/types");
const services_1 = require("./services");
const structures_1 = require("./structures");
function createGroupController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = req.body.name;
        // Create group
        const newGroup = yield db_1.db.group.create({
            data: {
                name: name,
                users: {
                    connect: {
                        id: req.uid,
                    },
                },
            },
        });
        res.status(200).json({ message: "Group created" });
    });
}
exports.createGroupController = createGroupController;
function editGroupController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = req.body.name;
        const id = req.params.id;
        // Fetch group
        const group = yield (0, services_1.getGroupById)(id);
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
        // Edit group
        yield db_1.db.group.update({
            where: {
                id: group.id,
            },
            data: {
                name: name,
            },
        });
        res.status(200).json({ message: "Group edited" });
    });
}
exports.editGroupController = editGroupController;
function joinGroupController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const groupId = req.body.groupId;
        // Fetch group
        const group = yield (0, services_1.getGroupById)(groupId);
        // Check if group exists
        if (!group) {
            next(new types_1.BadRequestError("Group does not exist"));
            return;
        }
        // Check if user is in group
        if ((0, services_1.userInGroup)(group, req.uid)) {
            next(new types_1.BadRequestError("User is already in group"));
            return;
        }
        // Add user to group
        yield db_1.db.group.update({
            where: {
                id: group.id,
            },
            data: {
                users: {
                    connect: {
                        id: req.uid,
                    },
                },
            },
        });
        res.status(200).json({ message: "Joined in group" });
    });
}
exports.joinGroupController = joinGroupController;
function leaveGroupController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const groupId = req.body.groupId;
        // Fetch group
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
        // Remove user from group
        yield db_1.db.group.update({
            where: {
                id: group.id,
            },
            data: {
                users: {
                    disconnect: {
                        id: req.uid,
                    },
                },
            },
        });
        // Set all bills as individual
        yield db_1.db.bill.updateMany({
            where: {
                groupId: group.id,
                creditorId: req.uid,
            },
            data: {
                groupId: null,
            },
        });
        // Fetch associated owes
        const owes = yield db_1.db.owe.findMany({
            where: {
                bill: {
                    groupId: group.id,
                },
                debtorId: req.uid,
            },
        });
        // Set all owes as individual
        yield Promise.all(owes.map((owe) => __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.bill.update({
                where: {
                    id: owe.billId,
                },
                data: {
                    groupId: null,
                },
            });
        })));
        res.status(200).json({ message: "Left group" });
    });
}
exports.leaveGroupController = leaveGroupController;
function getGroupDataController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const groupId = req.params.id;
        // Fetch group
        const group = yield db_1.db.group.findUnique({
            where: {
                id: groupId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        userId: true,
                        name: true,
                    },
                },
                bills: {
                    include: {
                        owes: true,
                    },
                },
            },
        });
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
        res.status(200).json(group);
    });
}
exports.getGroupDataController = getGroupDataController;
function redistributeController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const groupId = req.params.groupId;
        // Fetch group
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
        // Fetch all bills
        const bills = yield db_1.db.bill.findMany({
            where: {
                groupId: group.id,
            },
            include: {
                owes: true,
            },
        });
        const balance = new Map();
        // Calculate balance for each user
        for (const bill of bills) {
            if (!balance.has(bill.creditorId))
                balance.set(bill.creditorId, 0);
            for (const owe of bill.owes) {
                if (!balance.has(owe.debtorId))
                    balance.set(owe.debtorId, 0);
                if (owe.status === client_1.Status.PAID)
                    continue;
                balance.set(bill.creditorId, balance.get(bill.creditorId) + owe.amount);
                balance.set(owe.debtorId, balance.get(owe.debtorId) - owe.amount);
            }
        }
        // Min and Max heaps
        const minHeap = new heap_1.MinHeap(structures_1.balanceValue);
        const maxHeap = new heap_1.MaxHeap(structures_1.balanceValue);
        // Insert all balances into heaps
        for (const [userId, amount] of balance) {
            if (amount < 0)
                minHeap.insert({ userId, amount });
            else if (amount > 0)
                maxHeap.insert({ userId, amount });
        }
        const newRoughBills = new Map();
        // Redistribute
        while (minHeap.size() > 0 && maxHeap.size() > 0) {
            // Pick largest creditor and smallest debtor
            const minVal = minHeap.extractRoot();
            const maxVal = maxHeap.extractRoot();
            if (!newRoughBills.has(maxVal.userId))
                newRoughBills.set(maxVal.userId, new Map());
            if (!newRoughBills.get(maxVal.userId).has(minVal.userId))
                newRoughBills.get(maxVal.userId).set(minVal.userId, 0);
            // Difference between the two
            const diff = minVal.amount + maxVal.amount;
            // Amount to be transferred
            const amount = Math.min(-minVal.amount, maxVal.amount);
            newRoughBills.get(maxVal.userId).set(minVal.userId, amount);
            // If difference is 0, then both are settled
            // If difference is > 0, then maxVal is still left with some amount
            // If difference is < 0, then minVal is still left with some amount
            if (diff < 0) {
                minHeap.insert({ userId: minVal.userId, amount: diff });
            }
            else if (diff > 0) {
                maxHeap.insert({ userId: maxVal.userId, amount: diff });
            }
        }
        // Delete all old owes
        yield db_1.db.owe.deleteMany({
            where: {
                bill: {
                    groupId: group.id,
                },
            },
        });
        // Delete all old bills
        yield db_1.db.bill.deleteMany({
            where: {
                groupId: group.id,
            },
        });
        const idToName = new Map();
        // Fetch all users
        const users = yield db_1.db.user.findMany({
            where: {
                id: {
                    in: Array.from(balance.keys()),
                },
            },
        });
        // Map user id to name
        for (const user of users) {
            idToName.set(user.id, user.name);
        }
        // Create new bills
        yield Promise.all(Array.from(newRoughBills).map(([creditorId, owes]) => __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.bill.create({
                data: {
                    creditorId,
                    groupId: group.id,
                    amount: balance.get(creditorId),
                    title: "[Simplified] " + idToName.get(creditorId),
                    owes: {
                        create: Array.from(owes).map(([debtorId, amount]) => ({
                            debtorId,
                            amount,
                            status: "PENDING",
                        })),
                    },
                },
            });
        })));
        res.json({ message: "Redistributed Successfully" });
    });
}
exports.redistributeController = redistributeController;
//# sourceMappingURL=controllers.js.map