const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
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
