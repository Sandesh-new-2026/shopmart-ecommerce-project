const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const mongoose = require("mongoose");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   REGISTER
========================= */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Current password and a new password of at least 6 characters are required." });
    }

    const user = await User.findById(req.user.userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Unable to update your password." });
  }
});


router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.put("/me", protect, async (req, res) => {
  try {
    const { name, firstName, lastName, mobile, gender, addresses } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (name?.trim()) user.name = name.trim();
    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (mobile !== undefined) user.mobile = mobile.trim();
    if (gender !== undefined) user.gender = gender;

    if (addresses !== undefined) {
      if (!Array.isArray(addresses) || addresses.length > 4) {
        return res.status(400).json({ success: false, message: "Save up to four delivery addresses." });
      }
      const normalizedAddresses = addresses.map((address) => ({
        ...(mongoose.Types.ObjectId.isValid(address._id) ? { _id: address._id } : {}),
        label: String(address.label || address.type || "").trim(),
        recipient: String(address.recipient || address.name || "").trim(),
        line1: String(address.line1 || address.address || "").trim(),
        city: String(address.city || "").trim(),
        state: String(address.state || "").trim(),
        postalCode: String(address.postalCode || address.pincode || "").trim(),
        phone: String(address.phone || address.mobile || "").trim(),
        isDefault: Boolean(address.isDefault),
      }));
      if (normalizedAddresses.some((address) => !address.label || !address.recipient || !address.line1 || !address.city || !address.state || !address.postalCode || !address.phone)) {
        return res.status(400).json({ success: false, message: "Complete every address field." });
      }
      user.addresses = normalizedAddresses;
      const defaultIndex = user.addresses.findIndex((address) => address.isDefault);
      user.addresses.forEach((address, index) => { address.isDefault = index === defaultIndex; });
    }

    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, firstName: user.firstName, lastName: user.lastName, mobile: user.mobile, gender: user.gender, addresses: user.addresses } });
  } catch (error) {
    console.error("Profile save error:", error);
    res.status(500).json({ success: false, message: error.message || "Unable to save your profile." });
  }
});

module.exports = router;
