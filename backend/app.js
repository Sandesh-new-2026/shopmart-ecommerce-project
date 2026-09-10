const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    let isVercelOrigin = false;
    if (origin) {
      try {
        isVercelOrigin = /\.vercel\.app$/.test(new URL(origin).hostname);
      } catch {
        isVercelOrigin = false;
      }
    }

    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isVercelOrigin) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: false,
}));
app.use(express.json());

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const addressRoutes = require("./routes/addressRoutes");

let databaseConnection;
app.get("/health", (req, res) => {
  res.json({ success: true, service: "shopmart-api" });
});

app.use(async (req, res, next) => {
  try {
    if (!databaseConnection) databaseConnection = connectDB();
    await databaseConnection;
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/addresses", addressRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "E-commerce Backend Running" });
});

module.exports = app;
