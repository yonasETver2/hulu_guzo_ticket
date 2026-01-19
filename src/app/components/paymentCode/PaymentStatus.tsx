import React from "react";

interface PaymentStatusProps {
  status: string;
  message: string;
  remainingTime: number;
  lang: string;
  formatTime: (seconds: number) => string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  message,
  remainingTime,
  lang,
  formatTime,
}) => {
  switch (status) {
    case "PAID":
      return (
        <p className="text-green-600 font-semibold text-xl animate-pulse">
          {lang === "en" ? message : "ክፈያ በተሳካ ሁኔታ ተጠናቋል"}
        </p>
      );
    case "PENDING":
      return (
        <p className="text-red-500 font-semibold text-xl text-center">
          {lang === "en" ? message : "ክፍያን በመጠባበቅ ላይ"} <br />
          {lang === "en" ? "Time left:" : "ቀሪ ሰአት"} {formatTime(remainingTime)}
        </p>
      );
    case "EXPIRED":
    case "CANCELED":
      return (
        <p className="text-gray-700 font-semibold text-xl animate-bounce">
          {lang === "en"
            ? message
            : "ክፈያ ተበላሽቷል ወይም ጉዞ ተሰርዟል"}
        </p>
      );
    default:
      return null;
  }
};

export default PaymentStatus;
