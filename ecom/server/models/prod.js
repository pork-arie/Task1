const mongoose = require("mongoose")

const prodSchema = new mongoose.Schema({
    name:{type:String,require:true},
     price: { type: Number, required: true, min: 0 },
     description: {type:String,required:true},
     image:{type:String},
     
}, { timestamps: true })

module.exports = mongoose.model("product",prodSchema)