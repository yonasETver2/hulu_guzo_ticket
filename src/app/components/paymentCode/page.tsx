"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import dynamic from 'next/dynamic';

// Dynamically import components to avoid server-side rendering issues
const PaymentStatus = dynamic(() => import("./PaymentStatus"), { ssr: false });
const PaymentInfo = dynamic(() => import("./PaymentInfo"), { ssr: false });

const PaymentCodeClient = () => {
  const { status } = useGlobalState();
  const searchParams = useSearchParams(); // Client-side hook
  const router = useRouter();

  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const [bankType, setBankType] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");
  const [message, setMessage] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<number>(900);

  const bankImages: Record<string, string> = {
    cbe: "/assets/images/bank/cbeBank.jpeg",
    awash: "/assets/images/bank/awashBank.png",
    abyssinia: "/assets/images/bank/abyssiniaBank.png",
    dashen: "/assets/images/bank/dashenBank.png",
    telebirr: "/assets/images/bank/telebir.png",
  };

  useEffect(() => {
    setPaymentId(searchParams.get("paymentId"));
    setTotal(searchParams.get("total"));
    setBankType(searchParams.get("type"));
  }, [searchParams]);

  useEffect(() => {
    if (!paymentId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checkPayment?paymentId=${paymentId}`);
        const data = await res.json();
        setPaymentStatus(data.status?.toUpperCase() || "PENDING");
        setMessage(data.message);
      } catch (err) {
        console.error("Failed to check payment:", err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [paymentId]);

  useEffect(() => {
    if (paymentStatus !== "PENDING" || !paymentId) return;

    const expiryKey = `payment_expiry_${paymentId}`;
    let expiry = localStorage.getItem(expiryKey);
    if (!expiry) {
      const newExpiry = Date.now() + 15 * 60 * 1000;
      localStorage.setItem(expiryKey, newExpiry.toString());
      expiry = newExpiry.toString();
    }

    const expiryTime = parseInt(expiry, 10);
    const timer = setInterval(() => {
      const remaining = Math.max(
        Math.floor((expiryTime - Date.now()) / 1000),
        0
      );
      setRemainingTime(remaining);
      if (remaining <= 0) {
        setPaymentStatus("EXPIRED");
        localStorage.removeItem(expiryKey);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus, paymentId]);

  useEffect(() => {
    if (paymentStatus === "PAID") {
      router.push("/components/home");
      localStorage.clear();
      sessionStorage.clear();
    } else if (paymentStatus === "EXPIRED" || paymentStatus === "CANCELED") {
      localStorage.clear();
      sessionStorage.clear();
      if (paymentId) localStorage.removeItem(`payment_expiry_${paymentId}`);
      router.push("/");
    }
  }, [paymentStatus, router, paymentId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center mt-6 space-y-6 mx-4">
      <PaymentInfo
        status={status}
        total={total}
        bankType={bankType}
        paymentId={paymentId}
        bankImages={bankImages}
      />
      <div className="flex justify-center">
        <PaymentStatus
          status={paymentStatus}
          message={message}
          remainingTime={remainingTime}
          lang={status.setting?.lang || "en"}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
};

const PaymentCode = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCodeClient />
    </Suspense>
  );
};

export default PaymentCode;
