const express = require('express')
const bcrypt = require('bcrypt')
const route = express.Router()
const User = require("../models/User")
const requireAuth = require("../middleware/auth")
const jwt = require("jsonwebtoken")



route.post('/register', async (req,res) => {
     try {
        const {name, email, password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({error:"server error missing requirements"})
        }
        if(password.length < 6){
            return res.status(400).json({error:"password must be not less than 6"})
        }
        
        const existing = await User.findOne({
            email: email.toLowerCase()
        })
        if(existing){
            return res.status(400).json({error:"email already exist"})
        }

        const hashed = await bcrypt.hash(password,10)
        const user = await User.create({
             name, email, password: hashed 
        })

        res.status(200).json({ id: user._id, name: user.name, email: user.email })
     } catch (error) {
        res.status(500).json({error:"server error"})
     }
})

route.post('/login',async (req,res) => {
    try {
        const {email,password} = req.body
        if(!password || !email){
            return res.status(400).json({error:"bad request"})
        }

        const user = await User.findOne({
            email: email.toLowerCase() 
        })

        if(!user){
            return res.status(401).json({error:"Invalid email or password"})
        }

        const match = await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(401).json({error:"Invalid email or password"})
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7days"})

        res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge: 7 * 24 * 60 * 60 * 1000})

        res.status(200).json({id:user._id,name:user.name,email:user.email})
    } catch (error) {
        res.status(500).json({error:"server error"})
    }
})

route.get('/me',requireAuth, async (req,res) => {
    try {
        const user = await User.findById(req.userid).select("-password")
         if(!user){
            return res.status(401).json({error:"not found"})
         }
         res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error:"server error"})
    }
})

route.post("/logout", async (req,res)=> {
    
        res.clearCookie("token")
        res.json({ message: "Logged out" }) 
})







module.exports = route