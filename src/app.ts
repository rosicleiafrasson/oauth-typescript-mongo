import express from 'express'
import morgan from 'morgan'
import exphbs from 'express-handlebars'
import path from 'path'
import cookie from 'cookie-session'
import passport from 'passport'
import expressSession from 'express-session'
import flash from 'connect-flash'

import indexRoutes from './routes'
import authenticateRoutes from './routes/authenticate'
import usersRoutes from './routes/users'
import issuesRoutes from './routes/issues'
const keys = require('./config/keys')
const passportSetup = require('./config/passport')

class Application {

    app: express.Application

    constructor() {
        this.app = express()
        this.settings()
        this.middlewares()
        this.routes()
    }

    settings() {
        this.app.set('port', 3000)
        this.app.set('views', path.join(__dirname, 'views'))
        this.app.engine('.hbs', exphbs({
            layoutsDir: path.join(this.app.get('views'), 'layouts'),
            partialsDir: path.join(this.app.get('views'), 'partials'),
            defaultLayout: 'main',
            extname: '.hbs'
        }))
        this.app.set('view engine', '.hbs')
    }
    
    middlewares(){
        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookie({
            maxAge: 24 * 60 * 60 * 1000,
            keys: [keys.cookie.key]
        }))
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        
    }

    routes() {
        this.app.use(indexRoutes)
        this.app.use('/', authenticateRoutes)
        this.app.use('/users', usersRoutes)
        this.app.use('/issues', issuesRoutes)
        this.app.use(express.static(path.join(__dirname, 'public')))
    }

    start() {
        this.app.listen( this.app.get('port'), () => {
            console.log("server running on port  " + this.app.get('port'))
        })
    }
}

export default Application