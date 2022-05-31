const Product = require("../models/Product");
const slugify=require('slugify');


exports.homePage=async (req,res)=>{
    try {
        
        res.render('admin/admin')
    } catch (error) {
        
    }
}
exports.allProducts=async (req,res)=>{
    try {
     let products=await Product.find()
        res.render('admin/all-product',{products})
    } catch (error) {
        console.log(error);
    }
}
exports.editProduct=async (req,res)=>{
    try {
        res.render('admin/edit-product')
    } catch (error) {
        
    }
}
exports.addProduct=async (req,res)=>{
    try {
        
        res.render('admin/add-product')
    } catch (error) {
        
    }
}
exports.addProductPost=async (req,res)=>{
    try {
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
            slug:slugify(title),
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
        
        res.render('admin/add-product')
    } catch (error) {
        
    }
}