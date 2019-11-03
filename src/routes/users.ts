import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/user'
import user from '../models/user'

const router = Router()

const authCheck = (req: Request, res: Response, next: any) => {
    if(!req.user){
        res.redirect('/signin')
    } else {
        next()
    }
}

router.route('/create')
    .get((req: Request, res: Response) => {
        res.render('users/create', {user: req.user})
    })
    .post(async(req: Request, res: Response) => {
        var errors = []
        if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
            errors.push({text: 'O nome deve ser preenchido'})
        }

        const findUser = await user.findOne({email: req.body.email});
        if(findUser){
            errors.push({text: 'Esse email já está sendo usado por algum usuário'})
        }

        if(errors.length > 0){
            res.render('users/create', {errors: errors})
        }else{
            var password = bcrypt.hashSync(req.body.password,  bcrypt.genSaltSync(10))
            const {name, email, job} = req.body
            const createDate = Date.now()
            const newUser = new User({name, email, password, job, createDate })
            const a = await newUser.save()
            res.redirect('/users/list')
        }
    })

router.get('/list',authCheck, async (req, res) => {
    const users = await user.find()
    res.render('users/list', {users, user: req.user})
})

router.get('/delete/:id', authCheck, async(req: Request, res: Response) => {
    const {id} = req.params
    await User.findByIdAndDelete(id)
    res.redirect('/users/list')
})

router.get('/edit/:id', authCheck, async(req: Request, res: Response) => {
    const {id} = req.params
    const userById = await User.findById(id)
    console.log(req.user + 'userReq')
    var same
    if(JSON.stringify(userById) === JSON.stringify(req.user)){
        same = true
    }

    res.render('users/edit', {userById, user: req.user, same})
})

router.post('/edit/:id', authCheck, async(req: Request, res: Response) => {
    const {id} = req.params
    
    const {name, email, job, createDate} = req.body
    const updateDate = Date.now()
    if(req.body.password){
        const password = bcrypt.hashSync(req.body.password,  bcrypt.genSaltSync(10))
        await User.findByIdAndUpdate(id, {name, email, password, job, createDate, updateDate})
    }else{
        await User.findByIdAndUpdate(id, {name, email, job, createDate, updateDate})
    }
    res.redirect('/users/list')
})

router.get('/', authCheck, (req, res) => {
    res.render('users/edit', {user: req.user})
})

export default router
