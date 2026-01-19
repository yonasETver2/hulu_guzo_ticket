// components/TransportModes.tsx
import Image from "next/image";
import Link from "next/link";

interface TransportModesProps {
  status: any;

  carClick: boolean;
  bicycleClick: boolean;
  walkingClick: boolean;

  carToggle: boolean;
  bicycleToggle: boolean;
  personToggle: boolean;

  onCarClick: () => void;
  onBicycleClick: () => void;
  onWalkingClick: () => void;

  toggleCar: () => void;
  toggleBicycle: () => void;
  togglePerson: () => void;
}

export default function TransportModes({
  status,
  carClick,
  bicycleClick,
  walkingClick,
  carToggle,
  bicycleToggle,
  personToggle,
  onCarClick,
  onBicycleClick,
  onWalkingClick,
  toggleCar,
  toggleBicycle,
  togglePerson,
}: TransportModesProps) {
  return (
    <div className="flex justify-between w-full">
      <div className="flex justify-center space-x-4">
        <Image
          onClick={onCarClick}
          onMouseEnter={toggleCar}
          onMouseLeave={toggleCar}
          className="cursor-pointer"
          src={
            carToggle || carClick
              ? "/assets/icons/car_front_fill_hover.svg"
              : status.setting?.theme === "light"
              ? "/assets/icons/car_front_fill.svg"
              : "/assets/icons/car_front_fill_white.svg"
          }
          alt="car"
          width={24}
          height={24}
        />

        <Image
          onClick={onBicycleClick}
          onMouseEnter={toggleBicycle}
          onMouseLeave={toggleBicycle}
          className="cursor-pointer"
          src={
            bicycleToggle || bicycleClick
              ? "/assets/icons/bicycle_hover.svg"
              : status.setting?.theme === "light"
              ? "/assets/icons/bicycle.svg"
              : "/assets/icons/bicycle_white.svg"
          }
          alt="bicycle"
          width={24}
          height={24}
        />

        <Image
          onClick={onWalkingClick}
          onMouseEnter={togglePerson}
          onMouseLeave={togglePerson}
          className="cursor-pointer"
          src={
            personToggle || walkingClick
              ? "/assets/icons/person_walking_hover.svg"
              : status.setting?.theme === "light"
              ? "/assets/icons/person_walking.svg"
              : "/assets/icons/person_walking_white.svg"
          }
          alt="walking"
          width={24}
          height={24}
        />
      </div>

      <div
        className={`${
          status.setting?.theme === "light"
            ? "bg-[#5376f6] hover:bg-[#5376f6a0]"
            : "bg-[#53baf6] hover:bg-[#608faa]"
        } flex justify-center items-center w-[24px] h-[24px] cursor-pointer rounded-full`}
      >
        <Link href="/pages/call">
          <Image
            src="/assets/icons/phone.svg"
            alt="phone"
            width={15}
            height={15}
          />
        </Link>
      </div>
    </div>
  );
}
