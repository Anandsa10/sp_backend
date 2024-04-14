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
exports.signInController = exports.signUpController = void 0;
const db_1 = require("../db");
const types_1 = require("../error/types");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
function signUpController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId;
        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;


        // Validate password length and special characters
        if (password.length < 8 || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
            next(new types_1.BadRequestError("Password must be at least 8 characters long and contain at least one special character"));
            return;
        // Check if the username is taken
        const existingUser = yield db_1.db.user.findFirst({
            where: {
                userId: userId,
            },
        });
        if (existingUser != null) {
            next(new types_1.BadRequestError("Username is taken"));
            return;
        }
        // Create the user
        const newUser = yield db_1.db.user.create({
            data: {
                userId: userId,
                name: name,
                password: password,
                email: email,
            },
        });
        // Generate the JWT token
        const token = (0, jsonwebtoken_1.sign)({ userId: userId, uid: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.json({ token: token });
    });
}
exports.signUpController = signUpController;
function signInController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId;
        const password = req.body.password;
        // Fetch the user
        const user = yield db_1.db.user.findFirst({
            where: {
                userId: userId,
            },
        });
        // No user found
        if (user == null) {
            next(new types_1.BadRequestError("Invalid username or password"));
            return;
        }
        // Check the password
        // const passwordMatch = yield (0, bcrypt_1.compare)(password, user.password);
        const passwordMatch = yield (password, user.password);
        if (!passwordMatch) {
            next(new types_1.BadRequestError("Invalid username or password"));
            return;
        }
        // Generate the JWT token
        const token = (0, jsonwebtoken_1.sign)({ userId: userId, uid: user.id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.json({ token: token });
    });
}
exports.signInController = signInController;
//# sourceMappingURL=controllers.js.map
