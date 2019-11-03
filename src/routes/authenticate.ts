import { Router, Request, Response } from 'express'

const router = Router()
const passport = require('passport')
const passportSetup = require('../config/passport')

router.get('/signin', (req, res) => {
    res.render('authenticate/signin')
})

router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

router.post('/login',
  passport.authenticate('local', { successRedirect: '/issues', failureRedirect: '/signin?fail=true' })
)

router.get('/auth/github', passport.authenticate('github'))

router.get('/auth/github/redirect', passport.authenticate('github'), (req, res) => {
    res.redirect('/issues')
})

export default router