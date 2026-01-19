// globalContext/PassengerState.ts
import { createContext, useContext, useState, ReactNode } from "react";

// Define the state type
type PassengerStateType = {
  numberPassengerFirst: number;
  numberPassengerRound: number;
  setNumberPassengerFirst: (num: number) => void;
  setNumberPassengerRound: (num: number) => void;
  selectedSeatsFirstTrip: string[];
  selectedSeatsRoundTrip: string[];
  setSelectedSeatsFirstTrip: (seats: string[]) => void;
  setSelectedSeatsRoundTrip: (seats: string[]) => void;
};

// Create context
const PassengerContext = createContext<PassengerStateType | undefined>(
  undefined
);

// Provider component
export const PassengerProvider = ({ children }: { children: ReactNode }) => {
  const [numberPassengerFirst, setNumberPassengerFirst] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("numberPassengerFirst")) || 1;
    }
    return 1;
  });

  const [numberPassengerRound, setNumberPassengerRound] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("numberPassengerRound")) || 1;
    }
    return 1;
  });

  const [selectedSeatsFirstTrip, setSelectedSeatsFirstTrip] = useState<
    string[]
  >(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("selectedSeatsFirstTrip") || "[]");
    }
    return [];
  });

  const [selectedSeatsRoundTrip, setSelectedSeatsRoundTrip] = useState<
    string[]
  >(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("selectedSeatsRoundTrip") || "[]");
    }
    return [];
  });

  return (
    <PassengerContext.Provider
      value={{
        numberPassengerFirst,
        numberPassengerRound,
        setNumberPassengerFirst,
        setNumberPassengerRound,
        selectedSeatsFirstTrip,
        selectedSeatsRoundTrip,
        setSelectedSeatsFirstTrip,
        setSelectedSeatsRoundTrip,
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
};

// Hook to consume context safely
export const usePassengerState = () => {
  const context = useContext(PassengerContext);
  if (!context)
    throw new Error("usePassengerState must be used within PassengerProvider");
  return context;
};
