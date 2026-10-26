const mongoose = require("mongoose")

const prodSchema = new mongoose.Schema({
    name:{type:String,required:true},
     price: { type: Number, required: true, min: 0 },
     description: {type:String,required:true},
     image:{type:String},
     stock:{type:Number,default:0,min:0},
     
}, { timestamps: true })

module.exports = mongoose.model("product",prodSchema)