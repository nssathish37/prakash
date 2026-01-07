import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ContextProvider } from "../../Context/Context";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineLoading3Quarters, AiOutlineCheckCircle } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // New State for full-screen loading

  const { setIsAuth, setToken } = useContext(ContextProvider);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/admin-login/",
        { username, password }
      );

      if (response.data.success) {
        localStorage.setItem("access_token", response.data.token);
        localStorage.setItem("is_admin", "true");
        setToken(response.data.token);
        setIsAuth(true);

        // START REDIRECT LOADING SEQUENCE
        setIsLoading(false);
        setIsRedirecting(true);

        // Delay for 1.5 seconds to show the professional loader
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(response.data.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
      
      {/* FULL SCREEN LOADING OVERLAY */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <AiOutlineLoading3Quarters className="text-emerald-500 animate-spin text-6xl mb-6" />
              <h2 className="text-white text-2xl font-bold tracking-widest uppercase">
                Preparing Dashboard
              </h2>
              <p className="text-gray-500 mt-2">Securing your session...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Visuals */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md p-1"
      >
        <div className="relative bg-[#111] border border-gray-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          
          {/* CANCEL BUTTON */}
          <button 
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-500 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <IoClose className="w-6 h-6" />
          </button>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Admin <span className="text-emerald-500">Portal</span>
            </h2>
            <p className="text-gray-500 text-sm mt-2">Enter credentials to access dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1 tracking-wider">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin_user"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1 tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-300"
              />
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm bg-red-900/10 border border-red-900/20 py-2 px-3 rounded-lg text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || isRedirecting}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              ← Back to Main Store
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;