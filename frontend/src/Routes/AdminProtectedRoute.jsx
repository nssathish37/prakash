import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem("is_admin");

  // ❌ Not logged in or not admin
  if (!token || isAdmin !== "true") {
    return <Navigate to="/" replace />;
  }

  // ✅ Admin allowed
  return children;
};

export default AdminProtectedRoute;
