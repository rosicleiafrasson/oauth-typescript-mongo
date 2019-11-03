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
const express_1 = require("express");
const issue_1 = __importDefault(require("../models/issue"));
const issue_2 = __importDefault(require("../models/issue"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.Router();
const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/signin');
    }
    else {
        next();
    }
};
router.get('/', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const issues = yield issue_2.default.find();
    res.render('issues/list', { issues, user: req.user });
}));
router.get('/create', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersFounded = yield user_1.default.find();
    res.render('issues/create', { user: req.user, usersFounded });
}));
router.post('/create', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, userAssignId } = req.body;
    const userReporter = req.user;
    var userAssign = null;
    if (userAssignId != 'Escolha') {
        userAssign = yield user_1.default.findById(userAssignId);
    }
    const newIssue = new issue_1.default({ title, description, userReporter, userAssign });
    yield newIssue.save();
    res.redirect('/issues/list');
}));
router.get('/list', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const issues = yield issue_2.default.find();
    console.log(issues);
    res.render('issues/list', { issues, user: req.user });
}));
router.get('/delete/:id', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield issue_1.default.findByIdAndDelete(id);
    console.log(req.params);
    res.redirect('/issues/list');
}));
router.get('/edit/:id', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const issue = yield issue_1.default.findById(id);
    const usersFounded = yield user_1.default.find();
    res.render('issues/edit', { issue, user: req.user, usersFounded });
    console.log(issue);
}));
router.post('/edit/:id', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, userAssignId } = req.body;
    if (userAssignId != 'Escolha') {
        const userAssign = yield user_1.default.findById(userAssignId);
        yield issue_1.default.findByIdAndUpdate(id, { title, description, userAssign });
    }
    else {
        yield issue_1.default.findByIdAndUpdate(id, { title, description });
    }
    res.redirect('/issues/list');
}));
exports.default = router;
