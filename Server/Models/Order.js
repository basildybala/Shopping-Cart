const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, },
    orderShortId:{type:String},
    // products:[
    //     {
    //         productId:{type: String,},
    //         productName:{type:String},
    //         quantity:{type: Number,default: 1,}
    //     },
    // ],
    products:{type:Array},
    totalAmount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:'Pending'},
    name:{type:String},
    mobileno:{type:Number},
    payment:{type:String},
    pincode:{type:String}
   
  },
  { timestamps: true }
);

module.exports=mongoose.model('Order',OrderSchema)
