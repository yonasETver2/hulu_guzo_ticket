import { useRef, useState } from "react";
import TripCard from "./TripCard";
import Image from "next/image";

import { CSSProperties } from "react";

interface Trip {
  bus_code_index: string | number;
  [key: string]: any; // other properties of trip
}

interface Status {
  setting?: {
    lang?: string;
    theme?: "light" | "dark";
  };
}

interface Props {
  providerId: string | number;
  trips: Record<"one-way" | "two-way", Trip[]>; // trips organized by trip type
  index0: number;
  tripType: "one-way" | "two-way";
  status: Status;
  styles: {
    scrollbar_hide?: string;
    [key: string]: string | undefined;
  };
  selectedOneWayTrip?: { uniqueId: string };
  selectedTwoWayTrip?: { uniqueId: string };
  handleCardClick: (
    trip: any,
    providerId: string,
    type: string,
    index: number
  ) => void;

  handelPopup?: (trip: Trip) => void;
  crossIndex?: number;
  crossIndexTwo?: number;
  crossHover?: boolean;
  handelCross?: (index: number) => void;
  getProviderLogo: (providerId: string | number) => string;
  formatProviderName: (providerId: string | number, lang?: string) => string;
}

const ProviderTripsRow = ({
  providerId,
  trips,
  index0,
  tripType,
  status,
  styles,
  selectedOneWayTrip,
  selectedTwoWayTrip,
  handleCardClick,
  handelPopup,
  crossIndex,
  crossIndexTwo,
  crossHover,
  handelCross,
  getProviderLogo,
  formatProviderName,
}: Props) => {
  // 🔹 Get trips for current trip type
  const tripList = trips?.[tripType] ?? [];
  const [leftArrowHover, setLeftArrowHover] = useState(false);
  const [rightArrowHover, setRightArrowHover] = useState(false);

  // 🔹 If no trips under this provider → render nothing
  if (!Array.isArray(tripList) || tripList.length === 0) {
    return null;
  }

  // 🔹 Ref for horizontal scrolling
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  const handleLeftArrowHover = () => {
    setLeftArrowHover(!leftArrowHover);
  };

  const handleRightArrowHover = () => {
    setRightArrowHover(!rightArrowHover);
  };

  return (
    <div className="px-4 space-y-3 py-2">
      {/* Provider name ONLY when trips exist */}
      <p className="font-bold">
        {formatProviderName(providerId, status.setting?.lang)}
      </p>

      <div className="relative">
        {/* LEFT ARROW */}
        <button
          onClick={scrollLeft}
          onMouseEnter={handleLeftArrowHover}
          onMouseLeave={handleLeftArrowHover}
          className={`cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-40 
                      shadow rounded-full p-2
                     hover:scale-105`}
        >
          <Image
            src={
              leftArrowHover === true
                ? "/assets/icons/angle_left_hover.svg"
                : status.setting?.theme === "light"
                ? "/assets/icons/angle_left_gray.svg"
                : "/assets/icons/angle_left_light_white.svg"
            }
            alt="arrow"
            width={24}
            height={24}
          />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={scrollRight}
          onMouseEnter={handleRightArrowHover}
          onMouseLeave={handleRightArrowHover}
          className={`cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-40  shadow rounded-full p-2
                     hover:scale-105`}
        >
          <Image
            src={
              rightArrowHover === true
                ? "/assets/icons/angle_right_hover.svg"
                : status.setting?.theme === "light"
                ? "/assets/icons/angle_right_gray.svg"
                : "/assets/icons/angle_right_light_white.svg"
            }
            alt="arrow"
            width={24}
            height={24}
          />
        </button>

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className={`overflow-x-auto flex space-x-3 ${styles.scrollbar_hide} px-8`}
        >
          {tripList.map((trip: any, index: number) => {
            const uniqueId = `${providerId}-${trip.bus_code_index}-${index}`;
            const isSelected =
              (tripType === "one-way" &&
                selectedOneWayTrip?.uniqueId === uniqueId) ||
              (tripType === "two-way" &&
                selectedTwoWayTrip?.uniqueId === uniqueId);

            return (
              <TripCard
                key={`${trip.bus_code_index}-${tripType}-${index}`}
                trip={trip}
                providerId={String(providerId)}
                type={tripType}
                index={index}
                index0={index0}
                status={status}
                isSelected={isSelected}
                handleCardClick={handleCardClick}
                handelPopup={(i: number | null, j: number | null) => {
                  if (i != null && j != null && handelPopup) {
                    const trip: Trip = {
                      index0: i,
                      index: j,
                      bus_code_index: `${i}-${j}`, // create a unique string or number
                    };
                    handelPopup(trip);
                  }
                }}
                crossIndex={crossIndex ?? null}
                crossIndexTwo={crossIndexTwo ?? null}
                crossHover={crossHover ?? false}
                handelCross={() => {
                  if (handelCross) {
                    handelCross(0); // or some index you want to pass
                  }
                }}
                getProviderLogo={getProviderLogo}
                formatProviderName={formatProviderName}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProviderTripsRow;
