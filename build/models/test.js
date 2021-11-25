"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModel = void 0;
const mongoose_1 = require("mongoose");
const testSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    questions: [
        {
            question: {
                type: String,
                required: true,
            },
            options: [
                {
                    id: Number,
                    value: String,
                },
            ],
            correctAnswerId: {
                type: Number,
                required: true,
            },
        },
    ],
});
exports.TestModel = (0, mongoose_1.model)("Test", testSchema);
