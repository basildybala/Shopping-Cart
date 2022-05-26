const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const globalFunctions=require('./global');
const shortid=require('shortid');
const dotenv=require('dotenv');
dotenv.config()
const Razorpay = require('razorpay');
const cryptoJs = require("crypto-js");
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
       
       let userCart= await Cart.findOne({user:userID})

       if (userCart) {
        let products=await globalFunctions.getItemandTotal(userID).then().catch(e=>{console.log('Erro at User Cart Total Amount and Products code'+e);})

        let totalAmount=await globalFunctions.getTotalAmount(userID).then().catch(e=>{console.log('Erro at User Cart Total Amount code'+e);})
        total =totalAmount[0].total

        res.render('user/order',{products,total})
       }else{
        //    let products=null
           let total=null
           let products=await globalFunctions.getItemandTotal(userID).then().catch(e=>{console.log('Erro at User Cart Total Amount and Products code'+e);})
           res.render('user/order',{products,total})
       }
        
        
        // if (totalAmount===null) {
        //     total=null
        // } else {
        //     total =totalAmount[0].total
        // }
        
        
        
    }catch(err){
        console.log(err);
    }

     
}

exports.orderSumbit=async (req,res)=>{
    console.log(req.user.id);
    
    try {
        let userID=req.user.id
        // let userCart= await Cart.findOne({user:userID})

        
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
            // Cart.findOneAndRemove({user:userID}).then().catch(e=>{console.log('err cart remoove'+e);})
            // console.log('ORDER DETAILS'+ response.orderShortId);
            return userOrder.orderShortId
        }).catch(err=>{
            console.log('Err In Order Time'+err);
        })

        if(req.body.payment==='cod'){
            console.log('COdd');
            Cart.findOneAndRemove({user:userID}).then().catch(e=>{console.log('err cart remoove'+e);})
            
            res.json({codStatus:true})
        }else if (req.body.payment==='razorpay'){
            var options = {
                amount: totalAmount[0].total*100 ,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderID,
              };
              instance.orders.create(options, function(err, order) {
                if (err) {

                    console.log(err);
                } else {
                   
                    res.json({razorpay:order})
                }
                
              });
          

            
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
exports.verifyRazorPay=async (req,res)=>{

    try {
        
        let details=req.body
        console.log('Details',details);
       
        console.log('on',details.payment.razorpay_signature);
        let CryptoJS = require("crypto");
        let hmac= CryptoJS.createHmac('sha256',process.env.RAZOR_PAY_SECRET_KEY);
        hmac.update(details.payment.razorpay_order_id+'|'+details.payment.razorpay_payment_id,)
        hmac=hmac.digest('hex')
        
        if (hmac===details.payment.razorpay_signature) {
            res.json({razorpay:true})
            Order.findOneAndUpdate({orderShortId:details.order.receipt},
                {
                    $set:{
                        status:'Placed'
                    }
                }
                ).then((order)=>{
                    // console.log('USer ID',O.userId);
                    Cart.findOneAndRemove({user:order.userId}).then().catch(e=>{console.log('err cart remoove'+e);})
                }).catch(e=>{console.log('Err IN Razor payement Update time set Placed',e);})

            console.log('Success Payment');
        } else {
            res.json({razorpay:false})
            console.log('Err Payment');
        }

      



         
    } catch (error) {
    res.json({razorpay:false})
     console.log(error);
    }
}