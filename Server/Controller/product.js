
const Product = require("../models/Product");


exports.AddProduct=async (req,res)=>{

    try{
        const{title,price,desc,category,qty,instock,categories,size,color}=req.body;
        if(req.files.length >0){
            let path = ''
            req.files.forEach(function(files,index,arr){
            path=path+files.path+','
            })
            path=path.substring(0,path.lastIndexOf(","))
            var productPictures=path.split(',')
        }
        const product= new Product({
            title,
            price,
            desc,
            category,
            qty,
            instock,
            productPictures,
            categories,
            color,
            size
        })

        product.save().then(r=>{
            res.send(r)
        })
        .catch(e=>{
            console.log(e);
        })
        
    }catch{
   console.log('Err');
    }

    



    res.status(200).json({file:req.file,body:req.body});


}
