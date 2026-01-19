"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { useRouter } from "next/navigation";
import { AuthHeader } from "./AuthHeader";
import { AuthTabs } from "./AuthTabs";
import { AuthInputs } from "./AuthInputs";
import { OtpSection } from "./OtpSection";
import { AuthFooter } from "./AuthFooter";
import { SubmitButton } from "./SubmitButton";
import { useAuth } from "./hooks/useAuth";
import dynamic from "next/dynamic"; // Import the dynamic function from next/dynamic

// Dynamically import the Login form to avoid SSR errors with `useSearchParams`.
const LoginForm = () => {
  const route = useRouter();
  const { status } = useGlobalState();
  const {
    sign,
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
    sendOtp,
    showOTP,
    otp,
    setOtp,
    resendCountdown,
    isSignupOtp,
    handelEyeOne,
    handelEyeTwo,
    change_sign,
    setLoading,
    verifyOtpForSignup,
    verifyOtpAndReset,
  } = useAuth(status);

  const [queryParam, setQueryParam] = useState<string | null>(null);

  // Only run on the client
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("param");
    setQueryParam(param);
    console.log(param); // You can use it as needed
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (showOTP) {
      if (isSignupOtp) await verifyOtpForSignup();
      else await verifyOtpAndReset();
      return;
    }

    if (!email || !password || (!sign && (!username || !confirmPassword))) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Invalid email format.");
      return;
    }
    if (!sign && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (sign) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          userType: "officeUser",
        });
        if (!result?.ok) setError("Invalid credentials");
        else route.push("/components/home");
      } else {
        await sendOtp();
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <form
        onSubmit={handleSubmit}
        className="w-[300px] border border-gray-300 shadow-md rounded-md p-4 space-y-3"
      >
        <AuthHeader sign={sign} lang={status.setting?.lang || "en"} />

        <AuthTabs sign={sign} lang={status.setting?.lang || "en"} />

        <AuthInputs
          sign={sign}
          showOTP={showOTP}
          isSignupOtp={isSignupOtp}
          email={email}
          setEmail={setEmail}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          inputTypeOne={inputTypeOne}
          inputTypeTwo={inputTypeTwo}
          handelEyeOne={handelEyeOne}
          handelEyeTwo={handelEyeTwo}
          passEyeOne={passEyeOne}
          passEyeTwo={passEyeTwo}
          theme={status.setting?.theme}
          lang={status.setting?.lang || "en"}
        />

        {((sign && showOTP) || (!sign && isSignupOtp)) && (
          <OtpSection
            otp={otp}
            setOtp={setOtp}
            resendCountdown={resendCountdown}
            sendOtp={sendOtp}
          />
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <AuthFooter
          sign={sign}
          isSignupOtp={isSignupOtp}
          showOTP={showOTP}
          change_sign={change_sign}
          sendOtp={sendOtp}
          theme={status.setting?.theme}
          lang={status.setting?.lang || "en"}
        />

        <SubmitButton
          sign={sign}
          showOTP={showOTP}
          isSignupOtp={isSignupOtp}
          loading={loading}
          lang={status.setting?.lang || "en"}
        />
      </form>
    </div>
  );
};

// Dynamic import to ensure this is only rendered on the client-side
export default dynamic(() => Promise.resolve(LoginForm), { ssr: false });
