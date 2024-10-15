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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
const JWT_SECRET = "santhosh0918";
router.post("/sigin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hardCodedWallet = "0xa32A6A5a10cC6C028137627977e5739F5568ca65";
    const userExisting = yield prismaClient.user.findFirst({
        where: {
            address: hardCodedWallet,
        }
    });
    if (userExisting) {
        const token = jsonwebtoken_1.default.sign({
            userID: userExisting.id
        }, JWT_SECRET);
        res.json({
            token
        });
    }
    else {
        const user = yield prismaClient.user.create({
            data: {
                address: hardCodedWallet,
            }
        });
        const token = jsonwebtoken_1.default.sign({
            userID: user.id
        }, JWT_SECRET);
        res.json({
            token
        });
    }
}));
exports.default = router;
