const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const connectDB=require('./Server/database/connection');
const userRoutes=require('./Server/Routes/user.js')
const orderRoutes=require('./Server/Routes/order')
const cartRoutes=require('./Server/Routes/cart')
const productRoutes=require('./Server/Routes/products')
const authRoutes=require('./Server/Routes/auth')
const categoryRoutes=require('./Server/Routes/category')


const app=express();
dotenv.config()

// mongodb connection
connectDB();

//Log Request
app.use(morgan('tiny'));

//Sent Json Files In Client Body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Route SetUp
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/carts',cartRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/category',categoryRoutes)



app.listen(process.env.PORT,()=>console.log('Sever Running 5000'))












