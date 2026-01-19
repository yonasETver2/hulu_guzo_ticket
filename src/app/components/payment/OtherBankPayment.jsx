import Image from "next/image";

const OtherBankPayment = ({ status, total, handleSendTrips, loading }) => {
  const banks = [
    { name: "CBE", img: "/assets/images/bank/cbeBank.jpeg" },
    { name: "Awash", img: "/assets/images/bank/awashBank.png" },
    { name: "Abyssinia", img: "/assets/images/bank/abyssiniaBank.png" },
    { name: "Dashen", img: "/assets/images/bank/dashenBank.png" },
  ];

  return (
    <div
      className={`*:w-full md:w-[50%] flex justify-center ${
        status.setting?.theme === "light" ? "bg-white" : "bg-gray-900"
      } p-4`}
    >
      <div className="space-y-4 text-center w-full">
        <p className="text-[18px] font-semibold">
          {status.setting?.lang === "en" ? "Other Bank" : "ሌላ ባንክ"}
        </p>
        <p>
          {status.setting?.lang === "en" ? "Please pay" : "እባኮ"}{" "}
          <span className="font-semibold text-[#5376f6]">{total.toLocaleString()}</span>{" "}
          {status.setting?.lang === "en"
            ? "birr to one of this banks"
            : "ብር፣ ከዚህ በታች ባሉት ባንኮች ይክፈሉ"}
        </p>

        <div className="space-y-4">
          {[0, 2].map((row) => (
            <div key={row} className="space-x-4">
              {banks.slice(row, row + 2).map((bank) => (
                <button
                  key={bank.name}
                  className="w-24 h-24 overflow-hidden rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-200 cursor-pointer"
                  onClick={() => handleSendTrips(bank.name)}
                  disabled={loading}
                >
                  <Image
                    src={bank.img}
                    width={100}
                    height={100}
                    alt={bank.name}
                    className="w-full h-full"
                  />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherBankPayment;
