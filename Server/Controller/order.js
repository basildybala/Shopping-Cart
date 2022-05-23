const Product = require("../models/Product");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");





exports.pageRender=async (req,res)=>{
    
    try{
        let userID=req.user.id
       
       let products=await Cart.aggregate([

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
            {
                $project:{
                    total:{$sum:{$multiply:['$quantity','$product.price']}},
                    productName:'$product.title',
                    quantity:1,
                }
                // $group:{
                //     _id:null,
                //     total:{$sum:{$multiply:['$quantity','$product.price']}},
                // }
            }
            

        ])
        .then().catch((e)=>{console.log(e);})
       
        console.log(products);
        res.render('user/order',{products})
        
    }catch(err){
        console.log(err);
    }

     
}