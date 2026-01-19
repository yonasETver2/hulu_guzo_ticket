"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { useGlobalStateTwo } from "@/tools/GlobalState";
import { useHomePageState } from "../home/hooks/useHomePageState";
import TopHeader from "./TopHeader";
import PassengerHeader from "../seats/PassengerHeader";
import PassengerInputs from "./PassengerInputs";
import StationSeat from "./StationSeat";
import NavigationButtons from "./NavigationButtons";

// Define Passenger type here
interface Passenger {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  sex: string;
  station?: string;
  seat?: string;
  nationalID?: string;
}

function PersonIn() {
  const { status } = useGlobalState();
  const { selectedCity, selectedCityAmh, selectedCityTwo, selectedCityTwoAmh } =
    useHomePageState();
  const { passengersData, updatePassengers } = useGlobalStateTwo();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tripType = searchParams.get("tripType") || "one-way";
  const cityOne = selectedCity;
  const cityTwo = selectedCityTwo;

  const displayCityOne =
    status.setting?.lang === "en" ? selectedCity : selectedCityAmh;
  const displayCityTwo =
    status.setting?.lang === "en" ? selectedCityTwo : selectedCityTwoAmh;

  const numberPassenger = parseInt(searchParams.get("numPass") || "0");
  const numberPassengerTwo = parseInt(searchParams.get("numPassTwo") || "0");
  const seatsParam = searchParams.get("seats") || "";
  const seats = seatsParam.split(",").filter(Boolean);
  const provider_id = parseInt(searchParams.get("provider_id") || "0");

  const tripKey = tripType === "one-way" ? "firstTrip" : "roundTrip";
  const passengerCount =
    tripKey === "firstTrip" ? numberPassenger : numberPassengerTwo;

  // Initialize passengers with correct typing
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>(  
    passengersData[tripKey]?.length === passengerCount
      ? passengersData[tripKey]
      : Array.from({ length: passengerCount }, () => ({
          firstName: "",
          middleName: "", // Default empty string
          lastName: "",
          phone: "",
          nationalID: "",
          sex: "",
          station: "",
          seat: "N/A", // Default seat value
        }))
  );

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [sex, setSex] = useState("");
  const [selectedStation, setSelectedStation] = useState<any>(null);

  const [stationOptions, setStationOptions] = useState<any[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoadingStations(true);

        const url =
          tripType === "one-way"
            ? `/api/getStation?source_city=${encodeURIComponent(
                cityOne
              )}&destination_city=${encodeURIComponent(
                cityTwo
              )}&provider_id=${provider_id}`
            : `/api/getStation?source_city=${encodeURIComponent(
                cityTwo
              )}&destination_city=${encodeURIComponent(
                cityOne
              )}&provider_id=${provider_id}`;

        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          const uniqueStations = Array.from(
            new Map(data.map((s: any) => [s.station_name, s])).values()
          );
          setStationOptions(uniqueStations);
        } else {
          setStationOptions([]);
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
        setStationOptions([]);
      } finally {
        setLoadingStations(false);
      }
    };

    fetchStations();
  }, [cityOne, cityTwo, provider_id, tripType]);

  useEffect(() => {
    const passenger = passengers[currentIndex];
    if (passenger) {
      setFirstName(passenger.firstName || "");
      setMiddleName(passenger.middleName || ""); // Default empty string
      setLastName(passenger.lastName || "");
      setPhone(passenger.phone || "");
      setNationalID(passenger.nationalID || "");
      setSex(passenger.sex || "");
      setSelectedStation(
        stationOptions.find((s) => s.station_name === passenger.station) || null
      );
    }
  }, [currentIndex, passengers, stationOptions]);

  const handleNext = () => {
    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !phone ||
      !sex ||
      !selectedStation
    ) {
      alert(
        status.setting?.lang === "en"
          ? "Please fill in all fields before proceeding."
          : "እባኮን ከመቀጠሎ በፊት ሁሉንም ቦታዎች ይሙሉ"
      );
      return;
    }

    const newPassenger: Passenger = {
      firstName,
      middleName,
      lastName,
      phone,
      nationalID,
      sex,
      station: selectedStation.station_name, // ✅ English stored
      seat: seats[currentIndex] || "N/A",
    };

    // You can create the fullName dynamically here
    const fullName = `${firstName} ${middleName} ${lastName}`;

    const updatedPassengers = [...passengers];
    updatedPassengers[currentIndex] = newPassenger;
    setPassengers(updatedPassengers);
    updatePassengers(tripKey, updatedPassengers);

    currentIndex + 1 < passengerCount
      ? setCurrentIndex(currentIndex + 1)
      : router.back();
  };

  const handlePrev = () =>
    currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  return (
    <div className="p-4 md:h-[530px] overflow-y-auto">
      <TopHeader
        status={status}
        tripType={tripType}
        cityOne={displayCityOne}
        cityTwo={displayCityTwo}
      />

      <div className="mt-10 border-b-1 border-gray-200 py-4 shadow-md rounded p-1">
        <PassengerHeader
          status={status}
          currentIndex={currentIndex}
          passengerCount={passengerCount}
          tripType={tripType}
        />

        <div className="w-full md:flex space-x-6 space-y-3 mt-3">
          <PassengerInputs
            {...{
              status,
              firstName,
              setFirstName,
              middleName,
              setMiddleName,
              lastName,
              setLastName,
              sex,
              setSex,
              phone,
              setPhone,
              nationalID,
              setNationalID,
            }}
          />

          <StationSeat
            status={status}
            stationOptions={stationOptions}
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
            loadingStations={loadingStations}
            seats={seats}
            currentIndex={currentIndex}
          />

          <NavigationButtons
            status={status}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
}

export default function PersonInfo() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonIn />
    </Suspense>
  );
}
