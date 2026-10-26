const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  name:    { type: String, required: true },
  price:   { type: Number, required: true, min: 0 },
  qty:     { type: Number, required: true, min: 1 }
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  items:  { type: [orderItemSchema], required: true },
  total:  { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "paid", "shipped"], default: "pending" }
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)