"use client";
import { useEffect, useState } from "react";

interface Trip {
  bus_code_index: string | number;
  seats?: any[]; // could refine later
  price_per_passenger?: number;
  passengers?: any[];
  index?: number; // optional, depending on your usage
  index0?: number; // optional
  [key: string]: any; // for other dynamic fields
}

export function useTripSelection() {
 const [crossIndex, setCrossIndex] = useState<number | undefined>(undefined);

  const [crossIndexTwo, setCrossIndexTwo] =  useState<number | undefined>(undefined);

  //for closs close
  const [crosClose, setCrossClose] = useState<number | undefined>(-1);
  const [crossHover, setCrossHover] = useState(false);
  const [selectedOneWayTrip, setSelectedOneWayTrip] = useState<any>(null);
  const [selectedTwoWayTrip, setSelectedTwoWayTrip] = useState<any>(null);

  // Handle card click (UNCHANGED)
  const handleCardClick = (
  trip: any,
  providerId: string,
  type: string,
  index: number
) => {
  const uniqueId = `${providerId}-${trip.bus_code_index}-${index}`;
  const data = { trip, providerId, uniqueId };

  if (type === "one-way") {
    setSelectedOneWayTrip(data);
    sessionStorage.setItem("selectedOneWayTrip", JSON.stringify(data));
  } else if (type === "two-way") {
    setSelectedTwoWayTrip(data);
    sessionStorage.setItem("selectedTwoWayTrip", JSON.stringify(data));
  }
};


  // Restore selections on mount (UNCHANGED)
  useEffect(() => {
    const storedOneWay = sessionStorage.getItem("selectedOneWayTrip");
    const storedTwoWay = sessionStorage.getItem("selectedTwoWayTrip");

    if (storedOneWay) {
      try {
        setSelectedOneWayTrip(JSON.parse(storedOneWay));
      } catch (err) {
        console.error("Failed to parse stored one-way trip:", err);
      }
    }

    if (storedTwoWay) {
      try {
        setSelectedTwoWayTrip(JSON.parse(storedTwoWay));
      } catch (err) {
        console.error("Failed to parse stored two-way trip:", err);
      }
    }
  }, []);

  const handelPopup = (trip: Trip) => {
  const index0 = trip.index0;
  const index = trip.index;

  setCrossIndex(index0);
  setCrossIndexTwo(index);
  setCrossClose(10)
};



  const handelCross = () => setCrossHover(!crossHover);

  return {
    crossIndex,
    crossIndexTwo,
    crossHover,
    selectedOneWayTrip,
    selectedTwoWayTrip,
    handleCardClick,
    handelPopup,
    handelCross,
  };
}
