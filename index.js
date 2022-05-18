const express=require('express');
const dotenv=require('dotenv');
const connectDB=require('./database/connection');
const userRoutes=require('./Routes/user.js')
const orderRoutes=require('./Routes/order')
const cartRoutes=require('./Routes/cart')
const productRoutes=require('./Routes/products')
const authRoutes=require('./Routes/auth')


const app=express();
dotenv.config()

// mongodb connection
connectDB();

//Sent Json Files In Client Body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Route SetUp
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/carts',cartRoutes)
app.use('/api/orders',orderRoutes)



app.listen(process.env.PORT,()=>console.log('Sever Running 5000'))












