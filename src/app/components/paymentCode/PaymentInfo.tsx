import React from "react";
import Image from "next/image";

interface PaymentInfoProps {
  status: any;
  total: string | null;
  bankType: string | null;
  paymentId: string | null;
  bankImages: Record<string, string>;
  remainingTime?: number;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  status,
  total,
  bankType,
  paymentId,
  bankImages,
}) => {
  const normalizedBankType = bankType ? bankType.toLowerCase() : "";

  return (
    <div
      className={`space-y-4 p-6 rounded-xl shadow-lg w-full max-w-md text-center ${
        status.setting?.theme === "light" ? "bg-gray-200" : "bg-gray-700"
      }`}
    >
      <p className="text-lg md:text-xl font-semibold">
        {status.setting?.lang === "en" ? "Please pay" : "እባኮ ክፍያዎን ይክፈሉ"}{" "}
        <span className="text-[#5376f6]">
          {total ? Number(total).toLocaleString() : "0"}
        </span>{" "}
        {status.setting?.lang === "en" ? "birr to" : "ብር በ"}{" "}
        <span className="capitalize">{bankType}</span>
        {bankType?.toLowerCase() === "telebirr"
          ? ""
          : status.setting?.lang === "en"
          ? " bank"
          : " ባንክ ይክፈሉ "}
      </p>

      {normalizedBankType && bankImages[normalizedBankType] && (
        <Image
          src={bankImages[normalizedBankType]}
          alt={bankType || "Bank"}
          width={200}
          height={200}
          className="w-48 h-32 object-contain mx-auto"
        />
      )}

      <p className="flex justify-center mt-2 text-md md:text-xl font-semibold italic text-[#5376f6]">
        {status.setting?.lang === "en"
          ? "Use this code: "
          : "ይህን የሚስጥር ቁጥር ይጠቀሙ: "}{" "}
        {paymentId}
      </p>
    </div>
  );
};

export default PaymentInfo;
