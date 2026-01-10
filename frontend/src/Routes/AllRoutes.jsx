import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ProductPage from "../Components/ProductPage";
import SingleItem from "../Components/SingleItem";
import PrivateRoute from "./PrivateRoute";

import Profile from "../Components/auth/Profile";
import UserAddress from "../Components/auth/UserAddress";
import AddAddress from "../Components/auth/AddAddress";
import Login from "../Components/auth/Login";

import AdminLogin from "../Components/auth/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Dashboard from "../Components/AdminDashboard";
import About from "../pages/About";

import ProductList from '../Components/ProductList'

import BrandProducts from "../Components/BrandProducts";
import CategoryProducts from "../Components/CategoryProducts";
import Payment from "../Components/Payment" ;
 
import Wishlist from "../pages/Wishlist";
import Cart from "../pages/Cart";

import Contact from "../pages/info/Contact";
import FAQs from "../pages/info/FAQs";
import BuyingGuide from "../pages/info/BuyingGuide";
import ReturnPolicy from "../pages/info/ReturnPolicy";
import StoreLocator from "../pages/info/StoreLocator";

const AllRoutes = () => {
  return (
    <Routes>

      {/* HOME */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/productlist" element={<ProductList />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart/>} />

      {/* PRODUCTS */}
      <Route path="/product/:id" element={<SingleItem />} />
      <Route path="/brand/:brandName" element={<BrandProducts />} />
      <Route path="/products/:category" element={<CategoryProducts />} />
     

         
      {/* USER */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/address"
        element={
          <PrivateRoute>
            <UserAddress />
          </PrivateRoute>
        }
      />

      <Route
        path="/add-address"
        element={
          <PrivateRoute>
            <AddAddress />
          </PrivateRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />

      {/* ADMIN */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <AdminProtectedRoute>
            <Dashboard />
          </AdminProtectedRoute>
        }
      />

      <Route path="/contact" element={<Contact />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/buying-guide" element={<BuyingGuide />} />
      <Route path="/return-policy" element={<ReturnPolicy />} />
      <Route path="/store-locator" element={<StoreLocator />} />

    </Routes>
  );
};

export default AllRoutes;
