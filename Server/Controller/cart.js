const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.AddItemToCArt=async (req,res)=>{
  


   
    try {
       let cart=await Cart.findOne({user:req.user.id})

       if(cart){
        res.status(200).json({message:cart});
       }else{
        const newCart = new Cart({
            user:req.user.id,
            cartItems:req.body.cartItems
        });
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
       }
  
    } catch (err) {
      res.status(500).json(err);
    }
}