import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import EditProfile from "./components/EditProfile";
import MyOrders from "./components/MyOrders";
import Wishlist from "./components/Wishlist";
import SavedAddresses from "./components/SavedAddresses";
import AccountSecurity from "./components/AccountSecurity";
import About from "./pages/About";
import Careers from "./pages/Careers";
import ProductDetails from "./pages/ProductDetails";
import OrderDetails from "./pages/OrderDetails";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/orders" element={<MyOrders />} />

      <Route path="/wishlist" element={<Wishlist />} />

      <Route path="/addresses" element={<SavedAddresses />} />

      <Route path="/security" element={<AccountSecurity />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
    </Routes>
  );
}

export default App;
