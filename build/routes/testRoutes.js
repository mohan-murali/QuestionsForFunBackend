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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRouter = void 0;
const dotenv = __importStar(require("dotenv"));
const express_1 = require("express");
const authHandler_1 = require("../middleware/authHandler");
const test_1 = require("../models/test");
dotenv.config();
const testRouter = (0, express_1.Router)();
exports.testRouter = testRouter;
testRouter.post("/test", authHandler_1.authHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { questions } = req.body;
        const test = {
            questions: questions,
            email: user.email,
        };
        let newTest = new test_1.TestModel(test);
        newTest = yield newTest.save();
        res.status(200).json({
            testId: newTest._id,
            success: true,
            message: "Test saved successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to save test",
        });
    }
}));
testRouter.get("/test/:testId", authHandler_1.authHandler, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { testId } = req.params;
        const test = yield test_1.TestModel.findById(testId);
        if (test) {
            res.status(200).json({
                test: test,
                success: true,
                message: "Test retrieved successfully",
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: `the test with the given id: ${testId} was not found`,
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch the test data",
        });
    }
}));
