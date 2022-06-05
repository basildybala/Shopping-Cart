
const Product = require("../Models/Product");
const slugify=require('slugify');

exports.GetOneProduct=async (req,res)=>{
    try {
        const product = await Product.findById(req.params.id);
        res.render('product',{product});
      } catch (err) {
        res.status(500).json(err);
      }
}
