"use client";

import { useState, useRef, useEffect } from "react";
import { useGlobalState } from "@/app/globalContext/GlobalState";

import {
  ETH_MONTHS,
  ETH_WEEKDAYS,
  gregorianToEthiopianDate,
  getDaysInMonth,
  ethiopianToGregorian,
} from "@/tools/constant";



export default function EthiopianCalendarMenu({ selected, onSelect }) {
  const { status } = useGlobalState();
  const today = gregorianToEthiopianDate(new Date());
  const initialYear = selected ? selected.year : today.year;
  const initialMonth = selected ? selected.month : today.month;

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const daysInMonth = getDaysInMonth(month, year);
  const firstOfMonthGregorian = ethiopianToGregorian({ year, month, day: 1 });
  const firstWeekday = firstOfMonthGregorian.getDay();

  const yearOptions = Array.from({ length: 21 }, (_, i) => today.year - 10 + i);

  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const containerRef = useRef(null);

  // Scroll selected into view when dropdown opens
  useEffect(() => {
    if (monthOpen && monthRef.current) {
      const sel = monthRef.current.querySelector(".selected");
      if (sel) sel.scrollIntoView({ block: "center" });
    }
    if (yearOpen && yearRef.current) {
      const sel = yearRef.current.querySelector(".selected");
      if (sel) sel.scrollIntoView({ block: "center" });
    }
  }, [monthOpen, yearOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setMonthOpen(false);
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(13);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 13) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleMonthClick = () => {
    setMonthOpen(!monthOpen);
    if (!monthOpen) setYearOpen(false); // close year if month opens
  };

  const handleYearClick = () => {
    setYearOpen(!yearOpen);
    if (!yearOpen) setMonthOpen(false); // close month if year opens
  };

  return (
    <div
      ref={containerRef}
      className={`border rounded-md p-3 w-[300px]  ${status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-600"} shadow relative`}
    >
      {/* Header with arrows */}
      <div className="flex justify-between items-center mb-2">
        <button
          className="flex items-center justify-center text-2xl"
          onClick={handlePrevMonth}
        >
          ‹
        </button>

        <div className="flex gap-2">
          {/* Month dropdown */}
          <div
            className="border px-2 rounded cursor-pointer relative w-[100px] text-center"
            onClick={handleMonthClick}
          >
            {ETH_MONTHS[month - 1]}
            {monthOpen && (
              <div
                ref={monthRef}
                className={`absolute top-full left-0 w-full max-h-[128px] overflow-y-auto border ${status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-600"} shadow z-10 mt-1`}
              >
                {ETH_MONTHS.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-1 text-center cursor-pointer hover:bg-[#8cc0ff] ${
                      month === idx + 1 ? "bg-[#62a7fa]  font-bold selected" : ""
                    }`}
                    onClick={() => {
                      setMonth(idx + 1);
                      setMonthOpen(false);
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year dropdown */}
          <div
            className="border px-2 rounded cursor-pointer relative w-[100px] text-center"
            onClick={handleYearClick}
          >
            {year}
            {yearOpen && (
              <div
                ref={yearRef}
                className={`absolute top-full left-0 w-full max-h-[128px] overflow-y-auto border ${status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-600"} shadow z-10 mt-1`}
              >
                {yearOptions.map((y) => (
                  <div
                    key={y}
                    className={`p-1 text-center cursor-pointer hover:bg-[#8cc0ff] ${
                      y === year ? "bg-[#62a7fa]  font-bold selected" : ""
                    }`}
                    onClick={() => {
                      setYear(y);
                      setYearOpen(false);
                    }}
                  >
                    {y}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="flex items-center justify-center text-2xl"
          onClick={handleNextMonth}
        >
          ›
        </button>
      </div>

      {/* Weekday names */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-1">
        {ETH_WEEKDAYS.map((day) => (
          <div key={day} className="text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isToday =
            dayNum === today.day &&
            month === today.month &&
            year === today.year;
          const isSelected =
            selected &&
            dayNum === selected.day &&
            month === selected.month &&
            year === selected.year;

          return (
            <button
              key={i}
              className={`p-1 rounded cursor-pointer ${
                isSelected
                  ? "bg-blue-300 font-bold"
                  : isToday
                  ? "border-1 border-blue-300 font-bold"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => onSelect({ year, month, day: dayNum })}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
