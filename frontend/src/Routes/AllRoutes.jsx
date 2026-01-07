import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ProductPage from "../Components/ProductPage";
import SingleItem from "../Components/SingleItem";
import PrivateRoute from "./PrivateRoute";

import Profile from "../Components/auth/Profile";
import UserAddress from "../Components/auth/UserAddress";
import AddAddress from "../Components/auth/AddAddress";
import Login from "../Components/auth/Login";

import Cart from "../Components/Cart";
import Mobile from "../Components/Product/Mobile";
import Dashboard from "../Components/AdminDashboard";
import AdminLogin from "../Components/auth/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";
import About from "../pages/About"


const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mobile" element={<Mobile />} />

      {/* Product Routes */}
      <Route path="/:category" element={<ProductPage />} />
      <Route path="/product/:_id" element={<SingleItem />} />
      <Route path="/about" element={<About />} />

      {/* Protected User Routes */}
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

      {/* Admin */}
      <Route path="/admin-login" element={<AdminLogin />} />
        <Route
    path="/dashboard"
    element={
      <AdminProtectedRoute>
        <Dashboard />
    </AdminProtectedRoute>
  }
/>
    </Routes>
  );
};

export default AllRoutes;
