const PassengerHeader = ({
  status,
  currentIndex,
  passengerCount,
  tripType,
}) => {
  return (
    <div
      className={`flex justify-between font-semibold mb-3 fixed top-25 py-2 w-full -ml-5 px-4 ${
        status.setting?.theme === "light" ? "bg-gray-100" : "bg-gray-700"
      }`}
    >
      <p className="text-lg">
        {status.setting?.lang === "en" ? "Passenger" : "ተጓዥ"}{" "}
        {currentIndex + 1} {status.setting?.lang === "en" ? "of" : "ከ"}{" "}
        {passengerCount}
      </p>

      <p className="text-[#5376f6]">
        {tripType === "one-way"
          ? status.setting?.lang === "en"
            ? "First Trip"
            : "የመጀመሪያ ጉዞ"
          : status.setting?.lang === "en"
          ? "Round Trip"
          : "የመመለሻ ጉዞ"}
      </p>
    </div>
  );
};

export default PassengerHeader;
