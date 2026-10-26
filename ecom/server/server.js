const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()
const path = require("path")
require("dotenv").config()

const PORT = process.env.PORT || 3000

const prodRoute = require("./routes/product")
const authRoute = require("./routes/auth")
const orderRoute = require("./routes/orders")


app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"..","public/")))

app.get('/api/hello',(req,res) => {
    res.json({message:"hello backend"})
})

app.use("/api/product",prodRoute)
app.use("/api/auth",authRoute)
app.use("/api/orders", orderRoute)

// unknown api routes
app.use("/api", (req,res) => {
    res.status(404).json({error:"route not found"})
})

// catches bad json bodies and anything a route didn't handle
app.use((err,req,res,next) => {
    if(err.type === "entity.parse.failed"){
        return res.status(400).json({error:"invalid JSON body"})
    }
    console.error(err)
    res.status(500).json({error:"server error"})
})

if(!process.env.MONGODB_URI || !process.env.JWT_SECRET){
    console.error("MONGODB_URI and JWT_SECRET must be set in .env")
    process.exit(1)
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("db is connected")
        app.listen(PORT,() => console.log(`working in port ${PORT}`))
    })
    .catch((err) => {
        console.error("db connection error:", err.message)
        process.exit(1)
    })
