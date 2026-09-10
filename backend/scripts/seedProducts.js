require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  { name: "Portable Charger", category: "electronics", price: 1799, rating: 4.4, image: "https://images.unsplash.com/photo-1609592424824-9991d4b76b3b" },
  { name: "Mechanical Keyboard", category: "electronics", price: 3499, rating: 4.6, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3" },
  { name: "USB-C Hub", category: "electronics", price: 2199, rating: 4.2, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9" },
  { name: "Classic Denim Jacket", category: "fashion", price: 2799, rating: 4.5, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b" },
  { name: "Everyday Sunglasses", category: "fashion", price: 999, rating: 4.1, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083" },
  { name: "Leather Wallet", category: "fashion", price: 1299, rating: 4.3, image: "https://images.unsplash.com/photo-1627123424574-724758594e93" },
  { name: "Ceramic Vase", category: "home", price: 899, rating: 4.2, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c" },
  { name: "Soft Throw Pillow", category: "home", price: 699, rating: 4.4, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2" },
  { name: "Wall Clock", category: "home", price: 1599, rating: 4.0, image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c" },
  { name: "Insulated Water Bottle", category: "home", price: 749, rating: 4.5, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const names = products.map((product) => product.name);
  const existing = await Product.find({ name: { $in: names } }).select("name").lean();
  const existingNames = new Set(existing.map((product) => product.name));
  const added = await Product.insertMany(products.filter((product) => !existingNames.has(product.name)));
  console.log(`Added ${added.length} products.`);
  await mongoose.disconnect();
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
