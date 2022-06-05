const Product = require("../Models/Product");
const Cart = require("../Models/Cart");
const jwt = require("jsonwebtoken");
const match = require("nodemon/lib/monitor/match");
const { default: mongoose } = require("mongoose");
const globalFunctions = require("./global");

exports.AddItemToCArt = async (req, res) => {
  try {
    let token = req.cookies.token;
    //1st CHECH TOKEN IS VALID OR NOT
    if (token) {
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
          res.redirect("/api/auth/login");
          // res.status(403).json("Token is not valid!");
          console.log(err);
        }
        req.user = user;
      });

      user = req.user.id;

      let cart = await Cart.findOne({ user: user });
      //IF TOKEN VALID THEN CHECK USER CART IS EXIST OR NOT
      if (cart) {
        let product = req.params.id;
        //   Check item Already Exist or Not
        let isItemAdded = await cart.cartItems.find(
          (c) => c.product == product
        );
        //IF CART IS EXIST THEN PRODUCT IS  OR NOT
        if (isItemAdded) {
          //IF PRODUCT IS EXIST THEN INCREASE PRODUCT COUNT
          let product = req.params.id;
          let Cartt = await Cart.findOneAndUpdate(
            { user: req.user.id, "cartItems.product": product },
            {
              $inc: { "cartItems.$.quantity": 1 },
            }
          );

          res.status(200).json({ quantity: true });
        } else {
          //NO PRODUCT THEN PUSH PRODUCT ID
          let cart = await Cart.findOne({ user: req.user.id });
          console.log(cart);
          let proid = req.params.id;
          Cart.findOneAndUpdate(
            { user: req.user.id },
            {
              $push: {
                cartItems: {
                  product: proid,
                  quantity: 1,
                },
              },
            }
          )
            .then()
            .catch((e) => {
              console.log(e);
            });
          res.status(200).json({ status: true });
          // res.send(CartU)
        }
      } else {
        //user No cart Then Create One Cart
        let proid = req.params.id;
        const newCart = new Cart({
          user: req.user.id,
          cartItems: {
            product: proid,
            quantity: 1,
          },
        });
        const savedCart = await newCart.save();
        res.status(200).json({ status: true });
      }
    } else {
      //TOKEN NOT VALID THEN SHOW LOGIN PAGE AJAX
      console.log("No cartss");

      res.status(200).json({ login: true });
    }
  } catch (err) {
    console.log(err);
    res.status(204).json({ login: true });
  }
};

exports.CartCount = async (req, res) => {
    //GET CART COUNT AND DISPLAY HOME 
  try {
    let count = 0;
    let userID = req.user.id;
    let carts = await Cart.findOne({ user: userID })
      .then()
      .catch((e) => {
        console.log(e);
      });
    if (carts) {
      count = carts.cartItems.length;
    }
    return count;
  } catch (err) {

  }
};
exports.getCart = async (req, res) => {
  try {
    let userID = req.user.id;
    let cart = await Cart.findOne({
      user: new mongoose.Types.ObjectId(userID),
    });

    
    if (cart) {
      //product lookup
      let userCart = await Cart.findOne({ user: userID });

      //CHECK IF CART PRODUCT IS EMPTY OR NOT
      if (userCart.cartItems.length == 0) {
        let MyCart = [];
        let totalAmount = 0;
        let itemAndTotal = 0;

        res.render("cart", { MyCart, totalAmount, itemAndTotal });
      } else {
          //NOT EMPTY THEN FIND PRODUCTS IN PRODUCT COLLECTION 
        let MyCart = await Cart.aggregate([
          { $match: { user: new mongoose.Types.ObjectId(userID) } },

          {
            $unwind: "$cartItems",
          },
          {
            $project: {
              item: "$cartItems.product",
              quantity: "$cartItems.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
          .then()
          .catch((e) => {
            console.log(e);
          });
        //FIND CART TOTAL AMOUNT SUM IN GLOBAL CONTROLLER  
        let total = await globalFunctions
          .getTotalAmount(userID)
          .then()
          .catch((e) => {
            console.log(e);
          });
        let totalAmount = total[0].total;
         //FIND CART ONE PRODUCT TOTAL AMOUNT SUM IN GLOBAL CONTROLLER  
        let itemAndTotal = await globalFunctions
          .getItemandTotal(userID)
          .then()
          .catch((e) => {
            console.log(e);
          });
        res.render("cart", { MyCart, totalAmount, itemAndTotal });
      }
      // console.log(userCart.cartItems);
    } else {
        //IF USER CART IS EMPTY THEN RENDER THE PAGE WITHOUT ERROR
      let MyCart = [];
      let totalAmount = null;
      let itemAndTotal = 0;
      res.render("cart", { MyCart, totalAmount, itemAndTotal });
    }
  } catch (err) {
    console.log(err);
  }
};


exports.changeProductQuantity = async (req, res) => {
  try {
    //collect data from ajax req

    let count = parseInt(req.body.count);
    let quantity = parseInt(req.body.quantity);
    let userId = req.user.id;
    let productId = req.body.product;
    let cartId = req.body.cart;

    //check product count and pro count is zero then delete Product
    if (count == -1 && quantity == 1) {
      let Cartt = await Cart.findOneAndUpdate(
        { _id: cartId },
        {
          $pull: { cartItems: { product: productId } },
        }
      );
      res.json({ removeProduct: true });
    } else {
      //othe times Increase or Decrese Product quantity
      let CArtt = await Cart.findOneAndUpdate(
        { user: userId, "cartItems.product": productId },
        {
          $inc: { "cartItems.$.quantity": count },
        }
      );
      let total = await globalFunctions
        .getTotalAmount(userId)
        .then()
        .catch((e) => {
          console.log(e);
        });

      totalAmount = total[0].total;

      res.json({ total: totalAmount });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    //Delete product Ajax rqst

    let proId = req.body.product;
    let cartId = req.body.cart;
    let userId = req.user.id;

    let cart = await Cart.findOneAndUpdate(
      { _id: cartId },
      {
        $pull: { cartItems: { product: proId } },
      }
    );
    res.json({ deleteProduct: true });
    console.log(proId, cartId, userId);
  } catch (error) {
    console.log(error);
  }
};
