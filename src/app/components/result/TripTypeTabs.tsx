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
  return (
    <>
      <button
        onClick={handel_one_way}
        className={`cursor-pointer ${
          oneWay ? "border-b-2 border-[#5376f6]" : "hover:border-b-4"
        } ${
          status.setting?.theme === "light"
            ? "hover:bg-[#f0f4ff]"
            : "hover:bg-[#a4b7f9]"
        }`}
      >
        <Image
          className="-mb-3"
          src={
            status.setting?.theme === "light"
              ? "/assets/icons/one_way.svg"
              : "/assets/icons/one_way_white.svg"
          }
          alt="trip"
          width={30}
          height={20}
        />
        {status.setting?.lang === "en" ? "Trip" : "ጉዞ"}
      </button>

      {searchParams.get("tripType") === "two-way" && (
        <button
          onClick={handel_two_way}
          className={`cursor-pointer hover:border-b-3 ${
            roundTrip ? "border-b-2 border-[#5376f6]" : ""
          } hover:border-[#5376f6] ${
            status.setting?.theme === "light"
              ? "hover:bg-[#f0f4ff]"
              : "hover:bg-[#a4b7f9]"
          }`}
        >
          <Image
            className="-mb-3"
            src={
              status.setting?.theme === "light"
                ? "/assets/icons/round_trip.svg"
                : "/assets/icons/round_trip_white.svg"
            }
            alt="trip"
            width={30}
            height={20}
          />
          {status.setting?.lang === "en" ? "Trip" : "ጉዞ"}
        </button>
      )}
    </>
  );
};

export default TripTypeTabs;
