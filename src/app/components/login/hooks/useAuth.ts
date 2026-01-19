// hooks/useAuth.ts
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function useAuth(status: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auth states
  const [sign, setSign] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility
  const [passEyeOne, setPassEyeOne] = useState(false);
  const [passEyeTwo, setPassEyeTwo] = useState(false);
  const [inputTypeOne, setInputTypeOne] = useState("password");
  const [inputTypeTwo, setInputTypeTwo] = useState("password");

  // OTP states
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const resendTimer = useRef<NodeJS.Timeout | null>(null);
  const [isSignupOtp, setIsSignupOtp] = useState(false);

  const [userType, setUserType] = useState("officeUser");
  const [task, setTask] = useState("regular");

  useEffect(() => {
    const paramUserType = searchParams.get("userType");
    const savedUserType =
      typeof window !== "undefined" ? localStorage.getItem("officeUser") : null;
    setUserType(paramUserType || savedUserType || "officeUser");

    const paramTask = searchParams.get("task");
    const savedTask =
      typeof window !== "undefined" ? localStorage.getItem("task") : null;
    setTask(paramTask || savedTask || "regular");
  }, []);

  useEffect(() => {
    if (userType) localStorage.setItem("userType", userType);
    if (task) localStorage.setItem("task", task);
  }, [userType, task]);

  // Handle password eye toggle
  const togglePassOne = () => {
    const newState = !passEyeOne;
    setPassEyeOne(newState);
    setInputTypeOne(newState ? "text" : "password");
  };
  const togglePassTwo = () => {
    const newState = !passEyeTwo;
    setPassEyeTwo(newState);
    setInputTypeTwo(newState ? "text" : "password");
  };

  // Reset form
  const resetForm = () => {
    setSign(!sign);
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowOTP(false);
    setOtp("");
    setServerOtp("");
    setOtpExpiry(null);
    setResendCountdown(0);
    setIsSignupOtp(false);
  };

  const handelEyeOne = () => {
    const newState = !passEyeOne;
    setPassEyeOne(newState);
    setInputTypeOne(newState ? "text" : "password");
  };

  const handelEyeTwo = () => {
    const newState = !passEyeTwo;
    setPassEyeTwo(newState);
    setInputTypeTwo(newState ? "text" : "password");
  };

  const change_sign = () => {
    setSign(!sign);
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowOTP(false);
    setOtp("");
    setServerOtp("");
    setOtpExpiry(null);
    setResendCountdown(0);
  };

  const change_sign_two = () => {
    setSign(true);
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowOTP(false);
    setOtp("");
    setServerOtp("");
    setOtpExpiry(null);
    setResendCountdown(0);
  };

  const verifyOtpForSignup = async () => {
    if (!otp) {
      setError(status.setting?.lang === "en" ? "Enter OTP" : "እባኮን OTP ያስገቡ");
      return;
    }
    if (!serverOtp || !otpExpiry || new Date() > otpExpiry) {
      setError(status.setting?.lang === "en" ? "OTP expired" : "OTP ግዜውን ጨርሷል");
      return;
    }
    if (otp !== serverOtp) {
      setError(status.setting?.lang === "en" ? "Invalid OTP" : "የተሳሳተ OTP");
      return;
    }

    if (!username || !password || !confirmPassword) {
      setError(
        status.setting?.lang === "en" ? "Complete all fields" : "ሁሉንም መስኮች ያስገቡ"
      );
      return;
    }
    if (password !== confirmPassword) {
      setError(
        status.setting?.lang === "en"
          ? "Passwords do not match"
          : "የይለፍ ቃል አይመሳሰልም"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          password,
          confirmPassword,
          userType: "officeUser",
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // auto-login after signup
      const loginResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
        userType,
      });

      if (!loginResult?.ok) setError("Signup succeeded, but login failed.");
      else router.push("/pages/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  // Resend countdown effect
 useEffect(() => {
  if (resendCountdown > 0) {
    resendTimer.current = setTimeout(
      () => setResendCountdown(resendCountdown - 1),
      1000
    );
  }

  return () => {
    // TypeScript-safe cleanup
    if (resendTimer.current) {
      clearTimeout(resendTimer.current);
    }
  };
}, [resendCountdown]);

  const sendOtp = async () => {
    if (!email) {
      setError(
        status.setting?.lang === "en"
          ? "Please enter your email"
          : "እባኮትን የኢሜል አድራሻ ያስገቡ"
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: sign ? "login" : "signup" }), // send purpose
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }

      setServerOtp(data.otp);
      setOtpExpiry(new Date(Date.now() + 3 * 60 * 1000)); // 3 minutes
      setShowOTP(true);
      setResendCountdown(30);

      if (!sign) setIsSignupOtp(true); // mark OTP for signup
    } catch (err) {
      console.error(err);
      setError(
        status.setting?.lang === "en"
          ? "Something went wrong sending OTP."
          : "OTP በመላክ ችግር ተፈጥሯል"
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP (common)
  const verifyOtp = (enteredOtp: string) => {
    if (!enteredOtp) {
      setError(status.setting?.lang === "en" ? "Enter OTP" : "እባኮን OTP ያስገቡ");
      return false;
    }
    if (!serverOtp || !otpExpiry || new Date() > otpExpiry) {
      setError(status.setting?.lang === "en" ? "OTP expired" : "OTP ግዜውን ጨርሷል");
      return false;
    }
    if (enteredOtp !== serverOtp) {
      setError(status.setting?.lang === "en" ? "Invalid OTP" : "የተሳሳተ OTP");
      return false;
    }
    return true;
  };

  const verifyOtpAndReset = async () => {
    if (!otp) {
      setError(
        status.setting?.lang === "en" ? "Please enter the OTP" : "እባኮን OTP ያስገቡ"
      );
      return;
    }
    if (!serverOtp || !otpExpiry || new Date() > otpExpiry) {
      setError(
        status.setting?.lang === "en"
          ? "OTP expired. Please resend."
          : "OTP ግዜውን ጨርሷል፣ እባኮን እንደገና ይላኩ።"
      );
      return;
    }
    if (otp !== serverOtp) {
      setError(status.setting?.lang === "en" ? "Invalid OTP" : "የተሳሳተ OTP");
      return;
    }

    if (!password) {
      setError(
        status.setting?.lang === "en"
          ? "Enter new password"
          : "አዲስ የይለፍ ቃል ያስገቡ"
      );
      return;
    }
    if (password !== confirmPassword) {
      setError(
        status.setting?.lang === "en"
          ? "Passwords do not match"
          : "የይለፍ ቃል አይመሳሰልም"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: email, // your backend expects "identifier"
          otp: otp, // OTP entered by the user
          newPassword: password, // new password
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      alert(
        status.setting?.lang === "en"
          ? "Password reset successful! You can now login."
          : "የይለፍ ቃል በስኬት ተቀይሯል! አሁን መግባት ይችላሉ"
      );
      change_sign_two();
    } catch (err) {
      console.error(err);
      setError(
        status.setting?.lang === "en"
          ? "Something went wrong resetting password."
          : "የይለፍ ቃል በመቀየር ረገድ የሆነ ነግ ችግር አጋጥሟል"
      );
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        userType,
      });
      if (!result?.ok) setError("Invalid credentials");
      else router.push("/pages/home");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    sign,
    setSign,
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    loading,
    passEyeOne,
    passEyeTwo,
    inputTypeOne,
    inputTypeTwo,
    togglePassOne,
    togglePassTwo,
    resetForm,
    sendOtp,
    showOTP,
    setShowOTP,
    otp,
    setOtp,
    serverOtp,
    otpExpiry,
    resendCountdown,
    isSignupOtp,
    verifyOtp,
    login,
    handelEyeOne,
    handelEyeTwo,
    change_sign,
    setLoading,
    verifyOtpForSignup,
    verifyOtpAndReset,
  };
}
