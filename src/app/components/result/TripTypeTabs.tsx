"use client";

import Image from "next/image";

interface Props {
  status: any;
  oneWay: boolean;
  roundTrip: boolean;
  handel_one_way: () => void;
  handel_two_way: () => void;
  searchParams: URLSearchParams;
}

const TripTypeTabs = ({
  status,
  oneWay,
  roundTrip,
  handel_one_way,
  handel_two_way,
  searchParams,
}: Props) => {
  const showTwoWay = searchParams.get("tripType") === "two-way";

  // Determine theme for hover background
  const hoverBg =
    status.setting?.theme === "light"
      ? "hover:bg-[#f0f4ff]"
      : "hover:bg-[#a4b7f9]";

  return (
    <div className="flex space-x-4">
      <button
        onClick={handel_one_way}
        className={`cursor-pointer border-b-2 ${
          oneWay ? "border-[#5376f6]" : "border-transparent"
        } ${hoverBg}`}
      >
        <Image
          className="-mb-3"
          src={
            status.setting?.theme === "light"
              ? "/assets/icons/one_way.svg"
              : "/assets/icons/one_way_white.svg"
          }
          alt="one-way"
          width={30}
          height={20}
        />
        {status.setting?.lang === "en" ? "Trip" : "ጉዞ"}
      </button>

      {showTwoWay && (
        <button
          onClick={handel_two_way}
          className={`cursor-pointer border-b-2 ${
            roundTrip ? "border-[#5376f6]" : "border-transparent"
          } ${hoverBg}`}
        >
          <Image
            className="-mb-3"
            src={
              status.setting?.theme === "light"
                ? "/assets/icons/round_trip.svg"
                : "/assets/icons/round_trip_white.svg"
            }
            alt="round-trip"
            width={30}
            height={20}
          />
          {status.setting?.lang === "en" ? "Trip" : "ጉዞ"}
        </button>
      )}
    </div>
  );
};

export default TripTypeTabs;
