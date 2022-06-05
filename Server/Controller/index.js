const Product = require("../Models/Product");
const Cart = require("../Models/Cart");
// const cartController = require('../Controller/cart')
const jwt = require('jsonwebtoken');
// const {
//     verifyToken,
//     verifyTokenAndAuthorization,
//     verifyTokenAndAdmin,
// } = require("../Routes/verifyToken");

exports.AllProduct = async (req, res) => {
      

    try {
        let token = req.cookies.token
        let count=null;

        if (token) {
            //IF USER LOGGED IN THEN DISPLAY CART COUNT
            let cartCount = null
            let token = req.cookies.token;
            jwt.verify(token, process.env.JWT_SEC, (err, user) => {
                if (err) res.status(403).json("Token is not valid!");
                req.user = user;
            });
            user = req.user.id
            let carts = await Cart.findOne({ "user": user }).then().catch(e => {
                console.log(e);
            })
            if (carts) {
                count = await carts.cartItems.length    
            }
                     
        }
        //PRODUCTS SEARCH AND SORT BY QUERY
        if(req.query.search){
            let search=req.query.search
            console.log(search);
            let AllProducts = await Product.find({title:{$regex:search,$options:"$i"}}).then().catch()
            // let AllProducts = await Product.find({title:{$regex:new RegExp('^'+search+'.*','i')}}).then().catch()
            console.log(AllProducts);

            res.status(200).render('index.ejs', { AllProducts,count, })
            return;
        }else if(req.query.sortby === "priceLow"){
            let AllProducts = await Product.find({}).sort({price: 1,})
            
            // res.json({products:AllProducts})
            res.status(200).render('index.ejs', { AllProducts,count, })
            return ;
        }else if(req.query.sortby === "priceHigh"){
            
            let AllProducts = await Product.find({}).sort({price: -1,})
            
            res.status(200).render('index.ejs', { AllProducts,count, })
            return ;
        }else if(req.query.category === "men"){
            let qCategory='men'
            let AllProducts = await Product.find({categories: {
                $in: 'Men',
              },})
            res.status(200).render('index.ejs', { AllProducts,count, })
            return ;
        }else if(req.query.category  === "women"){
            
            let AllProducts = await Product.find({categories: {
                $in: 'Women',
              },})
            
            res.status(200).render('index.ejs', { AllProducts,count, })
            return ;
        }

        
        let AllProducts = await Product.find().then().catch()
        res.status(200).render('index.ejs', { AllProducts,count, })


    } catch (err) {
        res.status(500).redirect('/err')
        console.log(err);
    }
}


