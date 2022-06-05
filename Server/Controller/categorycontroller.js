const Category = require("../Models/Category");
const slugify=require('slugify');
const shortid=require('shortid');

// const CryptoJS = require("crypto-js");
// const jwt=require('jsonwebtoken');


exports.CreateCategory=async  (req,res)=>{

    try{
        const categoryObj = {
            name: req.body.name,
            slug: `${slugify(req.body.name)}-${shortid.generate()}`,
            createdBy: req.user.id,
          };
        
          if (req.body.parentId) {
            categoryObj.parentId = req.body.parentId;
          }
        
          const cat = new Category(categoryObj);
          cat.save().then((category)=>{
            res.status(200).json(category)
          }).catch(err=>{
              res.send({message:"Err Save Category Data"}     )
          })
    }catch{
        res.send({message:"Err Save Category Data"}     )
    }
    
    // const categoryObj = {
    //     name: req.body.name,
    //     slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    //     createdBy: req.user.id,
    //   };
    
    //   if (req.body.parentId) {
    //     categoryObj.parentId = req.body.parentId;
    //   }
    
    //   const cat = new Category(categoryObj);
    //   cat.save((error, category) => {
    //     if (error) return res.status(400).json({ error });
    //     if (category) {
    //       return res.status(201).json({ category });
    //     }
    //   });
}

exports.GetAllCategory=async (req,res)=>{
    try{
       Category.find().then(data=>{
        res.send(data)
       })
        
    }catch{
        res.send({message:"Err Gett all Data"}     )  
    }
}
exports.DeleteCategory=async (req,res)=>{
    try{
        let id=req.params.id
        Category.findByIdAndDelete(id).then(data=>{
         res.send(data)
        })
         
     }catch{
         res.send({message:"Err Gett all Data"}     )  
     }
}

// exports.UserLogin=async (req,res)=>{

// }