import Image from "next/image";
import {
  formatEthiopianDate,
  formatEthiopianTime,
  parseAmPmTime,
} from "@/tools/constant";

const TeleBirrPayment = ({
  status,
  total,
  trips,
  handleSendTrips,
  loading,
}) => {
  return (
    <div
      className={`w-full md:w-[40%] flex justify-center border ${
        status.setting?.theme === "light"
          ? "border-gray-200"
          : "border-gray-400"
      } rounded-md shadow-md ${
        status.setting?.theme === "light" ? "bg-white" : "bg-gray-900"
      } p-4`}
    >
      <div className="space-y-4 w-full text-center">
        <p className="text-[18px] font-semibold">
          {status.setting?.lang === "en" ? "Tele Birr" : "ቴሌ ብር"}
        </p>

        <div className="flex justify-center">
          <div className="w-[150px]">
            <p className="text-start text-[13px]">
              <span className="font-semibold">
                {status.setting?.lang === "en" ? " ETB" : "ብር"}{" "}
              </span>
              <span className="text-[#5376f6] font-semibold">
                {total.toLocaleString()}
              </span>{" "}
            </p>
            <Image
              src="/assets/images/bank/telebir.png"
              width={150}
              height={150}
              alt="Tele Birr QR Code"
            />
          </div>
        </div>

        <div className="space-y-3">
          {trips.map((trip, idx) => {
            const tickets = trip.passengers?.length || 0;
            const amount = tickets * (trip.price_per_passenger || 0);
            return (
              <div key={idx} className="border-b border-gray-200 pb-2">
                <p>
                  <span className="text-[#5376f6] font-semibold">
                    {idx === 0
                      ? status.setting?.lang === "en"
                        ? "First trip"
                        : "የመጀመሪያ ጉዞ"
                      : status.setting?.lang === "en"
                      ? "Round trip"
                      : "የመመለሻ ጉዞ"}
                  </span>{" "}
                  {status.setting?.lang === "en"
                    ? `${tickets} tickets ${amount.toLocaleString()} birr`
                    : `${tickets} ትኬት ${amount.toLocaleString()} ብር`}
                </p>

                <p className="text-sm text-gray-600">
                  {status.setting?.lang === "en" ? "From:" : "ከ፡"}{" "}
                  <span className="font-semibold">
                    {status.setting?.lang === "en"
                      ? trip.source_city
                      : trip.source_city_amh}
                  </span>{" "}
                  {status.setting?.lang === "en" ? "To:" : "ወደ፡"}{" "}
                  <span className="font-semibold">
                    {status.setting?.lang === "en"
                      ? trip.destination_city
                      : trip.destination_city_amh}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {status.setting?.lang === "en"
                      ? trip.trip_sort_date
                        ? new Date(trip.trip_sort_date).toDateString()
                        : "N/A"
                      : formatEthiopianDate(new Date(trip.trip_sort_date))}
                    &nbsp;(
                    {status.setting?.lang === "en"
                      ? trip.time
                      : formatEthiopianTime(parseAmPmTime(trip.time))}
                    )
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleSendTrips("TeleBirr")}
            disabled={loading}
            className="px-16 py-1 bg-[#5376f6] hover:bg-[#5376f6a0] rounded-md text-white cursor-pointer"
          >
            {status.setting?.lang === "en" ? "Pay Tele Birr" : "በቴሌ ብር ይክፈሉ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeleBirrPayment;
