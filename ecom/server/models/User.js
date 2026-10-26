const mongoose = require("mongoose")

const User = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique: true, lowercase: true, trim: true},
    password:{type:String,required:true},
    role:{type:String,enum: ["customer", "admin"], default: "customer"}
},{timestamps:true})

module.exports = mongoose.model("Users",User)