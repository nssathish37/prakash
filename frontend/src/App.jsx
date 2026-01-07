import { useLocation } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import AllRoutes from "./Routes/AllRoutes";

export const SERVER_URL = "https://croma-server.onrender.com";

const App = () => {
  const location = useLocation();

  // 🔹 hide navbar & footer for admin page
  const hideLayout = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <Navbar />}
      <AllRoutes />
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
