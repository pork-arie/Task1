const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()
const path = require("path")
require("dotenv").config()



const prodRoute = require("./routes/product")
const authRoute = require("./routes/auth")



app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"..","public/")))

app.use("/api/product",prodRoute)
app.use("/api/auth",authRoute)

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("db is connected")).catch(() => console.log("error"))




app.get('/api/hello',(req,res) => {
    res.json({message:"hello backend"})
})

app.listen(3000,() => console.log("working in port 3000"))