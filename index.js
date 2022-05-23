const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
var cookieParser = require('cookie-parser')
var session=require('express-session');
const connectDB=require('./Server/database/connection');
const userRoutes=require('./Server/Routes/user.js')
const orderRoutes=require('./Server/Routes/order')
const cartRoutes=require('./Server/Routes/cart')
const productRoutes=require('./Server/Routes/products')
const authRoutes=require('./Server/Routes/auth')
const categoryRoutes=require('./Server/Routes/category')
const indexRoute=require('./Server/Routes/index')


const app=express();
dotenv.config()

// mongodb connection
connectDB();

//Log Request
app.use(morgan('tiny'));

//
app.use(cookieParser())

//Sent Json Files In Client Body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// set view engine
app.set("view engine", "ejs")
//Public Folder Set Up
app.use('/public', express.static('public'))
app.use(session({secret:'Key',resave:true,saveUninitialized:true,cookie:{maxAge:6000000}},));
//Route SetUp
app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/category',categoryRoutes)
app.use('/',indexRoute)



app.listen(process.env.PORT,()=>console.log('Sever Running 5000'))












