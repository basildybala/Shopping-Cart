const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.AllProduct=async (req,res)=>{
    try{
        let AllProducts=await Product.find()
        res.status(200).render('index',{AllProducts})
    }catch(err){
        res.status(500).redirect('/err')
        console.log(err.message);
    }
}