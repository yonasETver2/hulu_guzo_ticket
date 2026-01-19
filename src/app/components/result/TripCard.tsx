import Image from "next/image";
import BusRoot from "./bus_root/bus_root";

interface Props {
  trip: any;
  providerId: string;
  type: string;
  index: number;
  index0: number;
  status: any;
  isSelected: boolean;
  handleCardClick: (
    trip: any,
    providerId: string,
    type: string,
    index: number,
  ) => void;
  handelPopup: (i: number | null, j: number | null) => void;
  crossIndex: number | null;
  crossIndexTwo: number | null;
  crossHover: boolean;
  handelCross: () => void;
  getProviderLogo: (id: string) => string;
  formatProviderName: (id: string, lang: string) => string;
}

const TripCard = ({
  trip,
  providerId,
  type,
  index,
  index0,
  status,
  isSelected,
  handleCardClick,
  handelPopup,
  crossIndex,
  crossIndexTwo,
  crossHover,
  handelCross,
  getProviderLogo,
  formatProviderName,
}: Props) => {
  return (
    <div
      className={`relative shadow-md w-[275px] flex-shrink-1 cursor-pointer ${
        isSelected ? "border-3 border-[#42b415] rounded-md" : ""
      }`}
    >
      <div onClick={() => handleCardClick(trip, providerId, type, index)}>
        <BusRoot dataJson={trip} />
      </div>

      {/* More Info Button */}
      <div className="flex space-x-1 items-center w-[270px] bg-[#9bdfb1d0] rounded-b-md">
        <div
          onClick={() => handelPopup(index0, index)}
          className="flex w-[120px] space-x-1 items-center p-1 rounded-md cursor-pointer"
        >
          <Image
            src="/assets/icons/info_circl.svg"
            alt="info"
            width={12}
            height={12}
          />
          <p className="text-[#5376f6]">
            {status.setting?.lang === "en" ? "More info" : "ተጨማሪ መረጃ"}
          </p>
        </div>
      </div>

      {/* More Info Popup */}
      {crossIndex === index0 && crossIndexTwo === index && (
        <div className="absolute top-[0px] left-0 sm-mob w-[355px] px-2 pb-2 bg-[#c4fbcb] z-[30] rounded-md shadow-lg">
          <div className="flex justify-between items-center bg-[#a9ddbc] p-2 rounded-md -mx-2">
            <p className="font-bold text-gray-500">
              {status.setting?.lang === "en"
                ? "Travel details"
                : "የጉዞ ዝርዝር መረጃ"}
            </p>
            <Image
              onClick={() => handelPopup(-1, -2)}
              onMouseEnter={handelCross}
              onMouseLeave={handelCross}
              className="cursor-pointer"
              src={
                crossHover
                  ? "/assets/icons/cross_close_hover.svg"
                  : "/assets/icons/cross_close.svg"
              }
              alt="close"
              width={12}
              height={10}
            />
          </div>

          {/* Details */}
          <div className="flex space-x-2 sm:space-x-4 items-center mt-2 text-black text-[13px] sm:text-[16px]">
            <div className="text-center">
              <p>{trip.bus_code}</p>
              <p>{trip.plate_number}</p>
            </div>

            <div className="border-l-1 px-3">
              <div className="flex justify-center items-center text-center py-2">
                <p>
                  {status.setting?.lang === "en"
                    ? trip.source_city
                    : trip.source_city_amh}
                </p>
                <div className="px-2">
                  <p>{trip.distance} km</p>
                  <hr className="w-[70px] mx-auto" />
                  <p>~{trip.duration} h</p>
                </div>
                <p>
                  {status.setting?.lang === "en"
                    ? trip.destination_city
                    : trip.destination_city_amh}
                </p>
              </div>

              <hr className="border border-gray-400" />
              <p className="text-center text-[14px]">{trip.boarding_name}</p>

              <div className="flex items-center space-x-2 pt-4">
                <div className="w-[20px] h-[20px] bg-white rounded-full flex justify-center items-center">
                  <Image
                    src={getProviderLogo(providerId)}
                    alt="Logo"
                    width={20}
                    height={20}
                    unoptimized
                  />
                </div>
                <p>{formatProviderName(providerId, status.setting?.lang)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
