const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const jwt=require('jsonwebtoken');



exports.UserRegistration=async  (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        // email: req.body.email,
        password: CryptoJS.AES.encrypt(
          req.body.password,
          process.env.PASS_SEC
        ).toString(),
      });
      try {
        const savedUser = await newUser.save();
        res.redirect('/api/auth/login')
        // res.status(201).json(savedUser);
        console.log(savedUser);
      } catch (err) {
        console.log(err);
        
        
        res.status(500).json(err);
      }
}

exports.UserLogin=async (req,res)=>{
  try {
      const user = await User.findOne({ username: req.body.username });
      !user && res.status(401).json("Wrong credentials!");
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      originalPassword !== req.body.password && res.status(401).json("Wrong credentials!");
      //JWT ACCESS TOKEN
      const token=jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
            
          },
          process.env.JWT_SEC,
          {expiresIn:"3d"}
      );
      //Cookiees CreATe    
      res.cookie("token",token,{
        httpOnly:true,
        
        // secure:true,
        // maxAge:1000000,
        // signed:true,
       });


      // const{password, ...others}=user._doc; 
      res.status(200).redirect('/');
      // res.status(200).json({token});
    } catch (err) {
      res.status(500).json(err);
    }
}

// exports.UserLogin=async (req,res)=>{
//     try {
//         const user = await User.findOne({ username: req.body.username });
//         !user && res.status(401).json("Wrong credentials!");
//         const hashedPassword = CryptoJS.AES.decrypt(
//           user.password,
//           process.env.PASS_SEC
//         );
//         const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
//         originalPassword !== req.body.password && res.status(401).json("Wrong credentials!");
//         //JWT ACCESS TOKEN
//         const accessToken=jwt.sign(
//             {
//               id: user._id,
//               isAdmin: user.isAdmin,
//             },
//             process.env.JWT_SEC,
//             {expiresIn:"3d"}
//         );

//         const{password, ...others}=user._doc; 
//         res.status(200).redirect('/');
//         // res.status(200).json({...others, accessToken});
//       } catch (err) {
//         res.status(500).json(err);
//       }
// }






exports.UserLoginPage=async (req,res)=>{
  try{
    res.render('login')
  }catch(err){
    console.log(err);

  }
}
exports.UserRegistrationPage=async (req,res)=>{
  try{
    res.render('register')
  }catch(err){
    console.log(err);

  }
}
//USER LOGOUT
exports.UserLogout=(req,res)=>{
  res.cookie('token','',{maxAge:1})
  res.redirect('/')
}

exports.userExist=(req,res,next)=>{
  
  const token=req.cookies.token
  if (token) {
    
    jwt.verify(token, process.env.JWT_SEC,async (err, userr) =>{
      if (err) {
        console.log(err);
        res.locals.users=null
        next()
      } else {
        let user=await User.findById(userr.id)
        console.log(user);
        
        res.locals.users=user;
        // console.log(user);
        next()
      }
    });

  } else {
    console.log('NO User');
    res.locals.users=null;
    next()
  }
}