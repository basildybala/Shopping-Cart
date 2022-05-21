const express = require("express");
const router = express.Router();
const controller=require('../Controller/authcontroller')

//REGISTER USER
router.post("/register",controller.UserRegistration);
router.get("/register",controller.UserRegistrationPage);

//LOGIN USER

router.post("/login", controller.UserLogin);
router.get("/login", controller.UserLoginPage);

module.exports = router;
