const express = require("express");
const Address = require("../models/Address");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  let addresses = await Address.find({ userId: req.user.userId }).sort({ createdAt: 1 });
  if (addresses.length === 0) {
    const user = await User.findById(req.user.userId).select("addresses");
    if (user?.addresses?.length) {
      await Address.insertMany(user.addresses.map((address) => ({
        userId: req.user.userId,
        label: address.label,
        recipient: address.recipient,
        line1: address.line1,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        phone: address.phone,
        isDefault: address.isDefault,
      })));
      addresses = await Address.find({ userId: req.user.userId }).sort({ createdAt: 1 });
    }
  }
  res.json({ success: true, addresses });
});

router.post("/", protect, async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      userId: req.user.userId,
      isDefault: Boolean(req.body.isDefault),
    });
    if (address.isDefault) {
      await Address.updateMany({ userId: req.user.userId, _id: { $ne: address._id } }, { isDefault: false });
    }
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Unable to save address." });
  }
});

router.delete("/:id", protect, async (req, res) => {
  await Address.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.json({ success: true });
});

module.exports = router;
