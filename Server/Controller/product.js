
const Product = require("../models/Product");
const slugify=require('slugify');
// const { default: mongoose } = require("mongoose");


exports.AddProduct=async (req,res)=>{

    try{
        const{title,price,desc,category,qty,instock,categories,size,color}=req.body;
        if(req.files.length >0){
            let path = ''
            req.files.forEach(function(files,index,arr){
            path=path+files.path+','
            })
            path=path.substring(0,path.lastIndexOf(","))
            var productPictures=path.split(',')
        }
        const product= new Product({
            title,
            slug:slugify(title),
            price,
            desc,
            category,
            qty,
            instock,
            productPictures,
            categories,
            color,
            size
        })

        product.save().then(r=>{
            res.send(r)
        })
        .catch(e=>{
            console.log(e);
        })
    }catch{
      console.log('Err');
    }

}

exports.UpdateProduct=async (req,res)=>{
    try {
      const updateProdoct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateProdoct);
    }catch {
      res.status(500).json();
    }
}
exports.GetOneProduct=async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        res.render('product',{product});
      } catch (err) {
        res.status(500).json(err);
      }
}
exports.DeleteProduct=async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
}
exports.AllProduct=async (req,res)=>{
    const qNew=req.query.new;
    const qCategory= req.query.categories; 
  // const qCategory= req.query.color; 
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      console.log(qCategory);
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
}


// if(req.files){
//     let path = ''
//     req.files.forEach(function(files,index,arr){
//       path=path+files.path+','
//     })
//     path=path.substring(0,path.lastIndexOf(","))
//     var productPictures=path.split(',')
//     let body=req.body
//     let finalBody={...body,productPictures}

//     const updateProdoct = await Product.findByIdAndUpdate(
//         id,
//         {
//         $set: finalBody,
//         },
//         { new: true }
//     );
//     res.status(200).json(updateProdoct);
// }
