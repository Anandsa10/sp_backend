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
exports.ensureLoggedIn = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../error/types");
function ensureLoggedIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensures authorization header is present
        if (req.headers.authorization == null) {
            next(new types_1.UnauthorizedError("No token present"));
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        // Ensures token is present
        if (token == null) {
            next(new types_1.UnauthorizedError("No token present"));
            return;
        }
        let payload;
        // Ensures token is valid
        try {
            payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        }
        catch (err) {
            next(new types_1.UnauthorizedError("Invalid token"));
            return;
        }
        if (payload == null) {
            next(new types_1.UnauthorizedError("Invalid token"));
            return;
        }
        // Passes the userId and uid to the request object
        req.userId = payload.userId;
        req.uid = payload.uid;
        next();
    });
}
exports.ensureLoggedIn = ensureLoggedIn;
//# sourceMappingURL=middlewares.js.map