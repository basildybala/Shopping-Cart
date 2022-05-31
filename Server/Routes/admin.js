const router=require('express').Router()
const controller=require('../Controller/admin')

// const multer=require('multer');


// const storage= multer.diskStorage({
 
//   destination:function(req,file,cb){
//   cb(null,"public/images/uploads/")
//   },
//   filename:function(req,file,cb){
//     let ext= path.extname(file.originalname)
//   cb(null,shortid.generate()+'-'+file.originalname)
//   }
// }) 
// const upload=multer({storage:storage})
// router.post("/create", verifyTokenAndAdmin,upload.array('productPictures'),controller.AddProduct);

//Admin Home Page Route
router.get('/',controller.homePage)

//Products Route
router.get('/all-products',controller.allProducts)
router.get('/add-product',controller.addProduct)
router.post('/add-product',controller.addProductPost)
router.get('/edit-product/:id',controller.editProduct)
router.post('/edit-product/:id',controller.editProduct)
router.post('/delete-product',controller.homePage)








module.exports=router;