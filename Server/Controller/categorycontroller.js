const Category = require("../models/Category");
const slugify=require('slugify');
const shortid=require('shortid');
// const CryptoJS = require("crypto-js");
// const jwt=require('jsonwebtoken');


exports.Create=async  (req,res)=>{
    
    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        createdBy: req.user.id,
      };
    
      if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
      }
    
      const cat = new Category(categoryObj);
      cat.save((error, category) => {
        if (error) return res.status(400).json({ error });
        if (category) {
          return res.status(201).json({ category });
        }
      });
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
    
//         res.status(200).json({...others, accessToken});
//       } catch (err) {
//         res.status(500).json(err);
//       }
// }
// exports.UserLogin=async (req,res)=>{

// }