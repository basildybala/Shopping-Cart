const Product = require("../models/Product");
const Cart = require("../models/Cart");
const jwt = require('jsonwebtoken');
const match = require("nodemon/lib/monitor/match");
const { default: mongoose } = require("mongoose");
const globalFunctions=require('./global')





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
                 console.log('cart ready' );
                    //   Check item Already Exist or Not
                       let isItemAdded=await cart.cartItems.find(c=> c.product == product);
                       
                         if(isItemAdded){
                             let product=req.params.id;
                            let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product},{
                                
                                    $inc: { 'cartItems.$.quantity': 1 }
                                
                            })

                            res.status(200).json({quantity:true});                                          
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
                    console.log('No cart' );
                //user No cart Then Create One Cart    
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
            console.log('No cart' );
            res.status(204).json({status:false});
        }
    }catch(err){
        console.log(err)
        res.status(204).json({status:false});
    }
    
  
  
 }

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
    //product lookup 
        let userID=req.user.id
       
        

 
       
            
    
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

        let userCart= await Cart.findOne({user:userID})
        
        if(userCart.cartItems.length==0){
            totalAmount=0
        }else{
            let total=await globalFunctions.getTotalAmount(userID).then().catch(e=>{console.log(e);}) 
            totalAmount =total[0].total
            console.log('pap');
        }
        // console.log(userCart.cartItems);

        
        

        // let itemAndTotal=await globalFunctions.getItemandTotal(userID).then().catch(e=>{console.log(e);})
        res.render('cart',{MyCart,totalAmount,})
        
              
    }catch(err){
        console.log(err);
    }
}


// exports.getCart=async (req,res)=>{
//     try{
//     //product lookup 
//         let userID=req.user.id
       
//         let userCart= await Cart.findOne({user:userID})

 
//         if (userCart && userCart.cartItems.length >0 ) {
            
    
//           let MyCart=await Cart.aggregate([

//             {$match: {user:new mongoose.Types.ObjectId(userID)}},

//             {
//                 $unwind: '$cartItems'
//             },
//             {
//                 $project: {
//                     item: '$cartItems.product',
//                     quantity: '$cartItems.quantity'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'products',
//                     localField: 'item',
//                     foreignField: '_id',
//                     as: 'product'
//                 }
//             },
//             {
//                 $project: {
//                     item: 1,
//                     quantity: 1,
//                     product: { $arrayElemAt: ['$product', 0] }
//                 }
//             },

//         ])
//         .then().catch((e)=>{console.log(e);})

//         let total=await globalFunctions.getTotalAmount(userID).then().catch(e=>{console.log(e);}) 
//         totalAmount =total[0].total

//         // let itemAndTotal=await globalFunctions.getItemandTotal(userID).then().catch(e=>{console.log(e);})
//         res.render('cart',{MyCart,totalAmount,})
//         }else{
            
//             res.status(205).render('user/no-cart-items')
//         }
              
//     }catch(err){
//         console.log(err);
//     }
// }

exports.changeProductQuantity=async (req,res)=>{
    try{
        //collect data from ajax req

        let count =parseInt(req.body.count);
        let quantity =parseInt(req.body.quantity)
        let userId=req.user.id
        let productId=req.body.product
        let cartId=req.body.cart

        //check product count and pro count is zero then delete Product
        if (count==-1 && quantity==1) {
            let Cartt=await Cart.findOneAndUpdate({"_id":cartId},{                              
                $pull: { cartItems:{product:productId} }
            })
            res.json({removeProduct:true})
           
            
        }else{
            //othe times Increase or Decrese Product quantity
            let CArtt=await Cart.findOneAndUpdate({"user":userId,"cartItems.product":productId},{                              
                $inc: { 'cartItems.$.quantity': count }
            })
            let total=await globalFunctions.getTotalAmount(userId).then().catch(e=>{console.log(e);})
    
                 totalAmount =total[0].total

                 res.json({total:totalAmount})

        }

    }catch (err){
        console.log(err);
    }
}


exports.deleteProduct=async(req,res)=>{
    try {
        //Delete product Ajax rqst

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