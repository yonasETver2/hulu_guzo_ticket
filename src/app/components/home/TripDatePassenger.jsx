"use client";

import React, { useState, useEffect, useRef } from "react";
import EthiopianCalendarMenu from "../CustomCalenderPicker/EthiopianDatePicker";
import GregorianCalendarMenu from "../CustomCalenderPicker/GregorianCalendarPicker";
import {
  gregorianToEthiopianDate,
  ethiopianToGregorian,
} from "@/tools/constant";

export default function TripDatePassenger({
  status,
  oneWayDate,
  handelOneWayDate,
  numberPassengerFirst,
  handelNumberPassenger,
  roundTripClick,
  roundDate,
  handelRoundDate,
  numberPassengerRound,
  handelNumberPassengerRound,
}) {
  /* ============================
     UI STATE (ETHIOPIAN ONLY)
  ============================ */
  const [departureEth, setDepartureEth] = useState(null);
  const [returnEth, setReturnEth] = useState(null);

  const [openDeparture, setOpenDeparture] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);

  const departureRef = useRef(null);
  const returnRef = useRef(null);

  /* ============================
     SYNC FROM PROPS (GREGORIAN)
  ============================ */
  useEffect(() => {
    if (oneWayDate) {
      setDepartureEth(gregorianToEthiopianDate(new Date(oneWayDate)));
    }
  }, [oneWayDate]);

  useEffect(() => {
    if (roundDate) {
      setReturnEth(gregorianToEthiopianDate(new Date(roundDate)));
    }
  }, [roundDate]);

  /* ============================
     CLOSE ON OUTSIDE CLICK
  ============================ */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (departureRef.current && !departureRef.current.contains(e.target)) {
        setOpenDeparture(false);
      }
      if (returnRef.current && !returnRef.current.contains(e.target)) {
        setOpenReturn(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ============================
     HELPERS
  ============================ */
  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const formatDateForInput = (ethDate) => {
    if (!ethDate) return "";

    if (status?.setting?.lang === "en") {
      return formatLocalDate(ethiopianToGregorian(ethDate));
    }

    return `${ethDate.year}-${String(ethDate.month).padStart(2, "0")}-${String(
      ethDate.day
    ).padStart(2, "0")}`;
  };

  /* ============================
     DATE SELECTION HANDLERS
  ============================ */

  // Ethiopian → Gregorian
  const handleDepartureEthSelect = (ethDate) => {
    setDepartureEth(ethDate);
    const greg = ethiopianToGregorian(ethDate);

    handelOneWayDate({
      target: { value: formatLocalDate(greg) },
    });

    setOpenDeparture(false);
  };

  const handleReturnEthSelect = (ethDate) => {
    setReturnEth(ethDate);
    const greg = ethiopianToGregorian(ethDate);

    handelRoundDate({
      target: { value: formatLocalDate(greg) },
    });

    setOpenReturn(false);
  };

  // Gregorian → Gregorian
  const handleDepartureGregSelect = (date) => {
    handelOneWayDate({
      target: { value: formatLocalDate(date) },
    });
    setOpenDeparture(false);
  };

  const handleReturnGregSelect = (date) => {
    handelRoundDate({
      target: { value: formatLocalDate(date) },
    });
    setOpenReturn(false);
  };

  /* ============================
     RENDER
  ============================ */
  return (
    <>
      {/* DEPARTURE */}
      <div className="sm:flex space-x-4 py-2">
        <div
          className="flex items-center space-x-2 relative"
          ref={departureRef}
        >
          <p>{status?.setting?.lang === "en" ? "Departure date" : "መነሻ ቀን"}</p>

          <input
            type="text"
            readOnly
            value={formatDateForInput(departureEth)}
            onClick={() => setOpenDeparture(!openDeparture)}
            className="border-1 border-gray-300 rounded-md w-[120px] cursor-pointer px-2"
          />

          {openDeparture && (
            <div className="absolute top-full left-0 z-50 mt-1">
              {status?.setting?.lang === "en" ? (
                <GregorianCalendarMenu
                  selected={oneWayDate ? new Date(oneWayDate) : new Date()}
                  onSelect={handleDepartureGregSelect}
                />
              ) : (
                <EthiopianCalendarMenu
                  selected={departureEth}
                  onSelect={handleDepartureEthSelect}
                />
              )}
            </div>
          )}
        </div>

        {/* PASSENGERS */}
        <div className="sm:flex sm:justify-center sm:items-center space-x-2">
          <div className="flex space-x-2 pt-2 sm:pt-0">
            <p>
              {status?.setting?.lang === "en"
                ? "Number of passenger"
                : "የተጓዦች ቁጥር"}
            </p>
            <input
              type="number"
              min="0"
              onChange={handelNumberPassenger}
              value={numberPassengerFirst}
              className="border-1 border-gray-300 rounded-md w-[70px] pl-2"
            />
          </div>
        </div>
      </div>

      {/* ROUND TRIP */}
      {roundTripClick && (
        <div className="mt-4">
          <hr className="border-1 border-gray-300 mb-2" />

          <p>{status?.setting?.lang === "en" ? "Round Trip" : "መመለሻ ጉዞ"}</p>

          <div className="sm:flex space-y-2 space-x-4 sm:justify-center">
            {/* Return Date */}
            <div
              className="flex justify-center items-center space-x-2 relative"
              ref={returnRef}
            >
              <p>
                {status?.setting?.lang === "en" ? "Return Date" : "መመለሻ ቀን"}
              </p>

              <input
                type="text"
                readOnly
                value={formatDateForInput(returnEth)}
                onClick={() => setOpenReturn(!openReturn)}
                className="border-1 border-gray-300 px-2 rounded-md cursor-pointer"
              />

              {openReturn && (
                <div className="absolute top-full left-0 z-50 mt-1">
                  {status?.setting?.lang === "en" ? (
                    <GregorianCalendarMenu
                      selected={roundDate ? new Date(roundDate) : new Date()}
                      onSelect={handleReturnGregSelect}
                    />
                  ) : (
                    <EthiopianCalendarMenu
                      selected={returnEth}
                      onSelect={handleReturnEthSelect}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Return Passenger Number */}
            <div className="flex justify-center items-center space-x-2">
              <p>
                {status?.setting?.lang === "en"
                  ? "Number of passenger"
                  : "የተጓዦች ቁጥር"}
              </p>
              <input
                type="number"
                min="0"
                onChange={handelNumberPassengerRound}
                value={numberPassengerRound}
                className="border-1 border-gray-300 rounded-md w-[60px] pl-2"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
