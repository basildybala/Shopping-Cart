const Product = require("../models/Product");
const Cart = require("../models/Cart");
const jwt = require('jsonwebtoken');
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

                             console.log('item already');
                            // let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product})
                             
                            
                            let Cartt=await Cart.findOneAndUpdate({"user":req.user.id,"cartItems.product":product},{
                             "$set":{
                                 "cartItems.$":{
                                    //   ... req.body.cartItems,
                                    //   quantity:isItemAdded.quantity+req.body.cartItems.quantity
                                    quantity:1
                                 }
                             }
                             })

                            //  res.send(Cartt)                    
                            
                         }else{
                             console.log('No Product');
                             let cart=await Cart.findOne({user:req.user.id})
                             console.log(cart);
                            let id=req.params.id
                              Cart.findOneAndUpdate({user:req.user.id},{
                                 "$push":{
                                     "cartItems":{
                                         "product":id,
                                         "quantity":1
                                     }
                                 }
                             }).then().catch(e=>{
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
        }
    }catch(err){
        console.log(err)
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

