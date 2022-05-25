const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const globalFunctions=require('./global');
const shortid=require('shortid');




exports.pageRender=async (req,res)=>{
    
    try{
        let userID=req.user.id
       
    //    let productss=await Cart.aggregate([

    //         {$match: {user:new mongoose.Types.ObjectId(userID)}},

    //         {
    //             $unwind: '$cartItems'
    //         },
    //         {
    //             $project: {
    //                 item: '$cartItems.product',
    //                 quantity: '$cartItems.quantity'
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: 'products',
    //                 localField: 'item',
    //                 foreignField: '_id',
    //                 as: 'product'
    //             }
    //         },
    //         {
    //             $project: {
    //                 item: 1,
    //                 quantity: 1,
    //                 product: { $arrayElemAt: ['$product', 0] }
    //             }
    //         },
    //         {
    //             $project:{
    //                 total:{$sum:{$multiply:['$quantity','$product.price']}},
    //                 productName:'$product.title',
    //                 quantity:1,
    //                 price:'$product.price',
    //                 proId:'$product._id'
    //             }
    //             // $group:{
    //             //     _id:null,
    //             //     total:{$sum:{$multiply:['$quantity','$product.price']}},
    //             // }
    //         }
            

    //     ])
    //     .then().catch((e)=>{console.log(e);})
        let products=await globalFunctions.getItemandTotal(userID).then().catch(e=>{console.log('Erro at User Cart Total Amount and Products code'+e);})

        let totalAmount=await globalFunctions.getTotalAmount(userID).then().catch(e=>{console.log('Erro at User Cart Total Amount code'+e);})
    
        total =totalAmount[0].total
        console.log(total);
        res.render('user/order',{products,total})
        
    }catch(err){
        console.log(err);
    }

     
}

exports.orderSumbit=async (req,res)=>{
    console.log(req.user.id);
    
    try {
        let userID=req.user.id
        let products=await globalFunctions.getItemandTotal(userID).then().catch(e=>{console.log('Erro at User Cart Total Amount and Products code'+e);})

        let totalAmount=await globalFunctions.getTotalAmount(userID).then().catch(e=>{console.log('Erro at User Cart Total Amount code'+e);})
       
        let userOrder=await new Order ({
            userId :userID,
            orderShortId:shortid.generate(),
            products:products,
            totalAmount:totalAmount[0].total,
            address:req.body.address,
            name:req.body.name,
            mobileno:req.body.mobileno,
            payment:req.body.payment,
            pincode:req.body.pincode,
        })

        userOrder.save().then((response)=>{
            Cart.findOneAndRemove({user:userID}).then().catch(e=>{console.log('err cart remoove'+e);})
        }).catch(err=>{
            console.log('Err In Order Time'+err);
        })
        res.json({status:true})
        console.log(userOrder);

    } catch (error) {
        console.log(error);
    }
    
}

exports.myOrders=async (req,res)=>{
    try {
        let userID=req.user.id
        let ordersList= await Order.find({userId:userID})
        console.log(ordersList);
        res.render('user/my-orders',{ordersList})    
    } catch (error) {
        console.log(error);
    }

    
}