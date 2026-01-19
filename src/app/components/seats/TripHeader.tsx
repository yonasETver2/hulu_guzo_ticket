"use client";
import React from "react";
import Image from "next/image";

interface TripHeaderProps {
  cityOne: string;
  cityTwo: string;
  totalPriceFirst: number;
  totalPriceRound: number;
  status: any;
  handlePayClick: () => void;
}

const TripHeader: React.FC<TripHeaderProps> = ({
  cityOne,
  cityTwo,
  totalPriceFirst,
  totalPriceRound,
  status,
  handlePayClick,
}) => {
  return (
    <div
      className={`w-full fixed top-15 left-0 p-4 ${
        status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
      }`}
    >
      <div className="flex justify-between">
        <div className="flex space-x-2 pb-2">
          <p>{cityOne}</p>
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
          <p>{cityTwo}</p>
        </div>

        <div className="flex items-center space-x-2">
          {totalPriceFirst + totalPriceRound > 0 && (
            <p className="font-semibold">
              <span className="text-[#5376f6]">
                {(totalPriceFirst + totalPriceRound).toLocaleString()}
              </span>
              &nbsp;{status.setting?.lang === "en" ? "Birr" : "ብር"}
            </p>
          )}
          <button
            onClick={handlePayClick}
            className="flex justify-center items-center space-x-2 px-3 py-0.5 bg-[#5376f6] hover:bg-[#5376f6a0] text-white rounded-md cursor-pointer"
          >
            <p className="text-[13px] md:text-[14px]">
              {status.setting?.lang === "en" ? " Pay" : "ከፈል"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripHeader;
