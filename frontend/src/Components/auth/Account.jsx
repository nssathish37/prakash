import PropTypes from "prop-types";
import axios from "axios";
import { useContext, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { ContextProvider } from "../../Context/Context";
import Loading from "../Loading";

const Account = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("email"); // email | otp
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuth, setToken } = useContext(ContextProvider);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ================= SEND OTP =================
    if (stage === "email") {
      setIsLoading(true);
      try {
        await axios.post("http://127.0.0.1:8000/api/auth/send-otp/", {
          email,
        });
        setStage("otp");
      } catch (err) {
        setError("Error sending OTP. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ================= VERIFY OTP =================
    if (stage === "otp") {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/verify-otp/",
          { email, otp }
        );

        if (response.data.success) {
          localStorage.setItem("access_token", response.data.token);
          setToken(response.data.token);
          setIsAuth(true);

          setSuccess("Login successful 🎉");

          // Auto close popup after success
          setTimeout(() => {
            setEmail("");
            setOtp("");
            setStage("email");
            onClose();
          }, 1500);
        } else {
          setError(response.data.message || "Invalid OTP");
        }
      } catch (err) {
        setError("Error verifying OTP. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-black p-12 w-[500px] h-auto shadow-lg rounded-md text-white relative">
      
      {/* CLOSE BUTTON */}
      <button className="absolute top-4 right-4" onClick={onClose}>
        <IoCloseOutline className="w-6 h-6 hover:text-red-400" />
      </button>

      {/* TITLE */}
      <p className="m-4 text-center text-sm font-semibold">
        {stage === "email"
          ? "Please enter your Email ID"
          : "Please verify OTP"}
      </p>

      {/* FORM */}
      <form className="text-center" onSubmit={handleLogin}>
        {stage === "email" ? (
          <>
            <input
              type="email"
              placeholder="Enter your Email ID"
              className="border border-gray-800 bg-black w-full h-14 text-center rounded-md mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="text-xs text-gray-400">
              Enter correct email, OTP will be sent
            </label>

            <div className="flex items-center gap-2 text-xs justify-center m-4">
              <input type="checkbox" className="w-5 h-5" />
              Keep me signed in
            </div>

            <p className="text-xs m-4 text-gray-400">
              By continuing you agree to our{" "}
              <span className="text-teal-500 cursor-pointer">
                Terms of Use
              </span>{" "}
              &{" "}
              <span className="text-teal-500 cursor-pointer">
                Privacy Policy
              </span>
            </p>

            <button
              type="submit"
              className="bg-teal-500 w-full h-14 rounded-md font-semibold hover:bg-teal-600 transition"
            >
              {isLoading ? <Loading text="Sending OTP..." /> : "Continue"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-800 bg-black w-full h-14 text-center rounded-md"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button
              type="submit"
              className="bg-teal-500 w-full h-14 rounded-md mt-4 font-semibold hover:bg-teal-600 transition"
            >
              {isLoading ? <Loading text="Verifying OTP..." /> : "Verify OTP"}
            </button>
          </>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-xs mt-3 font-semibold">
            {error}
          </p>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <p className="text-green-500 text-sm mt-3 font-bold">
            {success}
          </p>
        )}
      </form>
    </div>
  );
};

Account.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Account;
