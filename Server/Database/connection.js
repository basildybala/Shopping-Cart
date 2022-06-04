const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config()
const connectDB=async () =>{
 try{
   // mongodb connection string
   const con=await mongoose.connect(process.env.MONGO_URL,{
  //  const con=await mongoose.connect("mongodb://localhost:27017/ecommerceApi12",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
     console.log("Connected Mongodb");
   }catch(err){
       console.log(err);
   }
}

module.exports=connectDB