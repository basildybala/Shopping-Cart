const express = require("express");
const router = express.Router();
const controller=require('../Controller/categorycontroller');
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyToken,
  } = require("./verifyToken");

//Creat Category
router.post("/create",verifyTokenAndAdmin,controller.CreateCategory);

//All Category
router.get("/find",verifyTokenAndAdmin,controller.GetAllCategory);

// Delete CAtegory
router.post("/:id",verifyTokenAndAdmin,controller.DeleteCategory);

// router.get("/delete/:id", controller.UserLogin);

module.exports = router;