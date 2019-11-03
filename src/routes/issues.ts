import { Router, Request, Response } from 'express'

import Issue from '../models/issue'
import issue from '../models/issue'
import User from '../models/user'

const router = Router()
const authCheck = (req: Request, res: Response, next: any) => {
    if(!req.user){
        res.redirect('/signin')
    } else {
        next()
    }
}

router.get('/',authCheck, async (req, res) => {
    const issues = await issue.find()
    res.render('issues/list', {issues, user: req.user})
})

router.get('/create', authCheck, async(req: Request, res: Response) => {
    const usersFounded = await User.find()
    res.render('issues/create', {user: req.user, usersFounded})
})

router.post('/create', authCheck, async(req: Request, res: Response) => {
    const {title, description, userAssignId} = req.body
    const userReporter = req.user
    var userAssign = null
    if(userAssignId != 'Escolha'){
        userAssign =  await User.findById(userAssignId)
    }
    const newIssue = new Issue({title, description, userReporter, userAssign})
    await newIssue.save()
    res.redirect('/issues/list')
})

router.get('/list', authCheck, async(req: Request, res: Response) => {
    const issues = await issue.find()
    console.log(issues);
    res.render('issues/list', {issues, user: req.user})
})

router.get('/delete/:id', authCheck, async(req: Request, res: Response) => {
    const {id} = req.params
    await Issue.findByIdAndDelete(id)
    console.log(req.params)
    res.redirect('/issues/list')
});

router.get('/edit/:id', authCheck, async(req: Request, res: Response) => {
    const {id} = req.params
    const issue = await Issue.findById(id)
    const usersFounded = await User.find()
    res.render('issues/edit', {issue, user: req.user, usersFounded})
    console.log(issue)
})

router.post('/edit/:id', authCheck, async(req: Request, res: Response) => {
    const {id} = req.params
    const {title, description, userAssignId} = req.body

    if(userAssignId != 'Escolha'){
       const userAssign =  await User.findById(userAssignId)
        await Issue.findByIdAndUpdate(id, {title, description, userAssign})
    }else{
        await Issue.findByIdAndUpdate(id, {title, description}) 
    }
    
    res.redirect('/issues/list')
})

export default router