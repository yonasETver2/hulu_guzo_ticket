"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useTripNavigation({
  status,
  tripType,
  selectedOneWayTrip,
  selectedTwoWayTrip,
  selectedCity,
  selectedCityTwo,
  selectedCityAmh,
  selectedCityTwoAmh,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Proceed to seats (UNCHANGED)
  const handleClickInfo = () => {
    const cityOne =
      status.setting?.lang === "en" ? selectedCity : selectedCityAmh;
    const cityTwo =
      status.setting?.lang === "en" ? selectedCityTwo : selectedCityTwoAmh;

    const numPass = searchParams.get("numPass") || "1";
    const numPassTwo = searchParams.get("numPassTwo") || "1";

    if (tripType === "one-way" && !selectedOneWayTrip) {
      alert(
        status.setting?.lang === "en"
          ? "⚠️ Please select your trip first."
          : "⚠️ እባኮን ጉዞዎን መጀመሪያ ይምረጡ።"
      );
      return;
    }

    if (tripType === "two-way") {
      if (!selectedOneWayTrip && !selectedTwoWayTrip) {
        alert(
          status.setting?.lang === "en"
            ? "⚠️ Please select both your onward and return trips."
            : "⚠️ እባኮን መሄጃ እና መመለሻ ጉዞዎን ይምረጡ።"
        );
        return;
      }
      if (!selectedOneWayTrip) {
        alert(
          status.setting?.lang === "en"
            ? "⚠️ Please select the first trip."
            : "⚠️ እባኮን የመጀመሪያ ጉዞዎን ይምረጡ።"
        );
        return;
      }
      if (!selectedTwoWayTrip) {
        alert(
          status.setting?.lang === "en"
            ? "⚠️ Please select the return trip."
            : "⚠️ እባኮን የመመለሻ ጉዞዎን ይምረጡ።"
        );
        return;
      }
    }

    const selectedData =
      tripType === "one-way"
        ? selectedOneWayTrip
        : { one: selectedOneWayTrip, two: selectedTwoWayTrip };

    const selectedDataParam = encodeURIComponent(JSON.stringify(selectedData));
    sessionStorage.setItem("selectedTrips", JSON.stringify(selectedData));

    router.push(
      `/components/seats?cityOne=${cityOne}&cityTwo=${cityTwo}&numPass=${numPass}&numPassTwo=${numPassTwo}&tripType=${tripType}&providerId=${
        tripType === "one-way"
          ? selectedOneWayTrip.providerId
          : `${selectedOneWayTrip.providerId},${selectedTwoWayTrip.providerId}`
      }&selectedData=${selectedDataParam}`
    );
  };

  return { handleClickInfo };
}
