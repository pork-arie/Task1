const jwt = require("jsonwebtoken")

function requireAuth(req,res,next){

    const token = req.cookies.token

    if(!token){
       return res.status(401).json({error:"Not logged in"})
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userid = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({error:"invalid or expired token"})
    }

}

module.exports = requireAuth