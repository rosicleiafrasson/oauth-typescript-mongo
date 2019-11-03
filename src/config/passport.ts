import bcrypt from 'bcryptjs'
import passport from 'passport'
const GitHubStrategy = require('passport-github').Strategy
const LocalStrategy = require('passport-local').Strategy

const keys = require('./keys');
import User from '../models/user'

passport.serializeUser((user: any, done: any) => {
    done(null, user.id)
})

passport.deserializeUser(async(id: any, done: any) => {
    const user = await User.findById(id)
    done(null, user)
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    }, async (email: any, password: any, done: any) => {
        const user = await User.findOne({email});
        if(!user){
            done(null, false, {message: 'Email não cadastrado'})
        }else{
            var userString =  JSON.stringify(user)
            var samePassword = false
            if(userString.includes("password")){
                var start = userString.indexOf("password") + ("password".length)
                var end = userString.indexOf(',', start)
                var passwordString = userString.substring(start, end).replace(/"/g,"").replace(/:/g,'')
                samePassword = bcrypt.compareSync(password, passwordString)
            }
            if(samePassword){
                done(null, user)
            }else{
                done(null, false, {message: 'Verifique sua senha'}) 
            }
        }
    })
)

passport.use(new GitHubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: '/auth/github/redirect'
    }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        const user = await User.findOne({email: profile.emails[0].value})
        if(user){
            done(null, user)
        }else{
        const createDate = Date.now()
        const email = profile.emails[0].value
        const username = profile.username
        const newUser = new User({email, username, createDate })
        const userCreated = await newUser.save()
        done(null, userCreated)
        }
    })
)

