"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ActionButtons from "../commonComponent/TopActionBar/ActionButtons";
import DestinationHeader from "./DestinationHeader";
import TripTypeTabs from "./TripTypeTabs";
import TransportDropdown from "./TransportDropdown";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { useHomePageState } from "../home/hooks/useHomePageState";
import { useResultTopState } from "./hooks/useResultTopState";
import { useResultNavigation } from "./hooks/useResultNavigation";

interface ResultContentProps {
  sendDataToParent: (
    data: any,
    trip: "one-way" | "two-way",
    selectedProvider?: string
  ) => void;
  providersName: Array<{
    id: string | number;
    en: string;
    am: string;
    logo: string;
    type: string;
  }>;
}

export default function ResultContent({
  sendDataToParent,
  providersName,
}: ResultContentProps) {
  const { status } = useGlobalState();
  const {
    selectedCity,
    selectedCityTwo,
    selectedCityAmh,
    selectedCityTwoAmh,
    providers,
  } = useHomePageState();

  const searchParams = useSearchParams(); // ✅ now safe because "use client"

  const cityOne =
    status.setting?.lang === "en" ? selectedCity : selectedCityAmh;
  const cityTwo =
    status.setting?.lang === "en" ? selectedCityTwo : selectedCityTwoAmh;

  const {
    isOpen,
    setIsOpen,
    selectedBus,
    setSelectedBus,
    oneWay,
    roundTrip,
    isPencil,
    handelPencil,
    toggleDropdown,
    handel_one_way,
    handel_two_way,
    searchData,
  } = useResultTopState(sendDataToParent);

  const { handelBack } = useResultNavigation();

  return (
    <div
      className={`p-4 ${
        status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
      }`}
    >
      {/* Top bar */}
      <div
        className={`fixed top-16 left-0 w-full p-4 shadow-md ${
          status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
        } flex justify-between items-center z-30`}
      >
        <ActionButtons status={status} />
      </div>

      {/* Main top */}
      <div
        className={`mt-13 ${
          status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
        }`}
      >
        <DestinationHeader
          status={status}
          roundTrip={roundTrip}
          cityOne={cityOne}
          cityTwo={cityTwo}
          isPencil={isPencil}
          handelBack={handelBack}
          handelPencil={handelPencil}
        />

        <div className="flex space-x-2 sm:space-x-4">
          <TripTypeTabs
            status={status}
            oneWay={oneWay}
            roundTrip={roundTrip}
            handel_one_way={handel_one_way}
            handel_two_way={handel_two_way}
            searchParams={searchParams}
          />
          <TransportDropdown
            status={status}
            selectedBus={selectedBus}
            setSelectedBus={setSelectedBus}
            isOpen={isOpen}
            toggleDropdown={toggleDropdown}
            providersName={providersName}
            setIsOpen={setIsOpen}
            sendDataToParent={sendDataToParent}
            searchData={searchData}
            oneWay={oneWay}
          />
        </div>
      </div>
    </div>
  );
}
