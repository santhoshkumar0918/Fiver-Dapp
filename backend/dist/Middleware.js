"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _1 = require(".");
function authMiddleware(req, res, next) {
    var _a;
    const authHeaders = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : "";
    try {
        const decoded = jsonwebtoken_1.default.verify(authHeaders, _1.JWT_SECRET);
        //@ts-ignore
        if (decoded.userId) {
            //@ts-ignore
            req.userid = decoded.userId;
            return next();
        }
        else {
            return res.status(403).json({
                message: "you are not logged in",
            });
        }
    }
    catch (e) {
        return res.status(403).json({
            message: "you are not  logged in "
        });
    }
}
