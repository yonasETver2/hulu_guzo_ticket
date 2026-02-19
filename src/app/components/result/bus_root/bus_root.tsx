"use client";

import React from "react";
import Image from "next/image";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import {
  formatEthiopianDate,
  formatEthiopianTime,
  parseAmPmTime,
} from "@/tools/constant";

type Trip = {
  source_city: string;
  source_city_amh: string;
  destination_city: string;
  destination_city_amh: string;
  trip_date: string;
  trip_time: string;
  available_seats: number;
  payment_per_passenger: number;
  // Add other fields as needed
};

type BusRootProps = {
  dataJson: Trip | Trip[]; // Accept single trip or array
};

export default function BusRoot({ dataJson }: BusRootProps) {
  const { status } = useGlobalState();

  const lang = status.setting?.lang || "en";
  const theme = status.setting?.theme || "light";

  const tripsArray = Array.isArray(dataJson) ? dataJson : [dataJson];

  if (tripsArray.length === 0) {
    return <p className="text-center py-4">{lang === "en" ? "No trips found" : "ጉዞ አልተገኘም"}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tripsArray.map((trip, index) => {
        const formattedDate =
          lang === "en"
            ? new Date(trip.trip_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : formatEthiopianDate(new Date(trip.trip_date));

        const formattedTime =
          lang === "en" ? trip.trip_time : formatEthiopianTime(parseAmPmTime(trip.trip_time));

        return (
          <div
            key={`${trip.source_city}-${trip.destination_city}-${trip.trip_date}-${trip.trip_time}-${index}`}
            className="relative w-[270px]"
          >
            <div
              className={`border-t-1 border-gray-300 rounded-t-md p-2 space-y-3 ${
                theme === "light" ? "bg-gray-100" : "bg-gray-400"
              } hover:bg-[#5376f6a0] cursor-pointer`}
            >
              {/* Top information */}
              <div className="flex justify-between items-center shadow-md py-1">
                <p className="font-semibold text-[#5376f6]">
                  {lang === "en" ? "Available" : "የሚገኝ"}
                </p>
                <div className="flex items-center justify-center bg-blue-200 px-1 rounded-md">
                  <Image src="/assets/icons/seat.svg" alt="seat" width={14} height={12} />
                  <p>{trip.available_seats}</p>
                </div>
              </div>

              {/* Center information */}
              <div className="flex justify-between items-center px-2">
                <div className="text-center">
                  <p className="font-semibold text-[14px]">{formattedDate}</p>
                  <p>{formattedTime}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-[14px]">
                    <span className="text-[#5376f6]">{trip.payment_per_passenger}</span>{" "}
                    {lang === "en" ? "ETB" : "ብር"}
                  </p>
                  <p className="text-[12px]">{lang === "en" ? "Per passenger" : "በአንድ ተጓዥ"}</p>
                </div>
              </div>

              {/* Bottom information */}
              <div className="flex space-x-2 justify-center items-center">
                <p>{lang === "en" ? trip.source_city : trip.source_city_amh}</p>
                <hr
                  className={`w-[50px] border-2 mt-1 ${
                    theme === "light" ? "border-gray-400" : "border-gray-200"
                  }`}
                />
                <p>{lang === "en" ? trip.destination_city : trip.destination_city_amh}</p>
              </div>

              <hr className="border border-gray-300 shadow-md" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
