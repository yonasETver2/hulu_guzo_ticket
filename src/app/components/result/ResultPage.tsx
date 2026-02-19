"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./result.module.css";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { useHomePageState } from "../home/hooks/useHomePageState";
import ResultHeaderAction from "./ResultHeaderAction";
import ProviderTripsRow from "./ProviderTripsRow";
import { useTripSelection } from "./hooks/useTripSelection";
import { useProviders } from "./hooks/useProviders";
import { useTripNavigation } from "./hooks/useTripNavigation";

// Lazy load ResultContent, SSR disabled
const ResultContent = dynamic(() => import("./ResultContent"), { ssr: false });

export default function ResultPage() {
  const searchParams = useSearchParams(); // ✅ safe inside component
  const { status } = useGlobalState();
  const home = useHomePageState();

  // -------------------------
  // Hooks (must always run)
  // -------------------------
  const {
    crossIndex,
    crossIndexTwo,
    crossHover,
    selectedOneWayTrip,
    selectedTwoWayTrip,
    handleCardClick,
    handelPopup,
    handelCross,
  } = useTripSelection();

  const { providerList, formatProviderName, getProviderLogo } = useProviders(
    status.setting?.lang,
  );

  const [tripType, setTripType] = useState<"one-way" | "two-way">(
    (searchParams.get("tripType") as "one-way" | "two-way") || "one-way",
  );
  const [dataFromChild, setDataFromChild] = useState<any>({});
  const [selectedBus, setSelectedBus] = useState("");

  const { handleClickInfo } = useTripNavigation({
    status,
    tripType,
    selectedOneWayTrip,
    selectedTwoWayTrip,
    ...home,
  });

  const handleChildData = (
    data: any,
    trip: "one-way" | "two-way",
    selectedProvider?: string,
  ) => {
    setDataFromChild(data);
    setTripType(trip);
    if (selectedProvider) setSelectedBus(selectedProvider);
  };

  // -------------------------
  // Derived data
  // -------------------------
  const sortedProviders = useMemo(() => {
    if (!dataFromChild) return [];
    const selectedProviderId = providerList.find(
      (p) => (status.setting?.lang === "en" ? p.en : p.am) === selectedBus,
    )?.id;

    const entries = Object.entries(dataFromChild);
    if (!selectedProviderId) return entries;

    return [...entries].sort(([idA], [idB]) => {
      if (String(idA) === String(selectedProviderId)) return -1;
      if (String(idB) === String(selectedProviderId)) return 1;
      return 0;
    });
  }, [dataFromChild, selectedBus, providerList, status.setting?.lang]);

  const hasAnyTrips = sortedProviders.some(
    ([, trips]: any) =>
      Array.isArray(trips?.[tripType]) && trips[tripType].length > 0,
  );

  // -------------------------
  // JSX
  // -------------------------
  return (
    <>
      {/* Top fixed ResultContent */}
      <div className="fixed z-40 w-full bg-white">
        <ResultContent
          sendDataToParent={handleChildData}
          providersName={providerList}
        />
      </div>

      {/* Trips list */}
      <div className="mt-40 md:h-[350px] overflow-auto md:pb-14">
        <ResultHeaderAction
          tripType={tripType}
          handleClickInfo={handleClickInfo}
          status={status}
        />

        {/* No trips message OR provider rows */}
        {!hasAnyTrips ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500 font-semibold">
              {status.setting?.lang === "en"
                ? "There is no trip available, please change trip"
                : "ምንም ጉዞ አልተገኘም፣ እባኮትን ጉዞ ይቀይሩ"}
            </p>
          </div>
        ) : (
          sortedProviders.map(([providerId, trips]: any, index0) => (
            <ProviderTripsRow
              key={providerId}
              providerId={providerId}
              trips={trips}
              index0={index0}
              tripType={tripType}
              status={status}
              styles={styles}
              selectedOneWayTrip={selectedOneWayTrip}
              selectedTwoWayTrip={selectedTwoWayTrip}
              handleCardClick={handleCardClick}
              handelPopup={handelPopup}
              crossIndex={crossIndex}
              crossIndexTwo={crossIndexTwo}
              crossHover={crossHover}
              handelCross={handelCross}
              getProviderLogo={getProviderLogo}
              formatProviderName={formatProviderName}
            />
          ))
        )}
      </div>
    </>
  );
}
