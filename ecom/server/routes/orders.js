const express = require("express")
const mongoose = require("mongoose")
const route = express.Router()
const Order = require("../models/Order")
const Product = require("../models/prod")   
const requireAuth = require("../middleware/auth")
const requireAdmin = require("../middleware/admin")

route.post("/", requireAuth, async (req, res) => {
  try {
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" })
    }

    const orderItems = []
    let total = 0

    for (const item of items) {
      const qty = Number(item.qty)

      if (!mongoose.Types.ObjectId.isValid(item.productId) || !Number.isInteger(qty) || qty < 1) {
        return res.status(400).json({ error: "Invalid item in cart" })
      }

      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(404).json({ error: "A product in your cart no longer exists" })
      }
      if (product.stock < qty) {
        return res.status(400).json({ error: `Only ${product.stock} left of ${product.name}` })
      }

      orderItems.push({ product: product._id, name: product.name, price: product.price, qty })
      total += product.price * qty
    }

    const order = await Order.create({ user: req.userid, items: orderItems, total })

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } })
    }

    res.status(201).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})


route.get("/mine", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userid }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})


route.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})

// Update status (admin)
route.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid order ID" })
    }
    if (!["pending", "paid", "shipped"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    order.status = status
    await order.save()
    res.json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})

module.exports = route