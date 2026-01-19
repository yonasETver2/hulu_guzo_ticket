import Image from "next/image";

const StationSeat = ({
  status,
  stationOptions,
  selectedStation,
  setSelectedStation,
  loadingStations,
  seats,
  currentIndex,
}) => {
  return (
    <div className="w-full md:w-[20%] md:space-y-2">
      <div>
        <label>
          {status.setting?.lang === "en" ? "Boarding Station" : "የመሳፈሪያ ቦታ"}
        </label>

        <select
          value={selectedStation?.station_name || ""}
          onChange={(e) =>
            setSelectedStation(
              stationOptions.find((s) => s.station_name === e.target.value) ||
                null
            )
          }
          className="w-full border p-2 rounded"
        >
          <option
            value=""
            className={`${
              status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-600"
            } rounded-md border-1`}
          >
            {status.setting?.lang === "en" ? "Select station" : "መሳፈሪያ ይምረጡ"}
          </option>

          {loadingStations ? (
            <option>
              {status.setting?.lang === "en" ? "Loading..." : "በመጫን ላይ..."}
            </option>
          ) : stationOptions.length > 0 ? (
            stationOptions.map((station, idx) => (
              <option
                key={idx}
                value={station.station_name}
                className={`${
                  status.setting?.theme === "light"
                    ? "bg-gray-50"
                    : "bg-gray-600"
                } rounded-md border-1`}
              >
                {station.station_name}
              </option>
            ))
          ) : (
            <option disabled>No stations found</option>
          )}
        </select>

        {/* Radio Buttons */}
        <div className="flex space-x-4 mt-2">
          {stationOptions.map((station, idx) => {
            const name = station?.station_name || "";

            if (!name) return null;

            const initials = name.includes(" ")
              ? name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase())
                  .join("")
              : name.slice(0, 2).toUpperCase();

            return (
              <label key={idx} className="flex flex-col items-center">
                <input
                  type="radio"
                  name="boarding"
                  checked={selectedStation?.station_name === name}
                  onChange={() => setSelectedStation(station)}
                  className="cursor-pointer"
                />
                <span className="text-[13px]">{initials}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Seat */}
      <div>
        <label>{status.setting?.lang === "en" ? "Seat" : "ወንበር"}</label>
        <p
          className={`w-full border p-2 rounded ${
            status.setting?.theme === "light" ? "bg-gray-100" : "bg-gray-600"
          } flex justify-between`}
        >
          <Image
            src={
              status.setting?.theme === "light"
                ? "/assets/icons/seat.svg"
                : "/assets/icons/seat_white.svg"
            }
            alt="seat"
            width={18}
            height={12}
          />
          {seats[currentIndex] || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default StationSeat;
