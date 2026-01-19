import Image from "next/image";

interface Props {
  status: any;
  selectedBus: string;
  setSelectedBus: (val: string) => void;
  isOpen: boolean;
  toggleDropdown: () => void;
  providersName: any[];
  setIsOpen: (val: boolean) => void;
  sendDataToParent: (
    searchData: any,
    tripType: "one-way" | "two-way",
    provider?: string
  ) => void; // ✅ updated
  searchData: any;
  oneWay: boolean;
}


const TransportDropdown = ({
  status,
  selectedBus,
  setSelectedBus,
  isOpen,
  toggleDropdown,
  providersName,
  setIsOpen,
  sendDataToParent,
  searchData,
  oneWay,
}: Props) => {
  return (
    <div className="flex space-x-2 justify-center items-center mt-4">
      <p>{status.setting?.lang === "en" ? "Transport" : "መጓጓዣ"}</p>

      <div className="relative">
        <div
          className={`flex items-center border border-gray-400 px-2 pr-3 rounded-md w-37 md:w-48 ${
            status.setting?.theme === "light"
              ? "bg-gray-50"
              : "bg-gray-700"
          }`}
        >
          <input
            type="text"
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            className="outline-none w-full bg-transparent"
            placeholder={
              status.setting?.lang === "en"
                ? "Select | type"
                : "ይምረጡ | ይጥፃፉ"
            }
          />
          <Image
            onClick={toggleDropdown}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-270" : "rotate-90"
            } cursor-pointer`}
            src="/assets/icons/arrow_right.png"
            width={8}
            height={8}
            alt="arrow"
          />
        </div>

        {isOpen && (
          <div
            className={`absolute z-30 w-full md:w-48 p-2 mt-2 border border-gray-400 rounded-md max-h-40 overflow-y-auto ${
              status.setting?.theme === "light"
                ? "bg-gray-50"
                : "bg-gray-600"
            } shadow-md`}
          >
            {providersName.map((provider) => {
              const name =
                status.setting?.lang === "en"
                  ? provider.en
                  : provider.am;

              return (
                <div
                  key={provider.id}
                  onClick={() => {
                    setSelectedBus(name);
                    setIsOpen(false);
                    sendDataToParent(
                      searchData,
                      oneWay ? "one-way" : "two-way",
                      name
                    );
                  }}
                  className={`p-2 hover:border-l-4 hover:border-[#5376f6] cursor-pointer ${
                    status.setting?.theme === "light"
                      ? "hover:bg-[#f0f4ff]"
                      : "hover:bg-[#a4b7f9]"
                  }`}
                >
                  {name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportDropdown;
