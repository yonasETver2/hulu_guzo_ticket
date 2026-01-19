"use client";
import Image from "next/image";

interface TopHeaderProps {
  status: any;
  tripType: string;
  cityOne: string;
  cityTwo: string;
}

export default function TopHeader({
  status,
  tripType,
  cityOne,
  cityTwo,
}: TopHeaderProps) {
  return (
    <div
      className={`w-full fixed top-15 left-0 p-4 ${
        status.setting?.theme === "light" ? "bg-gray-100" : "bg-gray-700"
      } flex space-x-2 pb-4`}
    >
      <p>{tripType === "two-way" ? cityTwo : cityOne}</p>

      <Image
        src={
          status.setting?.theme === "light"
            ? "/assets/icons/bus.svg"
            : "/assets/icons/bus_white.svg"
        }
        alt="bus"
        width={30}
        height={24}
      />

      <p>{tripType === "two-way" ? cityOne : cityTwo}</p>
    </div>
  );
}
