const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const globalFunctions=require('./global');
const shortid=require('shortid');
const dotenv=require('dotenv');
dotenv.config()
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id:process.env.RAZOR_PAY_PUBLIC_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY,
  });

// var instance = new Razorpay({
//     key_id: 'YOUR_KEY_ID',
//     key_secret: 'YOUR_KEY_SECRET',
// });  
  




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
        
        if (totalAmount===null) {
            total=null
        } else {
            total =totalAmount[0].total
        }
        
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

       let orderID=await userOrder.save().then((response)=>{
            Cart.findOneAndRemove({user:userID}).then().catch(e=>{console.log('err cart remoove'+e);})
            // console.log('ORDER DETAILS'+ response.orderShortId);
            return userOrder.orderShortId
        }).catch(err=>{
            console.log('Err In Order Time'+err);
        })

        if(req.body.payment==='cod'){
            res.json({status:true})
        }else if (req.body.payment==='razorpay'){
            var options = {
                amount: totalAmount[0].total ,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderID
              };
              instance.orders.create(options, function(err, order) {
                if (err) {
                    console.log('ERR IN PAYMENT RAZORPAY',err);
                } else {
                    console.log(order);
                }
                console.log(order);
              });
          

            res.json({razorpay:true})
        }

        
        

    } catch (error) {
        res.json({status:false})
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
exports.orderSuccess=async (req,res)=>{
    try {
        // let userID=req.user.id
        // let ordersList= await Order.find({userId:userID})
        // console.log(ordersList);
        res.render('user/order-success',)    
    } catch (error) {
        console.log(error);
    }

    
}