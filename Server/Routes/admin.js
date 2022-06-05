const router=require('express').Router()
const controller=require('../Controller/admin')
let shortid=require('shortid');
const path =require('path');
const multer=require('multer');
const {
    verifyToken,
    verifyTokenAndAdmin,
  } = require("./verifyToken");



const storage= multer.diskStorage({
 
  destination:function(req,file,cb){
   
  cb(null,"public/images/uploads/")
  },
  filename:function(req,file,cb){
    let ext= path.extname(file.originalname)
  cb(null,shortid.generate()+'-'+file.originalname)
  }
}) 
const upload=multer({storage:storage})


//Admin Home Page Route
router.get('/',verifyTokenAndAdmin,controller.homePage)

//Products Route
router.get('/all-products',verifyTokenAndAdmin,controller.allProducts)

//Add product
router.get('/add-product',verifyTokenAndAdmin,controller.addProduct)
router.post('/add-product',verifyTokenAndAdmin,upload.array('productPictures'),controller.addProductPost)

//Edit Product
router.get('/edit-product/:id',verifyTokenAndAdmin,controller.editProduct)
router.post('/edit-product/:id',verifyTokenAndAdmin,upload.array('productPictures'),controller.editProductPost)

//Delete Product
router.get('/delete-product/:id',verifyTokenAndAdmin,controller.deleteProduct)

//USERS ORDER STATUS CHANGE
router.post('/order-status',verifyTokenAndAdmin,controller.orderStatusChange)

//ORDER DETAILS
router.get('/order-details/:id',verifyTokenAndAdmin,controller.orderDetails)

//ORDER DELETE
router.get('/order-delete/:id',verifyTokenAndAdmin,controller.orderDelete)








module.exports=router;