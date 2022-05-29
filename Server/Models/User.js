// const mongoose = require('crypto-js');
const mongoossde = require('crypto-js');
const mongoose=require('mongoose')

// mongoossde(asd)




const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    
    password: { type: String, required: true,minlength:4 },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports=mongoose.model('User',UserSchema)
