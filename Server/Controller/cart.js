const Product = require("../models/Product");
const Cart = require("../models/Cart");

exports.AddItemToCArt=async (req,res)=>{
  


   
    try {
       let cart=await Cart.findOne({user:req.user.id})

       if(cart) {
        let product=req.body.cartItems.product;
        let isItemAdded=cart.cartItems.find(c=> c.product == product);
                if(isItemAdded){
                    let product=req.body.cartItems.product;
                //    let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product})
                    
                   
                   let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product},{
                    "$set":{
                        "cartItems.$":{
                             ... req.body.cartItems,
                             quantity:isItemAdded.quantity+req.body.cartItems.quantity
                        }
                    }
                    })
                    res.send(Cartt)                    
                   
                }else{
                    // let cart=await Cart.findOne({user:req.user.id})
                    // console.log(cart);
                     Cart.findOneAndUpdate({user:req.user.id},{
                        "$push":{
                            "cartItems":req.body.cartItems
                        }
                    }).then(ca=>{
                        res.send(ca)
                    }).catch(e=>{
                        console.log(e);
                    })
                    // res.send(CartU)  
                }
       }else{
        const newCart = new Cart({
            user:req.user.id,
            cartItems:[req.body.cartItems]
        });
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
       }
  
    } catch (err) {
      res.status(500).json(err);
    }
}

exports.showItemsCart=async(req,res)=>{
    try{
        
    }catch(err){

    }
}