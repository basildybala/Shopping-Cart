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
const {userExist} = require("./Server/Routes/verifyToken");


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

app.use(session({
    secret:'secret',
    cookie:{maxAge:60000},
    resave:true,
    saveUninitialized:true  
}))

// set view engine
app.set("view engine", "ejs")
//Public Folder Set Up
app.use('/public', express.static('public'))
app.use(session({secret:'Key',resave:true,saveUninitialized:true,cookie:{maxAge:6000000}},));
//Route SetUp
app.use('/api/users',userExist,userRoutes)
app.use('/api/auth',userExist,authRoutes)
app.use('/api/products',userExist,productRoutes)
app.use('/api/cart',userExist,cartRoutes)
app.use('/api/order',userExist,orderRoutes)
app.use('/api/category',userExist,categoryRoutes)
app.use('/',userExist,indexRoute)

app.get('*',(req,res,next)=>{
    
    res.render('page-not-found')
})

// app.get('*',userExist)



app.listen(process.env.PORT,()=>console.log('Sever Running 5000'))












