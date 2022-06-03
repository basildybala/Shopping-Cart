const jwt=require("jsonwebtoken");
const User = require("../models/User");

const verifyToken=(req, res, next) =>{
  console.log('Verify Token area');
  const token=req.cookies.token
  
  if (token){
    // const token=authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) =>{
      if (err) res.status(403).json("Token is not valid!");
      req.user=user;
      // req.session.user=true
      next();
    });
   }else{
    return res.redirect('/api/auth/login');
  }
};

const userExist=(req,res,next)=>{
  
  const token=req.cookies.token
  if (token) {
    jwt.verify(token, process.env.JWT_SEC,async (err, userr) =>{
      if (err) {
        console.log(err);
        res.locals.useR=null
        next()
      } else {
        let user=await User.findById(userr.id)
        res.locals.useR=user;
       
        next()
      }
    });

  } else {
    
    res.locals.useR=null;
    next()
  }
}


// const verifyToken=(req, res, next) =>{
//   const authHeader=req.headers.authorization;
  
//   if (authHeader){
//     const token=authHeader.split(" ")[1];

//     jwt.verify(token, process.env.JWT_SEC, (err, user) =>{
//       if (err) res.status(403).json("Token is not valid!");
     
//       req.user=user;
//       next();
//     });
//    }else{
//     return res.status(401).json("You are not authenticated!");
//   }
// };


const verifyTokenAndAuthorization=(req, res, next) =>{
  
    verifyToken(req, res, () =>{
      if (req.user.id=== req.params.id || req.user.isAdmin){
        
        
        next();
       }else{
        res.redirect('/api/auth/login');
      }
    });
};
//Verify Token and Admin 
const verifyTokenAndAdmin =(req, res, next) =>{
  
  verifyToken(req, res, () =>{
    if (req.user.isAdmin){
      next();
     }else{
      res.redirect('/api/auth/login');
    }
  });
};
                           

module.exports={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin,userExist }; 
