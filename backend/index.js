
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt =require("jsonwebtoken");
const multer =require("multer");
const path =require("path");
const cors =require("cors");
const { error } = require("console");
const { type } = require("os");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://nooriya2408:nooriya2408@ecommerce.ymzwoi0.mongodb.net/Ecommerce")
//mongodb+srv://nooriya2408:nooriya2408@ecommerce.ymzwoi0.mongodb.net/?retryWrites=true&w=majority&appName=Ecommerce


app.get('/',(req,res)=>{
res.send("Express API is running....")
})

app.listen(port,(error)=>{
    if(!error){
        console.log("server is running on port"+port)
    }else{
        console.log("Error:"+error)
    }
})
//Image storage engine
const storage = multer.diskStorage({
    destination:"./upload/images",
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating upload endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})
//creating endpoint for newcollection data
app.get("/newcollection",async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("newcollection fetched");
    res.send(newcollection);
})
//creating endpoint for popular in women

app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_in_women)
})

//creating middleware to fetch user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"please authenticate using validate"})
        }
        else{
            try {
                const data = jwt.verify(token,'secret_ecom');
                req.user= data.user;
                next();
            } catch (error) {
                res.status(401).send({errors:"please authenticate using validate a token"})
            }
        }
    
}

//creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async(req,res)=>{
     console.log("added",req.body.itemId) 
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=  1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("added")
}) 
//creating endpoint for remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log(req.body,req.user) 
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=  1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.send("removed")
})  
//creating endpoint to get cartdata
app.post("/getcart",fetchUser,async(req,res)=>{
    console.log("Getcart");
    let userdata = await Users.findOne({_id:req.user.id});
    res.json(userdata.cartData);
})

//creating endpoint for registering the user
app.post("/signup",async (req,res)=>{
    let check = await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false,errors:"existing user found"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
       cart[i] = 0;
        
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();
    const data = {
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,"secret_ecom");
    res.json({success:true,token})
})
//creating endpoint for login user
app.post("/login",async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
       const passcompare = req.body.password === user.password;
       if(passcompare){
        const data={
            user :{
                id:user.id
            }
        }
        const token = jwt.sign(data,"secret_ecom");
        res.json({success:true,token})
       } 
       else{
        res.json({success:false,errors:"wrong credentials"})
       }
    }
    else{
        res.json({success:false,errors:"wrong email id"})
    }
})

//Schema for creating products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
         type:Boolean,
         default:true,
    },
}) 
app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    })
    console.log(product)
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

app.post('/removeproduct',async(req,res)=>{
await Product.findOneAndDelete({id:req.body.id});
console.log("Removed")
res.json({success:true,name:req.body.name})
})


app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All products Fetched")
    res.send(products)
})
//schema for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})