const express = require("express");
const router = express.Router();
const controller=require('../Controller/authcontroller')

//REGISTER USER
router.post("/register",controller.UserRegistration);

//LOGIN USER

router.post("/login", controller.UserLogin);

module.exports = router;
