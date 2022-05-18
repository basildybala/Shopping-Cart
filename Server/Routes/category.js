const express = require("express");
const router = express.Router();
const controller=require('../Controller/categorycontroller');
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyToken,
  } = require("./verifyToken");

//Creat Category
router.post("/create",verifyTokenAndAdmin,controller.Create);

// //REGISTER USER
// router.post("/find",controller.UserRegistration);

// //LOGIN USER

// router.get("/delete/:id", controller.UserLogin);

module.exports = router;