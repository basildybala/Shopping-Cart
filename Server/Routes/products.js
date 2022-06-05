const express = require("express");
const router = express.Router();
const shortid=require('shortid');
const path =require('path');

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Product = require("../Models/Product");
const controller=require('../Controller/product');
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

// //Products Category

// router.post("/create", verifyTokenAndAdmin,upload.array('productPictures'),controller.AddProduct);

// router.post("/update/:id", verifyTokenAndAuthorization,upload.array('productPictures'),controller.UpdateProduct )

router.get("/find/:id",controller.GetOneProduct);


// router.post("delete/:id", verifyTokenAndAdmin,controller.DeleteProduct);

// router.get("/",controller.AllProduct);

// router.post("/create", verifyTokenAndAdmin,upload.single('productPictures'),(req,res)=>{
//   res.send('added')
// });
// router.post("/", verifyTokenAndAdmin, async (req, res) =>{
//     const newProduct=new Product(req.body);
//     try{
//       const savedProduct=await newProduct.save();
//       res.status(200).json(savedProduct)
//      }catch (err){
//       res.status(500).json(err);
//     }
// });

 

  // });
//UPDATE
// router.post("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
 
//   try {
//     const updateProdoct = await Product.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updateProdoct);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
//DELETE






//GET ALL USER




module.exports = router;

