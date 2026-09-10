const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    mobile: { type: String, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    addresses: [
      {
        label: { type: String, required: true, trim: true },
        recipient: { type: String, required: true, trim: true },
        line1: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
