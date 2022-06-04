const Product = require("../models/Product");
const Cart = require("../models/Cart");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const res = require("express/lib/response");

module.exports = {
  getTotalAmount: (userID) => {
    return new Promise(async (resolve, reject) => {
      let userCart = await Cart.findOne({ user: userID });

      if (userCart) {
        let productsTotal = await Cart.aggregate([
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
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
            },
          },
          {
            $project: {
              total: 1,
            },
          },
        ])
          .then()
          .catch((e) => {
            console.log(e);
          });
        resolve(productsTotal);
      } else {
        // reject()
        resolve(null);
        console.log("Nocart");

        res.json({ status: false });
      }
    });
  },

  getItemandTotal: (userID) => {
    return new Promise(async (resolve, reject) => {
      let productsAndToatal = await Cart.aggregate([
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
        {
          $project: {
            total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
            productName: "$product.title",
            quantity: 1,
            price: "$product.price",
            proId: "$product._id",
            proPic: "$product.productPictures",
          },
        },
      ])
        .then()
        .catch((e) => {
          console.log(e);
        });

      resolve(productsAndToatal);
    });
  },
};
