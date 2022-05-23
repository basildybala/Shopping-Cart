const Product = require("../models/Product");
const Cart = require("../models/Cart");
const jwt = require('jsonwebtoken');
const match = require("nodemon/lib/monitor/match");
const { default: mongoose } = require("mongoose");
exports.AddItemToCArt=async (req,res)=>{

    try{
        
        
            
        let token=req.cookies.token
        
        if (token) {
            
            
            jwt.verify(token, process.env.JWT_SEC, (err, user) => {
                if (err) {res.status(403).json("Token is not valid!");
            console.log(err);}
                req.user = user;
            });
            
             user = req.user.id
            
            let cart=await Cart.findOne({user:user})
            

                if(cart) {
                   
                 let product=req.params.id;
                    //    let isItemAdded=await cart.cartItems.find(c=> c.product == product);
                       let isItemAdded=await cart.cartItems.find(c=> c.product == product);
                       
                         if(isItemAdded){
                             let product=req.params.id;
                            let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product},{
                                
                                    $inc: { 'cartItems.$.quantity': 1 }
                                
                            })

                            res.status(200).json({quantity:true});                        
                            //  res.send(Cartt)                    
                            
                         }else{
                             console.log('No Product');
                             let cart=await Cart.findOne({user:req.user.id})
                             console.log(cart);
                            let proid=req.params.id
                              Cart.findOneAndUpdate({user:req.user.id},{
                                 "$push":{
                                     "cartItems":{
                                         "product":proid,
                                         "quantity":1
                                     }
                                 }
                             }).then().catch(e=>{
                                 console.log(e);
                             })
                             res.status(200).json({status:true});
                             // res.send(CartU)  
                         }
                }else{
                   let proid= req.params.id
                 const newCart = new Cart({
                     user:req.user.id,
                     cartItems:{
                        "product":proid,
                        "quantity":1
                       }
                 });
                 const savedCart = await newCart.save();
                 res.status(200).json({status:true});
                }
        }else{
            res.status(200).json({status:false});
        }
    }catch(err){
        console.log(err)
        res.status(200).json({status:false});
    }
    
  
  
    // try {
    //    
   
    //  } catch (err) {
    //    res.status(500).json(err);
    //  }
 }



   
//     try {
//        let cart=await Cart.findOne({user:req.user.id})

//        if(cart) {
//         let product=req.body.cartItems.product;
//         let isItemAdded=cart.cartItems.find(c=> c.product == product);
//                 if(isItemAdded){
//                     let product=req.body.cartItems.product;
//                 //    let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product})
                    
                   
//                    let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product},{
//                     "$set":{
//                         "cartItems.$":{
//                              ... req.body.cartItems,
//                              quantity:isItemAdded.quantity+req.body.cartItems.quantity
//                         }
//                     }
//                     })
//                     res.send(Cartt)                    
                   
//                 }else{
//                     // let cart=await Cart.findOne({user:req.user.id})
//                     // console.log(cart);
//                      Cart.findOneAndUpdate({user:req.user.id},{
//                         "$push":{
//                             "cartItems":req.body.cartItems
//                         }
//                     }).then(ca=>{
//                         res.send(ca)
//                     }).catch(e=>{
//                         console.log(e);
//                     })
//                     // res.send(CartU)  
//                 }
//        }else{
//         const newCart = new Cart({
//             user:req.user.id,
//             cartItems:[req.body.cartItems]
//         });
//         const savedCart = await newCart.save();
//         res.status(200).json(savedCart);
//        }
  
//     } catch (err) {
//       res.status(500).json(err);
//     }
// }

exports.CartCount=async(req,res)=>{

    try{
        let count=0;
        let userID=req.user.id

        console.log(userID);
        // let userID="6284a7bcc179b3f2a4d814cd"
       
        let carts=await Cart.findOne({"user":userID}).then().catch(e=>{
            console.log(e);
        })
        if(carts){
          count=carts.cartItems.length
        }
        return count;
        
    }catch(err){

    }
}


exports.getCart=async (req,res)=>{
    try{
        let userID=req.user.id
        console.log(userID);
       let MyCart=await Cart.aggregate([

            {$match: {user:new mongoose.Types.ObjectId(userID)}},

            {
                $unwind: '$cartItems'
            },
            {
                $project: {
                    item: '$cartItems.product',
                    quantity: '$cartItems.quantity'
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    product: { $arrayElemAt: ['$product', 0] }
                }
            },

        ])
        .then().catch((e)=>{console.log(e);})
       
        
        res.render('cart',{MyCart})
        
    }catch(err){
        console.log(err);
    }
}

exports.changeProductQuantity=async (req,res)=>{
    try{
        let count =parseInt(req.body.count);
        let quantity =parseInt(req.body.quantity)
        let userId=req.user.id
        let productId=req.body.product
        let cartId=req.body.cart
        if (count==-1 && quantity==1) {
            let Cartt=await Cart.findOneAndUpdate({"_id":cartId},{                              
                $pull: { cartItems:{product:productId} }
            })
            res.json({removeProduct:true})
           
            
        }
        let Cartt=await Cart.findOneAndUpdate({"user":userId,"cartItems.product":productId},{                              
            $inc: { 'cartItems.$.quantity': count }
        })
        console.log(Cartt);
        
        res.json({status:true})
        console.log(count,quantity,cartId);
    }catch (err){
        console.log(err);
    }
}
exports.deleteProduct=async(req,res)=>{
    try {
        let proId =req.body.product
        let cartId =req.body.cart
        let userId =req.user.id

        let cart = await Cart.findOneAndUpdate({'_id':cartId},
        {
            $pull: { cartItems:{product:proId} }
        }
        )
        res.json({deleteProduct:true})
        console.log(proId,cartId,userId);
        
    } catch (error) {
        console.log(error);
    }
}