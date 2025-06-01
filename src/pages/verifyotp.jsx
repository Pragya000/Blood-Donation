/*
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import useCustomTitle from "../hooks/useCustomTitle";
import Logo from "../assets/logo.png";
import MyImage from "../components/common/MyImage";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../store/useUser";
import { FORGOT_PASSWORD, SEND_OTP, SIGNUP } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const navigate = useNavigate();

  useCustomTitle("Verify OTP | Blood Connect");

  // access zustand store
  const { otpType, payload, setOtpType, setPayload } = useUser();

  // mutation to signup user OR verify otp
  const mutation = useMutation({
    mutationFn: (payload) => {
      const API_URL = otpType === "signup" ? SIGNUP : FORGOT_PASSWORD;
      return apiConnector("POST", API_URL, payload);
    },
    onSuccess: () => {
      // show success toast
      toast.success(
        otpType === "signup"
          ? "Signup successful!"
          : "Password reset successful!"
      );
      // reset the global state
      setOtpType(null);
      setPayload(null);
      // redirect to login page
      navigate("/login");
    },
    onError: (error) => {
      // show error toast
      toast.error(error?.response?.data?.message || "Something went wrong!");
      // reset the otp field
      setOtp("");
    },
  });

  // mutation to re-send otp to email
  const resendOtpMutation = useMutation({
    mutationFn: (payload) => {
      return apiConnector("POST", SEND_OTP, payload);
    },
    onSuccess: () => {
      // show success toast
      toast.success("OTP sent successfully!");
      setTimer(60);
    setIsResendDisabled(true);
    },
    onError: (error) => {
      // show error toast
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  useEffect(() => {
    // if otpType or payload is not set, redirect to signup page
    if (!(otpType && payload)) {
      navigate("/signup");
    }
    // console.log("payload", payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (otp) => {
    setOtp(otp);
    setIsOtpValid(true);
  };

  const handleResendOtp = () => {
    // Logic to resend OTP
    resendOtpMutation.mutate({ email: payload?.email, type: otpType });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation logic
    if (otp.length === 6) {
      // Logic to verify OTP
        mutation.mutate({
          ...payload,
          otp,
      });
    } else {
      setIsOtpValid(false);
    }
  };

  return (
    <div className="w-screen h-screen grid place-content-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <MyImage alt="Blood Connect" src={Logo} className="w-[160px]" />
        <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          shouldAutoFocus={true}
          containerStyle={{
            justifyContent: "center",
            gap: "10px",
          }}
          renderInput={(props) => (
            <input
              {...props}
              type="number"
              placeholder="0"
              pattern="\d*"
              className={`!w-[32px] h-[32px] !aspect-square border ${
                isOtpValid ? "border-black" : "border-red-500"
              } text-center`}
            />
          )}
        />
        {!isOtpValid && <p className="text-red-500">Invalid OTP!</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2"
        >
          Verify
        </button>
        <div className="flex items-center">
          {timer > 0 ? (
            <p>Resend OTP in {timer} seconds</p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className="bg-blue-500 text-white rounded-md px-4 py-2"
            >
              Resend OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
  */
