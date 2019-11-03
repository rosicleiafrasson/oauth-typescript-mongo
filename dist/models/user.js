"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    job: {
        type: String
    },
    createDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date
    }
});
exports.default = mongoose_1.model('User', UserSchema);
