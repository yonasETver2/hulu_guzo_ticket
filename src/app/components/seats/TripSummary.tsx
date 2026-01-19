"use client";
import React from "react";
import Image from "next/image";
import {
  formatEthiopianDate,
  formatEthiopianTime,
  parseAmPmTime,
} from "@/tools/constant";

interface TripSummaryProps {
  indexTop: number;
  tripType: "one-way" | "two-way";
  selectedData: any;
  reservedSeats: Set<string | number>;
  status: any;
  handlePersonInfo: (
    indexTop: number,
    reservedSeats: Set<string | number>,
    providerId: string | number
  ) => void;
}

const TripSummary: React.FC<TripSummaryProps> = ({
  indexTop,
  tripType,
  selectedData,
  reservedSeats,
  status,
  handlePersonInfo,
}) => {
  const getPaymentPerPassenger = () => {
    if (indexTop === 0) {
      return tripType === "one-way"
        ? selectedData?.trip?.payment_per_passenger ?? 0
        : selectedData?.one?.trip?.payment_per_passenger ?? 0;
    } else {
      return selectedData?.two?.trip?.payment_per_passenger ?? 0;
    }
  };

  const getProviderId = () => {
    if (indexTop === 0) {
      return tripType === "one-way"
        ? selectedData?.trip?.provider_id ?? 0
        : selectedData?.one?.trip?.provider_id ?? 0;
    } else {
      return selectedData?.two?.trip?.provider_id ?? 0;
    }
  };

  const getTripDateTime = () => {
    // Decide which trip object to use
    const trip =
      indexTop === 0
        ? tripType === "one-way"
          ? selectedData?.trip
          : selectedData?.one?.trip
        : selectedData?.two?.trip;

    if (!trip) return "N/A";

    // Display date
    const dateDisplay =
      status.setting?.lang === "en"
        ? trip.trip_date // send Gregorian date to other components
        : formatEthiopianDate(new Date(trip.trip_date)); // display Ethiopian date only here

    // Display time
    const timeDisplay =
      status.setting?.lang === "en"
        ? trip.trip_time
        : formatEthiopianTime(parseAmPmTime(trip.trip_time));

    return `${dateDisplay} (${timeDisplay})`;
  };

  const paymentPerPassenger = getPaymentPerPassenger();
  const total = (reservedSeats?.size || 0) * paymentPerPassenger;

  return (
    <div className="md:flex space-y-3 md:space-y-0 justify-between items-start mt-4 lg:w-[1000px]">
      <div>
        <div className="flex space-x-2 md:space-x-4 font-semibold">
          <p className="w-[75px] md:w-[95px] border border-gray-300 px-1 text-center text-[13px] md:text-[16px]">
            {status.setting?.lang === "en" ? "Trip" : "ጉዞ"}
          </p>
          <p className="w-[110px] md:w-[130px] text-[13px] md:text-[16px] border border-gray-300 px-1 text-center">
            {status.setting?.lang  === "en"
              ? "# of traveler"
              : "የተጓዦች ቁጥር"}
          </p>
          <p className="w-[100px] md:w-[120px] text-[13px] md:text-[16px] border border-gray-300 px-1 text-center">
            {status.setting?.lang === "en" ? "Price/Traveler" : "ክፍያ/በተጓዥ"}
          </p>
          <p className="w-[80px] md:w-[100px] text-[13px] md:text-[16px] border border-gray-300 px-1 text-center">
            {status.setting?.lang === "en" ? "Total" : "አጠቃላይ"}
          </p>
        </div>

        <div className="flex space-x-2 md:space-x-4 mt-1 items-center">
          <button
            className={`border-b-4 border-[#5376f6] ${
              status.setting?.theme === "light"
                ? "bg-[#f0f4ff]"
                : "bg-[#a3b6fa]"
            } md:px-2 py-1 rounded w-[75px] md:w-[95px] text-[13px] md:text-[16px]`}
          >
            {indexTop === 0
              ? status.setting?.lang === "en"
                ? "First Trip"
                : "የመጀመሪያ ጉዞ"
              : status.setting?.lang === "en"
              ? "Round Trip"
              : "የመመለሻ ጉዞ"}
          </button>

          <p className="w-[110px] md:w-[130px] text-[13px] md:text-[16px] text-center text-[#5376f6]">
            {reservedSeats?.size || 0}
          </p>

          <p className="w-[100px] md:w-[120px] text-[13px] md:text-[16px] text-center text-[#5376f6]">
            {paymentPerPassenger.toLocaleString()}{" "}
            {status.setting?.lang === "en" ? "birr" : "ብር"}
          </p>

          <p className="w-[80px] md:w-[100px] text-[13px] md:text-[16px] text-center text-[#5376f6]">
            {total.toLocaleString()}{" "}
            {status.setting?.lang === "en" ? "birr" : "ብር"}
          </p>
        </div>

        <div className="mt-2">
          <p className="text-[13px] md:text-[16px]">
            {status.setting?.lang === "en" ? "Seat(s)" : "ወንበሮች"}:{" "}
            {Array.from(reservedSeats || []).map((seat, idx) => (
              <span className="text-[#5376f6] font-semibold" key={seat}>
                {seat}
                {idx < (reservedSeats?.size || 0) - 1 ? ", " : ""}
              </span>
            ))}{" "}
            {status.setting?.lang === "en"
              ? "reserved for you. Please change if needed."
              : "ለርሶ ተይዘዋል፣ መቀየር ከፈለጉ እባኮ ይቀይሩ"}
          </p>
          <p>{getTripDateTime()}</p>
        </div>
      </div>

      <div className="space-y-2 mt-5 md:mt-0">
        <button
          onClick={() =>
            handlePersonInfo(indexTop, reservedSeats, getProviderId())
          }
          className="flex justify-center items-center space-x-2 px-3 py-1 bg-[#5376f6] hover:bg-[#5376f6a0] text-white rounded-md cursor-pointer"
        >
          <Image
            src="/assets/images/person_white.svg"
            alt="person"
            width={16}
            height={16}
          />
          <p className="text-[13px] md:text-[16px]">
            {status.setting?.lang === "en"
              ? "Passenger Information"
              : "የተጓዥ ማስረጃ"}
          </p>
        </button>
      </div>
    </div>
  );
};

export default TripSummary;
