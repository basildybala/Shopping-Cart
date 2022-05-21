const router=require('express').Router()
const controller=require('../Controller/index')




router.get('/',controller.AllProduct)



module.exports=router;