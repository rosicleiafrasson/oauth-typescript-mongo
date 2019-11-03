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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../models/user"));
const user_2 = __importDefault(require("../models/user"));
const router = express_1.Router();
const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/signin');
    }
    else {
        next();
    }
};
router.route('/create')
    .get((req, res) => {
    res.render('users/create', { user: req.user });
})
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var errors = [];
    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ text: 'O nome deve ser preenchido' });
    }
    const findUser = yield user_2.default.findOne({ email: req.body.email });
    if (findUser) {
        errors.push({ text: 'Esse email já está sendo usado por algum usuário' });
    }
    if (errors.length > 0) {
        res.render('users/create', { errors: errors });
    }
    else {
        var password = bcryptjs_1.default.hashSync(req.body.password, bcryptjs_1.default.genSaltSync(10));
        const { name, email, job } = req.body;
        const createDate = Date.now();
        const newUser = new user_1.default({ name, email, password, job, createDate });
        const a = yield newUser.save();
        res.redirect('/users/list');
    }
}));
router.get('/list', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_2.default.find();
    res.render('users/list', { users, user: req.user });
}));
router.get('/delete/:id', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_1.default.findByIdAndDelete(id);
    res.redirect('/users/list');
}));
router.get('/edit/:id', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userById = yield user_1.default.findById(id);
    console.log(req.user + 'userReq');
    var same;
    if (JSON.stringify(userById) === JSON.stringify(req.user)) {
        same = true;
    }
    res.render('users/edit', { userById, user: req.user, same });
}));
router.post('/edit/:id', authCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, job, createDate } = req.body;
    const updateDate = Date.now();
    if (req.body.password) {
        const password = bcryptjs_1.default.hashSync(req.body.password, bcryptjs_1.default.genSaltSync(10));
        yield user_1.default.findByIdAndUpdate(id, { name, email, password, job, createDate, updateDate });
    }
    else {
        yield user_1.default.findByIdAndUpdate(id, { name, email, job, createDate, updateDate });
    }
    res.redirect('/users/list');
}));
router.get('/', authCheck, (req, res) => {
    res.render('users/edit', { user: req.user });
});
exports.default = router;
