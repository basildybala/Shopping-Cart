const router=require('express').Router()
const controller=require('../Controller/admin')

router.get('/',controller.homePage)








module.exports=router;