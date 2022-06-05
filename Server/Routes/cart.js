const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");
const Product = require("../Models/Product");
const controller=require('../Controller/cart')

//CART COLLECTION

router.post("/add-to-cart/:id",controller.AddItemToCArt);

router.get("/count",controller.CartCount);

router.get("/", verifyToken,controller.getCart);

router.post("/change-product-quantity", verifyToken,controller.changeProductQuantity);

router.post("/delete-product", verifyToken,controller.deleteProduct);

  
  //UPDATE
  // router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //   try {
  //     const updatedCart = await Cart.findByIdAndUpdate(
  //       req.params.id,
  //       {
  //         $set: req.body,
  //       },
  //       { new: true }
  //     );
  //     res.status(200).json(updatedCart);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });
  
  // //DELETE
  // router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //   try {
  //     await Cart.findByIdAndDelete(req.params.id);
  //     res.status(200).json("Cart has been deleted...");
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });
  

// //GET USER CART
// router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
//     try {
//       const cart = await Cart.findOne({ userId: req.params.userId });
//       res.status(200).json(cart);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
  
  // //GET ALL
  



module.exports = router;


