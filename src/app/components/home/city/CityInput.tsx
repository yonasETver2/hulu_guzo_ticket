import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import { useGlobalState } from "@/app/globalContext/GlobalState";

interface CityInputProps {
  labelEn: string;
  labelAm: string;
  placeholderEn: string;
  placeholderAm: string;
  iconLight: string;
  iconDark: string;
  value: string;
  valueAmh: string;
  isOpen: boolean;
  theme: "light" | "dark";
  onFocus: () => void;
  onChange: (val: string) => void;
  cityList: { en: string; am: string; option?: string }[];
  favoriteCities: { en: string; am: string; option?: string }[];
  searchedCities: { en: string; am: string; option?: string }[];
  allClick: boolean;
  fav: boolean;
  search: boolean;
  toggleFavorite: (city: { en: string; am: string; option?: string }) => void;
  handelCity: (city: { en: string; am: string; option?: string }) => void;
  handelAll: () => void;
  handelFav: () => void;
  handelSearch: () => void;
}

// types
type City = {
  en: string;
  am: string;
  option?: string; // ✅ optional
};

export const CityInput: FC<CityInputProps> = ({
  labelEn,
  labelAm,
  placeholderEn,
  placeholderAm,
  iconLight,
  iconDark,
  value,
  valueAmh,
  isOpen,
  theme,
  onFocus,
  onChange,
  cityList,
  favoriteCities,
  searchedCities,
  allClick,
  fav,
  search,
  toggleFavorite,
  handelCity,
  handelAll,
  handelFav,
  handelSearch,
}) => {
  const { status } = useGlobalState();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [localOpen, setLocalOpen] = useState(isOpen);
  const [filteredCities, setFilteredCities] = useState(cityList);

  // Sync with prop isOpen
  useEffect(() => {
    setLocalOpen(isOpen);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setLocalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities on input change
  useEffect(() => {
    const searchValue = status.setting?.lang === "en" ? value : valueAmh;
    if (!searchValue) {
      setFilteredCities(cityList);
    } else {
      const filtered = cityList.filter(
        (c) =>
          c.en.toLowerCase().includes(searchValue.toLowerCase()) ||
          c.am.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [value, valueAmh, cityList, status.setting?.lang]);

  const displayCities = allClick
    ? filteredCities
    : fav
    ? favoriteCities
    : search
    ? searchedCities
    : [];

  return (
    <div ref={wrapperRef}>
      <p className="text-[12px]">
        {status.setting?.lang === "en" ? labelEn : labelAm}
      </p>
      <div className="flex space-x-1">
        <Image
          src={theme === "light" ? iconLight : iconDark}
          alt="icon"
          width={30}
          height={30}
        />
        <input
          onFocus={() => {
            onFocus();
            setLocalOpen(true); // open dropdown on focus
          }}
          className="border-1 border-gray-300 rounded-md px-2"
          type="text"
          placeholder={
            status.setting?.lang === "en" ? placeholderEn : placeholderAm
          }
          value={status.setting?.lang === "en" ? value : valueAmh}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {localOpen && (
        <div
          className={`absolute z-40 w-65 h-50 overflow-auto pb-2 mt-2 border border-gray-400 rounded-md shadow-md ${
            theme === "light" ? "bg-gray-50" : "bg-gray-600"
          }`}
        >
          {/* Dropdown Header */}
          <div
            className={`flex justify-center items-center pt-2 px-2 space-x-3 fixed pb-1 border-b-2 border-gray-300 ${
              theme === "light" ? "bg-gray-50" : "bg-gray-600"
            }`}
          >
            <button
              onClick={handelAll}
              className={`${
                allClick ? "border-b-2 border-[#5376f6]" : ""
              } cursor-pointer py-0.5`}
            >
              {status.setting?.lang === "en" ? "All Root" : "ሁሉም መስመሮች"}
            </button>
            <button
              onClick={handelFav}
              className={`${
                fav ? "border-b-2 border-[#5376f6]" : ""
              } cursor-pointer`}
            >
              <span className="text-lg text-yellow-400">★</span>{" "}
              {status.setting?.lang === "en" ? "Favorite" : "ተወዳጅ"}
            </button>
            <button
              onClick={handelSearch}
              className={`flex justify-center items-center ${
                search ? "border-b-2 border-[#5376f6]" : ""
              } cursor-pointer`}
            >
              <span className="text-sm">🔎</span>
              <span>
                {status.setting?.lang === "en" ? "Searched" : "የተፈለገ"}
              </span>
            </button>
          </div>

          {/* City List */}
          <div className="mt-12">
            {displayCities.length > 0 ? (
              displayCities.map((cityItem, idx) => {
                const city: City = {
                  en: cityItem.en,
                  am: cityItem.am,
                  option: cityItem.option ?? "", // ✅ optional fallback
                };

                return (
                  <button
                    key={`${city.en}-${idx}`}
                    onClick={() => {
                      handelCity(city);
                      setLocalOpen(false);
                    }}
                    className="p-2 w-full text-left border-t border-gray-300 hover:border-l-4 hover:border-[#5376f6]"
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(city);
                      }}
                      className={`text-lg ${
                        favoriteCities.some((c) => c.en === city.en)
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      ★
                    </span>{" "}
                    {status.setting?.lang === "en" ? city.en : city.am}
                  </button>
                );
              })
            ) : (
              <p className="p-2 text-gray-500">
                {status.setting?.lang === "en"
                  ? "No results found"
                  : "የተመረጡ ከተሞች የሉም"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
