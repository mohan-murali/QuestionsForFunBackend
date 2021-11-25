"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.loginRouter = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authHandler_1 = require("../middleware/authHandler");
const user_1 = require("../models/user");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const loginRouter = (0, express_1.Router)();
exports.loginRouter = loginRouter;
const JWT_KEY = process.env.JWT_KEY || "";
loginRouter.get("/", (req, res) => {
    res.send("you have been logged in");
});
loginRouter.get("/logout", (req, res) => {
    req.session = undefined;
    res.redirect("/");
});
loginRouter.get("/protected", authHandler_1.authHandler, (req, res) => {
    console.log(req.user);
    res.send("welcome to the protected route");
});
loginRouter.post("/signUp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, type } = req.body;
        if (name && email && password && type) {
            //Check if the email and password is correct
            const user = {
                name,
                email,
                password,
                type,
            };
            let userCheck = yield user_1.UserModel.findOne({ email: email });
            if (userCheck) {
                res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }
            let newUser = new user_1.UserModel(user);
            const salt = yield bcrypt_1.default.genSalt(10);
            newUser.password = yield bcrypt_1.default.hash(newUser.password, salt);
            newUser = yield newUser.save();
            res.status(200).json({
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    type: newUser.type,
                },
                success: true,
                message: "user created successfully",
            });
        }
        else
            res.status(400).json({
                success: false,
                message: "You need to send name, email, password and type",
            });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "cannot retrieve user",
        });
    }
}));
loginRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email && password) {
            //Check if the email and password is correct
            const user = yield user_1.UserModel.findOne({ email: email });
            if (user) {
                const passwordMatched = yield bcrypt_1.default.compare(password, user.password);
                if (passwordMatched) {
                    const token = jsonwebtoken_1.default.sign({ userId: user._id }, JWT_KEY, {
                        expiresIn: "24h",
                    });
                    return res.status(200).json({
                        success: true,
                        user,
                        token,
                    });
                }
                else {
                    return res.status(403).json({
                        success: false,
                        message: "email and password did not match",
                    });
                }
            }
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        else
            res.status(400).json({
                success: false,
                message: "You need to send email and password",
            });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "cannot retrieve user",
        });
    }
}));
