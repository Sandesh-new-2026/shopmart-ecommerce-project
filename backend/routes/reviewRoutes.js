const express = require("express");
const Review = require("../models/Review");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/user/me", protect, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({ success: false, message: "Unable to load your reviews." });
  }
});

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Unable to load reviews." });
  }
});

router.post("/:productId", protect, async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
      return res.status(400).json({ success: false, message: "Choose a rating and write a review." });
    }

    const user = await User.findById(req.user.userId).select("name firstName lastName");
    const userName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Shopmart customer";
    const review = await Review.findOneAndUpdate(
      { productId: req.params.productId, userId: req.user.userId },
      { productId: req.params.productId, userId: req.user.userId, userName, rating, comment },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error("Save review error:", error);
    res.status(500).json({ success: false, message: "Unable to save your review." });
  }
});

module.exports = router;
