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
exports.authHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_KEY = process.env.JWT_KEY || "";
    //Get token from header
    const token = req.header("x-auth-token");
    //Check if token is present
    if (!token) {
        return res
            .status(401)
            .json({ msg: "No token found. Authorization Denied" });
    }
    // Verify token
    try {
        const usr = jsonwebtoken_1.default.verify(token, JWT_KEY);
        const user = yield user_1.UserModel.findById(usr.userId);
        //@ts-ignore
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token invalid." });
    }
});
exports.authHandler = authHandler;
