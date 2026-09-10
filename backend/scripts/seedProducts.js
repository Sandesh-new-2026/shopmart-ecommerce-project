require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  { name: "Portable Charger", category: "electronics", price: 1799, rating: 4.4, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761" },
  { name: "Mechanical Keyboard", category: "electronics", price: 3499, rating: 4.6, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3" },
  { name: "USB-C Hub", category: "electronics", price: 2199, rating: 4.2, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9" },
  { name: "Wireless Headphones", category: "electronics", price: 4999, rating: 4.7, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
  { name: "Smart Watch", category: "electronics", price: 6999, rating: 4.5, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
  { name: "Bluetooth Speaker", category: "electronics", price: 2499, rating: 4.3, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1" },
  { name: "Desk Lamp", category: "electronics", price: 1299, rating: 4.1, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c" },
  { name: "Webcam", category: "electronics", price: 2999, rating: 4.2, image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04" },
  { name: "Gaming Mouse", category: "electronics", price: 1899, rating: 4.4, image: "https://images.unsplash.com/photo-1527814050087-3793815479db" },
  { name: "Laptop Stand", category: "electronics", price: 1599, rating: 4.5, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf" },
  { name: "Classic Denim Jacket", category: "fashion", price: 2799, rating: 4.5, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b" },
  { name: "Everyday Sunglasses", category: "fashion", price: 999, rating: 4.1, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083" },
  { name: "Leather Wallet", category: "fashion", price: 1299, rating: 4.3, image: "https://images.unsplash.com/photo-1627123424574-724758594e93" },
  { name: "Canvas Sneakers", category: "fashion", price: 2199, rating: 4.4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { name: "Cotton Hoodie", category: "fashion", price: 1899, rating: 4.6, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7" },
  { name: "Running Shoes", category: "fashion", price: 3299, rating: 4.5, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { name: "Classic Wristwatch", category: "fashion", price: 4599, rating: 4.2, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d" },
  { name: "Travel Backpack", category: "fashion", price: 2799, rating: 4.4, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" },
  { name: "Linen Shirt", category: "fashion", price: 1499, rating: 4.0, image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754" },
  { name: "Baseball Cap", category: "fashion", price: 599, rating: 4.1, image: "https://images.unsplash.com/photo-1521369909029-2afed882baee" },
  { name: "Ceramic Vase", category: "home", price: 899, rating: 4.2, image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c" },
  { name: "Soft Throw Pillow", category: "home", price: 699, rating: 4.4, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2" },
  { name: "Wall Clock", category: "home", price: 1599, rating: 4.0, image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c" },
  { name: "Insulated Water Bottle", category: "home", price: 749, rating: 4.5, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8" },
  { name: "Scented Candle", category: "home", price: 499, rating: 4.3, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59" },
  { name: "Wooden Serving Board", category: "home", price: 1099, rating: 4.2, image: "https://images.unsplash.com/photo-1547592180-85f173990554" },
  { name: "Indoor Plant", category: "home", price: 799, rating: 4.5, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411" },
  { name: "Cotton Bedsheet", category: "home", price: 1799, rating: 4.4, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304" },
  { name: "Ceramic Mug", category: "home", price: 399, rating: 4.6, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d" },
  { name: "Storage Basket", category: "home", price: 899, rating: 4.1, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2" },
  { name: "Organic Face Wash", category: "beauty", price: 549, rating: 4.3, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8" },
  { name: "Daily Moisturizer", category: "beauty", price: 699, rating: 4.4, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" },
  { name: "Perfume", category: "beauty", price: 2499, rating: 4.5, image: "https://images.unsplash.com/photo-1541643600914-78b084683601" },
  { name: "Hair Dryer", category: "beauty", price: 1899, rating: 4.2, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e" },
  { name: "Yoga Mat", category: "sports", price: 999, rating: 4.6, image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2" },
  { name: "Resistance Bands", category: "sports", price: 799, rating: 4.3, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc" },
  { name: "Football", category: "sports", price: 1199, rating: 4.4, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55" },
  { name: "Dumbbell Set", category: "sports", price: 3499, rating: 4.5, image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61" },
  { name: "Travel Mug", category: "travel", price: 899, rating: 4.2, image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38" },
  { name: "Neck Pillow", category: "travel", price: 699, rating: 4.1, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2" },
  { name: "Packing Cubes", category: "travel", price: 999, rating: 4.4, image: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const operations = products.map((product) => ({
    updateOne: {
      filter: { name: product.name },
      update: { $set: product },
      upsert: true,
    },
  }));
  const result = await Product.bulkWrite(operations);
  console.log(`Seeded ${products.length} products (${result.upsertedCount} added, existing records updated).`);
  await mongoose.disconnect();
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
