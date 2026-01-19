import Image from "next/image";

const NavigationButtons = ({ status, handlePrev, handleNext }) => {
  return (
    <div className="flex justify-between cursor-pointer mt-4">
      <button
        onClick={handlePrev}
        className="flex justify-center cursor-pointer items-center space-x-2 bg-[#5376f6] hover:bg-[#5376f6a0] text-white px-4 py-1 rounded"
      >
        <Image
          src="/assets/icons/angle_left_white.svg"
          alt="arrow"
          width={14}
          height={12}
        />
        <p>{status.setting?.lang === "en" ? "Prev" : "ወደኋላ"}</p>
      </button>

      <button
        onClick={handleNext}
        className="flex justify-center cursor-pointer items-center space-x-2 bg-[#5376f6] hover:bg-[#5376f6a0] text-white px-4 py-1 rounded"
      >
        <p>{status.setting?.lang === "en" ? "Next" : "ቀጣይ"}</p>
        <Image
          src="/assets/icons/angle_white.svg"
          alt="arrow"
          width={14}
          height={12}
        />
      </button>
    </div>
  );
};

export default NavigationButtons;
