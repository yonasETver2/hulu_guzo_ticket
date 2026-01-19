"use client";
import { useEffect, useState } from "react";

export function useResultTopState(sendDataToParent: Function) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState("");
  const [oneWay, setOneWay] = useState(true);
  const [roundTrip, setRoundTrip] = useState(false);
  const [isPencil, setIsPencil] = useState(false);
  const [searchData, setSearchData] = useState<any[]>([]);

  const handelPencil = () => setIsPencil(!isPencil);
  const toggleDropdown = () => setIsOpen(!isOpen);

  // restore search results (UNCHANGED)
  useEffect(() => {
    const storedData = sessionStorage.getItem("searchResults");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setSearchData(parsed);
        const trip = oneWay ? "one-way" : "two-way";
        sendDataToParent(parsed, trip);
      } catch (err) {
        console.error("Failed to parse stored search results:", err);
      }
    }
  }, [oneWay]);

  const handel_one_way = () => {
    setOneWay(true);
    setRoundTrip(false);
    sendDataToParent(searchData, "one-way", selectedBus);
  };

  const handel_two_way = () => {
    setOneWay(false);
    setRoundTrip(true);
    sendDataToParent(searchData, "two-way", selectedBus);
  };

  return {
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
  };
}
