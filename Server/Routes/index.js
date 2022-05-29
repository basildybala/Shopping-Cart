const router=require('express').Router()
const controller=require('../Controller/index')
const jwt=require('jsonwebtoken');
const {userExist} = require("./verifyToken");




router.get('/',controller.AllProduct)
// router.get('/coo',(req,res)=>{
//     res.cookie('nuPlayer',false)
//     res.send('cook')
// })
// router.get('/', async (req,res)=>{
//     let cartCount=null
//     let token=req.cookies.token
//     if (token) {
//         jwt.verify(token, process.env.JWT_SEC, (err, user) =>{
//             if (err) res.status(403).json("Token is not valid!");
//             req.user=user;
//           });
//          user=req.user.id
//          console.log(user);
//         cartCount=await controller.AllProduct(token)
//     }


//     res.render('index',{cartCount})
// })



module.exports=router;