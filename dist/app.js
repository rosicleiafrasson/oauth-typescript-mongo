"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const path_1 = __importDefault(require("path"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = __importDefault(require("./routes"));
const authenticate_1 = __importDefault(require("./routes/authenticate"));
const users_1 = __importDefault(require("./routes/users"));
const issues_1 = __importDefault(require("./routes/issues"));
const keys = require('./config/keys');
const passportSetup = require('./config/passport');
class Application {
    constructor() {
        this.app = express_1.default();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        this.app.set('port', 3000);
        this.app.set('views', path_1.default.join(__dirname, 'views'));
        this.app.engine('.hbs', express_handlebars_1.default({
            layoutsDir: path_1.default.join(this.app.get('views'), 'layouts'),
            partialsDir: path_1.default.join(this.app.get('views'), 'partials'),
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        this.app.set('view engine', '.hbs');
    }
    middlewares() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(cookie_session_1.default({
            maxAge: 24 * 60 * 60 * 1000,
            keys: [keys.cookie.key]
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
    }
    routes() {
        this.app.use(routes_1.default);
        this.app.use('/', authenticate_1.default);
        this.app.use('/users', users_1.default);
        this.app.use('/issues', issues_1.default);
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("server running on port  " + this.app.get('port'));
        });
    }
}
exports.default = Application;
