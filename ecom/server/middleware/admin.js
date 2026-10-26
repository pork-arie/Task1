const User = require("../models/User")

async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userid)
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admins only" })
    }
    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
}

module.exports = requireAdmin