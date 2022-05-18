const express = require("express");
const router = express.Router();
const shortid=require('shortid');
const path =require('path');

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Product = require("../models/Product");
const controller=require('../Controller/product');
const multer=require('multer');


const storage= multer.diskStorage({
 
  destination:function(req,file,cb){
  cb(null,"uploads")
  },
  filename:function(req,file,cb){
    let ext= path.extname(file.originalname)
  cb(null,shortid.generate()+'-'+file.originalname)
  }
}) 
const upload=multer({storage:storage})

//Add Product

router.post("/create", verifyTokenAndAdmin,upload.array('productPictures'),controller.AddProduct);
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

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
 
  try {
    const updateProdoct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProdoct);
  } catch (err) {
    res.status(500).json(err);
  }
});
//DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id",  async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", async (req, res) =>{
  const qNew=req.query.new;
  const qCategory= req.query.category; 
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;

