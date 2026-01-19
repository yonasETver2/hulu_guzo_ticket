import { FC } from "react";

interface ExchangeButtonProps {
  exHover: boolean;
  exchange: boolean;
  theme: "light" | "dark";
  handelExClick: () => void;
  handelExHover: () => void;
}

export const ExchangeButton: FC<ExchangeButtonProps> = ({
  exHover,
  exchange,
  theme,
  handelExClick,
  handelExHover,
}) => {
  return (
    <div className="sm:flex pl-32 sm:pl-0 sm:justify-center sm:items-center pt-4 px-2">
      <div
        onClick={handelExClick}
        onMouseEnter={handelExHover}
        onMouseLeave={handelExHover}
        className={`border-1 border-gray-400 rounded-full w-[30px] h-[30px] cursor-pointer flex items-center justify-center ${
          exHover === false
            ? theme === "light"
              ? "text-black"
              : "text-white"
            : "text-[#5376f6]"
        }`}
      >
        {exchange === false ? (
          <div>
            {/* Desktop: → on top, ← below */}
            <p className="hidden sm:block text-center text-[12px]">&#x2192;</p>
            <p className="hidden sm:block -mt-2 text-center text-[12px]">
              &#x2190;
            </p>

            {/* Mobile: ↓ and ↑ side by side */}
            <div className="flex sm:hidden justify-center items-center gap-x-1 text-[12px]">
              <span>&#x2193;</span>
              <span>&#x2191;</span>
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop: → on top, ← below */}
            <p className="hidden sm:block text-center text-[12px]">&#x2190;</p>
            <p className="hidden sm:block -mt-2 text-center text-[12px]">
              &#x2192;
            </p>

            {/* Mobile: ↓ and ↑ side by side */}
            <div className="flex sm:hidden justify-center items-center gap-x-1 text-[12px]">
              <span>&#x2191;</span>
              <span>&#x2193;</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
