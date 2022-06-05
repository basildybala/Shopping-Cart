
const Order = require("../Models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const controller = require('../Controller/order')

const router = require("express").Router();




router.get("/",verifyToken, controller.pageRender);

//order details in Ajax Order Create
router.post("/",verifyToken, controller.orderSumbit);

//veyfy Payment
router.post('/verify-payment',controller.verifyRazorPay)

//Find User Order
router.get("/my-orders",verifyToken, controller.myOrders);

router.get("/order-success",verifyToken, controller.orderSuccess);

router.get("/edit-order/:id",verifyToken, controller.editOrderGet);
router.post("/edit-order/:id",verifyToken, controller.editOrderPost);

//ONE ORDER DETAILS
router.get("/order-details/:id",verifyToken, controller.orderDetails);






//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
 
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
