"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IssueSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    userReporter: {},
    userAssign: {}
});
exports.default = mongoose_1.model('Issue', IssueSchema);
