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
        console.log(count);
        let AllProducts = await Product.find().then().catch()
        res.status(200).render('index', { AllProducts,count })



    } catch (err) {
        res.status(500).redirect('/err')
        console.log(err);
    }
}
