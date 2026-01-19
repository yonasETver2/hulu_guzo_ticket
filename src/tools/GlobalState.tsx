"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for the context
interface Passenger {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  sex: string;
  station?: string;
  seat?: string;
  nationalID?: string;
  fullName?: string; // Add fullName as optional
}

type PassengersData = {
  firstTrip: Passenger[];
  roundTrip: Passenger[];
};

type SeatsData = {
  firstTrip: Set<string>;
  roundTrip: Set<string>;
};

type GlobalContextType = {
  passengersData: PassengersData;
  passengerCount: { firstTrip: number; roundTrip: number };
  updatePassengers: (
    trip: "firstTrip" | "roundTrip",
    data: Passenger[]
  ) => void;
  updatePassengerCount: (
    trip: "firstTrip" | "roundTrip",
    count: number
  ) => void;
  seatsData: SeatsData;
  updateSeats: (trip: "firstTrip" | "roundTrip", seatSet: Set<string>) => void;
};

// Create the context with a default value of `undefined`
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Define the GlobalStateProvider component
export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [passengersData, setPassengersData] = useState<PassengersData>({
    firstTrip: [],
    roundTrip: [],
  });

  const [passengerCount, setPassengerCount] = useState<{
    firstTrip: number;
    roundTrip: number;
  }>({
    firstTrip: 0,
    roundTrip: 0,
  });

  const [seatsData, setSeatsData] = useState<SeatsData>({
    firstTrip: new Set(),
    roundTrip: new Set(),
  });

  // Update passengers data
  const updatePassengers = (
    trip: "firstTrip" | "roundTrip",
    data: Passenger[]
  ) => {
    setPassengersData((prev) => ({ ...prev, [trip]: data }));
  };

  // Update passenger count
  const updatePassengerCount = (
    trip: "firstTrip" | "roundTrip",
    count: number
  ) => {
    setPassengerCount((prev) => ({ ...prev, [trip]: count }));
  };

  // Update seats data
  const updateSeats = (
    trip: "firstTrip" | "roundTrip",
    seatSet: Set<string>
  ) => {
    setSeatsData((prev) => ({ ...prev, [trip]: new Set(seatSet) }));
  };

  // Store reserved seats in localStorage
  useEffect(() => {
    localStorage.setItem(
      "userReservedSeatsFirstTrip",
      JSON.stringify([...seatsData.firstTrip])
    );
  }, [seatsData.firstTrip]);

  useEffect(() => {
    localStorage.setItem(
      "userReservedSeatsRoundTrip",
      JSON.stringify([...seatsData.roundTrip])
    );
  }, [seatsData.roundTrip]);

  return (
    <GlobalContext.Provider
      value={{
        passengersData,
        passengerCount,
        updatePassengers,
        updatePassengerCount,
        seatsData,
        updateSeats,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook to access the global state
export const useGlobalStateTwo = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalStateTwo must be used within GlobalStateProvider"
    );
  }
  return context;
};
