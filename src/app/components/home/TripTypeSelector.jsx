import Image from "next/image";

export default function TripTypeSelector({
  status,
  singleTrip,
  oneWay,
  roundTrip,
  roundTripClick,
  handelOneWay,
  handel_single_tript,
  handelRoundTripClick,
  handel_round_tript,
}) {
  return (
    <div className="sm:flex pt-1 sm:pt-0 justify-center items-center">
      <div>
        <p className="text-center -mb-2">
          {status.setting?.lang === "en" ? "Trip" : "ጉዞ"}
        </p>

        <div className="flex justify-center items-center">
          {/* One-Way */}
          <Image
            onClick={handelOneWay}
            onMouseEnter={handel_single_tript}
            onMouseLeave={handel_single_tript}
            className="cursor-pointer"
            src={`${
              !singleTrip && !oneWay
                ? status.setting?.theme === "light"
                  ? "/assets/icons/one_way.svg"
                  : "/assets/icons/one_way_white.svg"
                : "/assets/icons/one_way_hover.svg"
            }`}
            alt="trip"
            width={24}
            height={24}
          />

          {/* Round Trip */}
          <Image
            onClick={handelRoundTripClick}
            onMouseEnter={handel_round_tript}
            onMouseLeave={handel_round_tript}
            className="cursor-pointer"
            src={`${
              !roundTrip && !roundTripClick
                ? status.setting?.theme === "light"
                  ? "/assets/icons/round_trip.svg"
                  : "/assets/icons/round_trip_white.svg"
                : "/assets/icons/round_trip_hover.svg"
            }`}
            alt="trip"
            width={24}
            height={24}
          />
        </div>
      </div>
    </div>
  );
}
