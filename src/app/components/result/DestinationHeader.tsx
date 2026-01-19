import Image from "next/image";

interface Props {
  status: any;
  roundTrip: boolean;
  cityOne: string;
  cityTwo: string;
  isPencil: boolean;
  handelBack: () => void;
  handelPencil: () => void;
}

const DestinationHeader = ({
  status,
  roundTrip,
  cityOne,
  cityTwo,
  isPencil,
  handelBack,
  handelPencil,
}: Props) => {
  return (
    <div className="flex space-x-2 pb-2">
      <p>{roundTrip === false ? cityOne : cityTwo}</p>

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

      <div className="flex items-center space-x-1 cursor-pointer">
        <p>{roundTrip === true ? cityOne : cityTwo}</p>
        <Image
          onClick={handelBack}
          onMouseEnter={handelPencil}
          onMouseLeave={handelPencil}
          src={
            isPencil
              ? "/assets/icons/pencil_btn_hover.svg"
              : status.setting?.theme === "light"
              ? "/assets/icons/pencil_btn.svg"
              : "/assets/icons/pencil_btn_white.svg"
          }
          alt="edit"
          width={12}
          height={12}
        />
      </div>
    </div>
  );
};

export default DestinationHeader;
