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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const GitHubStrategy = require('passport-github').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const user_1 = __importDefault(require("../models/user"));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(id);
    done(null, user);
}));
passport_1.default.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email });
    if (!user) {
        done(null, false, { message: 'Email não cadastrado' });
    }
    else {
        var userString = JSON.stringify(user);
        var samePassword = false;
        if (userString.includes("password")) {
            var start = userString.indexOf("password") + ("password".length);
            var end = userString.indexOf(',', start);
            var passwordString = userString.substring(start, end).replace(/"/g, "").replace(/:/g, '');
            samePassword = bcryptjs_1.default.compareSync(password, passwordString);
        }
        if (samePassword) {
            done(null, user);
        }
        else {
            done(null, false, { message: 'Verifique sua senha' });
        }
    }
})));
passport_1.default.use(new GitHubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: '/auth/github/redirect'
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ email: profile.emails[0].value });
    if (user) {
        done(null, user);
    }
    else {
        const createDate = Date.now();
        const email = profile.emails[0].value;
        const username = profile.username;
        const newUser = new user_1.default({ email, username, createDate });
        const userCreated = yield newUser.save();
        done(null, userCreated);
    }
})));
