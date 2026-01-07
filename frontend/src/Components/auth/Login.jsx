import axios from "axios";
import { useContext, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { ContextProvider } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import Loading from "../Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState(""); // for admin
  const [stage, setStage] = useState("email");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuth, setToken } = useContext(ContextProvider);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ===== ADMIN LOGIN =====
    if (email === "admin@example.com") {
      if (!password) {
        setError("Please enter password for admin.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/admin-login/",
          { email, password }
        );

        if (response.data.success) {
          localStorage.setItem("access_token", response.data.token);
          setToken(response.data.token);
          setIsAuth(true);
          navigate("/dashboard"); // redirect admin to dashboard
        } else {
          setError(response.data.message || "Invalid credentials");
        }
      } catch (err) {
        setError("Error logging in admin.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

   // ===== CHECK LOGIN TYPE FIRST =====
        if (stage === "email") {
          setIsLoading(true);
          try {
            const res = await axios.post(
              "http://127.0.0.1:8000/api/auth/login-type/",
              { email }
            );

            if (res.data.type === "admin") {
              // ADMIN → ask password
              setStage("admin-password");
              return;
            }

            // NORMAL USER → SEND OTP
            await axios.post(
              "http://127.0.0.1:8000/api/auth/send-otp/",
              { email }
            );

            setStage("otp");
          } catch (error) {
            setError("Something went wrong. Please try again.");
            console.error(error);
          } finally {
            setIsLoading(false);
          }
          return;
        }

    // ===== VERIFY OTP =====
    if (stage === "otp") {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/verify-otp/",
          { email, otp }
        );

        if (response.data.success) {
          localStorage.setItem("access_token", response.data.token);
          setToken(response.data.token);
          setIsAuth(true);
          navigate("/");
        } else {
          setError(response.data.message || "Invalid OTP");
        }
      } catch (error) {
        setError("Error verifying OTP. Please try again.");
        console.error(error);
      }
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 z-50">
      <div className="bg-black p-12 w-[500px] h-auto shadow-lg">
        <button className="float-right" onClick={handleClose}>
          <IoCloseOutline className="w-6 h-6" />
        </button>

        <div className="mt-7 border border-gray-800 rounded-md flex items-center justify-center">
          <p className="basis-1/2 text-right">Login</p>
          <p className="border border-gray-200 rounded-md p-1 m-2">OR</p>
          <p className="basis-1/2">Create Account</p>
        </div>

        <p className="m-4 text-center text-sm">
          {email === "admin@example.com"
            ? "Enter admin password"
            : stage === "email"
            ? "Please enter your Email ID"
            : "Please Verify OTP"}
        </p>

        <form className="text-center" onSubmit={handleLogin}>
          {email === "admin@example.com" ? (
            <input
              type="password"
              placeholder="Enter Admin Password"
              className="border border-gray-800 bg-black w-full h-14 text-center rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          ) : stage === "email" ? (
            <input
              type="email"
              placeholder="Enter your Email ID"
              className="border border-gray-800 bg-black w-full h-14 text-center rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          ) : (
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-800 bg-black w-full h-14 text-center rounded-md"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            className="bg-teal-500 w-full h-14 rounded-md mt-4"
          >
            {isLoading ? <Loading text="Processing" /> : "Continue"}
          </button>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
