const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId,ref:'User', required: true, },
    cartItems:[
        {product:{type:mongoose.Schema.Types.ObjectId,ref:'User',ref:'Product',},
          quantity:{type: Number,default: 1,},}
    ],
   
  },
  { timestamps: true }
);

module.exports=mongoose.model('Cart',CartSchema)
