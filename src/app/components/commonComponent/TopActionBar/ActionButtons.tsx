"use client";

import Image from "next/image";
import Link from "next/link";

interface ActionButtonsProps {
  status: {
    setting?: {
      theme?: "light" | "dark";
      lang?: "en" | "am"
    };
  };
}

export default function ActionButtons({ status }: ActionButtonsProps) {
  const theme = status.setting?.theme === "light";

  return (
    <div className="flex justify-end items-center w-full">
      {/* Left Buttons */}
      <div className="flex space-x-3">
        <Link href="../components/tiket/TicketTable" className="hover:text-[#edd30d]">{status.setting?.lang === "en" ? "Get ticket info" : "የቲኬት መረጃ ያግኙ"}</Link>
        <Link href="../components/tiket"  className={` `} >
          <Image
            className="cursor-pointer"
            src={
              theme
                ? "/assets/icons/bus_tiket.svg"
                : "/assets/icons/bus_tiket_white.svg"
            }
            alt="tiket"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </div>
  );
}
