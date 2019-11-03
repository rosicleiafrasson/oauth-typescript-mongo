import { Router, Request, Response } from 'express'

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.render('index.hbs', {user: req.user})
})

export default router