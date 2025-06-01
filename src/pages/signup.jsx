import MyImage from "../components/common/MyImage";
import useCustomTitle from "../hooks/useCustomTitle";
import { useState } from "react";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../services/apiConnector";
import { SIGNUP } from "../services/apis";
// import { SEND_OTP } from "../services/apis";
import toast from "react-hot-toast";
import { useUser } from "../store/useUser";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    useCustomTitle("Signup | Blood Donation");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleAccountTypeChange = (e) => {
        setAccountType(e.target.value);
    };

   const mutation = useMutation({
    mutationFn: (payload) => apiConnector("POST", SIGNUP, payload),
    onSuccess: () => {
      toast.success("Signup successful!");
      setEmail("");
      setPassword("");
      setAccountType("");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

   const handleSignup = () => {
    if (!email || !password || !accountType) {
      setError("Please fill in all fields");
    } else {
      setError("");
      mutation.mutate({ email, password, accountType });
    }
  };

    return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/">
        <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />
      <div className="flex items-center mb-4 gap-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="user"
            name="accountType"
            value="User"
            checked={accountType === "User"}
            onChange={handleAccountTypeChange}
            className="mr-2"
          />
          <label htmlFor="user">User</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="hospital"
            name="accountType"
            value="Hospital"
            checked={accountType === "Hospital"}
            onChange={handleAccountTypeChange}
            className="mr-2"
          />
          <label htmlFor="hospital">Hospital</label>
        </div>
      </div>
      <button
        onClick={handleSignup}
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        Signup
      </button>
      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500">
          Login
        </Link>
      </p>
    </div>
    );
}
