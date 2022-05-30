const Product = require("../models/Product");
const Cart = require("../models/Cart");
const cartController = require('../Controller/cart')
const jwt = require('jsonwebtoken');
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../Routes/verifyToken");

exports.AllProduct = async (req, res) => {
      

    try {
        let token = req.cookies.token
        let count=null;

        if (token) {
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
        
        if(req.query.search){
            let search=req.query.search
            let AllProducts = await Product.find({title:{$regex:new RegExp('^'+search+'.*','i')}}).then().catch()
            

            res.status(200).render('index', { AllProducts,count, })
            return;
        }else if(req.query.sortby === "priceLow"){
            let AllProducts = await Product.find({}).sort({price: 1,})
            
            // res.json({products:AllProducts})
            res.status(200).render('index', { AllProducts,count, })
            return ;
        }else if(req.query.sortby === "priceHigh"){
            
            let AllProducts = await Product.find({}).sort({price: -1,})
            
            res.status(200).render('index', { AllProducts,count, })
            return ;
        }else if(req.query.sortby === "men"){
            let qCategory='men'
            let AllProducts = await Product.find({categories: {
                $in: 'Men',
              },})
            res.status(200).render('index', { AllProducts,count, })
            return ;
        }else if(req.query.sortby === "women"){
            
            let AllProducts = await Product.find({categories: {
                $in: 'WoMen',
              },})
            
            res.status(200).render('index', { AllProducts,count, })
            return ;
        }
        // console.log(count);
        // let query=req.query.search
        // console.log(query);
        // let user=true
        
        let AllProducts = await Product.find().then().catch()
        res.status(200).render('index', { AllProducts,count, })


    } catch (err) {
        res.status(500).redirect('/err')
        console.log(err);
    }
}











// exports.AllProduct = async (req, res) => {
      

//     try {
//         let token = req.cookies.token
//         let count=null;

//         if (token) {
//             let cartCount = null
//             let token = req.cookies.token;
//             jwt.verify(token, process.env.JWT_SEC, (err, user) => {
//                 if (err) res.status(403).json("Token is not valid!");
//                 req.user = user;
//             });
//             user = req.user.id
//             let carts = await Cart.findOne({ "user": user }).then().catch(e => {
//                 console.log(e);
//             })
//             if (carts) {
//                 count = await carts.cartItems.length    
//             }
            
            
//         }
//         console.log(count);

//         // let user=true
//         let AllProducts = await Product.find().then().catch()
//         res.status(200).render('index', { AllProducts,count, })



//     } catch (err) {
//         res.status(500).redirect('/err')
//         console.log(err);
//     }
// }

