const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Unable to load your orders." });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }
    if (!["card", "upi", "cod"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Choose a valid payment method." });
    }
    if (!deliveryAddress?.recipient || !deliveryAddress?.line1 || !deliveryAddress?.city || !deliveryAddress?.state || !deliveryAddress?.postalCode || !deliveryAddress?.phone) {
      return res.status(400).json({ success: false, message: "Choose a complete delivery address." });
    }

    const orderItems = [];
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: "Invalid cart item." });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "A product in your cart is unavailable." });
      }

      orderItems.push({ productId: product._id, name: product.name, price: product.price, quantity });
    }

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const order = await Order.create({
      userId: req.user.userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      deliveryAddress,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Unable to place your order." });
  }
});

module.exports = router;
