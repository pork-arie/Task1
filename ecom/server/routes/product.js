const express = require("express")
const route = express.Router()
const prod = require("../models/prod")
const mongoose = require("mongoose")

route.get("/", async (req,res) => {
    try {
       const Product = await prod.find()
       res.json(Product)
    } catch (error) {
        res.status(500).json({error:"server error sa product"})
        
    }
})

route.post("/" , async (req,res) => {
    try {
      const {name,price,description} = req.body
      if(!name || price === undefined){
          return  res.status(400).json({error:"Name and price are required"})
        }

      const Product = await prod.create(req.body)
       res.status(201).json(Product)
    } catch (error) {
         res.status(500).json({error:"server error sa product post"})
        
    }
})

route.get("/:id", async(req,res) => {
     try {
        const {id} = req.params
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error:"Invalid product ID"})

        }
        const product = await prod.findById(id)
        if(!product){
            return res.status(404).json({error:"product not found"})
        }
       
        res.json(product)
     } catch (error) {
        res.status(500).json({error:"server error for product get:id"})
    
        
     }
})

module.exports = route