const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    slug:{type:String},
    categories: { type: Array },
    category:{type:String},
    size: { type: Array  },
    color: { type: Array },
    price: { type: Number, required: true },
    listingprice: { type: Number, required: true },
    qty: { type: Number, required: true },
    instock:{type:Boolean,default:true},
    productPictures:{type:Array},
    discount:{type:Number}
    // productPictures: [ { img: { type: String } }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
 