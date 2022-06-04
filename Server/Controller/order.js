// const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
// const mongoose = require("mongoose");
const globalFunctions = require("./global");
const shortid = require("shortid");
const dotenv = require("dotenv");
dotenv.config();
const Razorpay = require("razorpay");
// const cryptoJs = require("crypto-js");
var instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_PUBLIC_KEY,
  key_secret: process.env.RAZOR_PAY_SECRET_KEY,
});

// let stripe =require('stripe')(process.env.STRIPE_PRIVATE_KEY)

// var instance = new Razorpay({
//     key_id: 'YOUR_KEY_ID',
//     key_secret: 'YOUR_KEY_SECRET',
// });

exports.pageRender = async (req, res) => {
  try {
    let userID = req.user.id;

    let userCart = await Cart.findOne({ user: userID });
    //PAGE RENDER WITHOUT CART
    if (userCart) {
      let products = await globalFunctions
        .getItemandTotal(userID)
        .then()
        .catch((e) => {
          console.log("Erro at User Cart Total Amount and Products code" + e);
        });

      let totalAmount = await globalFunctions
        .getTotalAmount(userID)
        .then()
        .catch((e) => {
          console.log("Erro at User Cart Total Amount code" + e);
        });
      total = totalAmount[0].total;

      res.render("user/order", { products, total });
    } else {
      //    let products=null
      let total = null;
      let products = await globalFunctions
        .getItemandTotal(userID)
        .then()
        .catch((e) => {
          console.log("Erro at User Cart Total Amount and Products code" + e);
        });
      res.render("user/order", { products, total });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.orderSumbit = async (req, res) => {
  try {
    let userID = req.user.id;

    let products = await globalFunctions
      .getItemandTotal(userID)
      .then()
      .catch((e) => {
        console.log("Erro at User Cart Total Amount and Products code" + e);
      });

    let totalAmount = await globalFunctions
      .getTotalAmount(userID)
      .then()
      .catch((e) => {
        console.log("Erro at User Cart Total Amount code" + e);
      });
    //USER ORDER SAVE MONGODB
    let userOrder = await new Order({
      userId: userID,
      orderShortId: shortid.generate(),
      products: products,
      totalAmount: totalAmount[0].total,
      address: req.body.address,
      name: req.body.name,
      mobileno: req.body.mobileno,
      payment: req.body.payment,
      pincode: req.body.pincode,
    });

    let orderID = await userOrder
      .save()
      .then((response) => {
        return userOrder.orderShortId;
      })
      .catch((err) => {
        console.log("Err In Order Time" + err);
      });
    //CHECK PAYMENT METHOD
    if (req.body.payment === "cod") {
      Cart.findOneAndRemove({ user: userID })
        .then()
        .catch((e) => {
          console.log("err cart remoove" + e);
        });

      res.json({ codStatus: true });
    } else if (req.body.payment === "razorpay") {
      var options = {
        amount: totalAmount[0].total * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: orderID,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          res.json({ razorpay: order });
        }
      });
    }
  } catch (error) {
    res.json({ status: false });
    console.log(error);
  }
};

//VERIFY RAZOR PAY
exports.verifyRazorPay = async (req, res) => {
  try {
    let details = req.body;
    console.log("Details", details);

    console.log("on", details.payment.razorpay_signature);
    let CryptoJS = require("crypto");
    let hmac = CryptoJS.createHmac("sha256", process.env.RAZOR_PAY_SECRET_KEY);
    hmac.update(
      details.payment.razorpay_order_id +
        "|" +
        details.payment.razorpay_payment_id
    );
    hmac = hmac.digest("hex");

    if (hmac === details.payment.razorpay_signature) {
      res.json({ razorpay: true });
      Order.findOneAndUpdate(
        { orderShortId: details.order.receipt },
        {
          $set: {
            status: "Deliverd",
          },
        }
      )
        .then((order) => {
          //USER CART REMOOVE AFTER ORDER SUCCESS
          Cart.findOneAndRemove({ user: order.userId })
            .then()
            .catch((e) => {
              console.log("err cart remoove" + e);
            });
        })
        .catch((e) => {
          console.log("Err IN Razor payement Update time set Placed", e);
        });
    } else {
      res.json({ razorpay: false });
      console.log("Err Payment");
    }
  } catch (error) {
    res.json({ razorpay: false });
    console.log(error);
  }
};

//USER ORDERS PAGE 
exports.myOrders = async (req, res) => {
  try {
    let userID = req.user.id;
    let ordersList = await Order.find({ userId: userID }).sort({ _id: -1 });
    console.log(ordersList[0].products);
    res.render("user/my-orders", { ordersList });
  } catch (error) {
    console.log(error);
  }
};

//AFTER THE ORDER SUCCESS JUST RENDER SUCCESS PAGE
exports.orderSuccess = async (req, res) => {
  try {
    res.render("user/order-success");
  } catch (error) {
    console.log(error);
  }
};

//USER CAN EDIT ORDER ADDRESS BEFORE THE DELIVER
exports.editOrderGet = async (req, res) => {
  try {
    let orderId = req.params.id;
    let order = await Order.findById(orderId);

    res.render("user/edit-order", { order });
  } catch (error) {
    console.log(error);
  }
};
exports.editOrderPost = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.id);
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log(updatedOrder);
    res.redirect("/api/order/my-orders");
  } catch (err) {
    res.status(500).json(err);
  }
};

//USER CAN DISPLAY ONE ORDER DETAILS WITH PRODUCTS DETAILS
exports.orderDetails = async (req, res) => {
  try {
    let orderId = req.params.id;

    let order = await Order.findById(orderId);
    console.log(order);
    res.status(200).render("user/order-details", { order });
  } catch (err) {
    console.log(error);
    res.status(500).render("page-not-found");
  }
};
