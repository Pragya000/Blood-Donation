import MyImage from "../components/common/MyImage";
import useCustomTitle from "../hooks/useCustomTitle";
import { useState } from "react";
import Logo from "../assets/Blood_logo.jpg";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiConnector } from "../services/apiConnector";
import { LOGIN } from "../services/apis";
import toast from "react-hot-toast";
import { useUser } from "../store/useUser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const navigate = useNavigate()

  useCustomTitle("Login | Blood Donation");

  const { setIsAuth, setAccountType, setApprovalStatus } = useUser();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const mutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", LOGIN, payload);
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      setIsAuth(true);
      setAccountType(data?.data?.accountType);
      setApprovalStatus(data?.data?.approvalStatus);
      if(data?.data?.accountType === 'Admin') {
        location.replace('/admin/home')
      } else {
        location.replace('/profile')
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password");
    } else {
      // Perform login logic here
      setError("");
      mutation.mutate({ email, password });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/">
        <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
      </Link>
      <h1 className="text-2xl font-bold mb-4">Login</h1>
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
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white rounded-md px-4 py-2"
      >
        Login
      </button>
      <p className="mt-4">
        Do not have an account?{" "}
        <Link to="/signup" className="text-blue-500">
          Signup
        </Link>
      </p>
    </div>
  );
}
