const Product = require("../models/Product");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const globalFunctions=require('./global')




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
                    price:'$product.price'
                }
                // $group:{
                //     _id:null,
                //     total:{$sum:{$multiply:['$quantity','$product.price']}},
                // }
            }
            

        ])
        .then().catch((e)=>{console.log(e);})
        // let productsTotal=await Cart.aggregate([

        //     {$match: {user:new mongoose.Types.ObjectId(userID)}},

        //     {
        //         $unwind: '$cartItems'
        //     },
        //     {
        //         $project: {
        //             item: '$cartItems.product',
        //             quantity: '$cartItems.quantity'
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: 'products',
        //             localField: 'item',
        //             foreignField: '_id',
        //             as: 'product'
        //         }
        //     },
        //     {
        //         $project: {
        //             item: 1,
        //             quantity: 1,
        //             product: { $arrayElemAt: ['$product', 0] }
        //         }
        //     },
        //     {
        //         // $project:{
        //         //     total:{$sum:{$multiply:['$quantity','$product.price']}},
        //         //     productName:'$product.title',
        //         //     quantity:1,
        //         //     price:'$product.price'
        //         // }
        //         $group:{
        //             _id:null,
        //             total:{$sum:{$multiply:['$quantity','$product.price']}},
        //         }
        //     },
        //     {
        //         $project: {
        //             total: 1,
                    
        //         }
        //     }

            

        // ])
        // .then().catch((e)=>{console.log(e);})
        // let total=productsTotal[0].total
        let totalAmount=await globalFunctions.getTotalAmount(userID).then().catch(e=>{console.log(e);})
    
        total =totalAmount[0].total
        console.log(total);
        res.render('user/order',{products,total})
        
    }catch(err){
        console.log(err);
    }

     
}