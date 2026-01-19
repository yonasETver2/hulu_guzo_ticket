"use client";

import { useState, useRef, useEffect } from "react";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { GREG_MONTHS, GREG_WEEKDAYS } from "@/tools/constant";

export default function GregorianCalendarMenu({ selected, onSelect }) {
  const { status } = useGlobalState();
  const today = new Date();

  // Initialize with selected Date or today
  const initialDate = selected instanceof Date ? selected : today;
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);

  const [monthOpen, setMonthOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  const yearOptions = Array.from(
    { length: 21 },
    (_, i) => today.getFullYear() - 10 + i
  );

  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const containerRef = useRef(null);

  /* =========================
     Sync state with selected prop
  ========================= */
  useEffect(() => {
    if (selected instanceof Date) {
      setYear(selected.getFullYear());
      setMonth(selected.getMonth() + 1);
    }
  }, [selected]);

  /* =========================
     Scroll selected item into view
  ========================= */
  useEffect(() => {
    if (monthOpen && monthRef.current) {
      monthRef.current
        .querySelector(".selected")
        ?.scrollIntoView({ block: "center" });
    }
    if (yearOpen && yearRef.current) {
      yearRef.current
        .querySelector(".selected")
        ?.scrollIntoView({ block: "center" });
    }
  }, [monthOpen, yearOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMonthOpen(false);
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     Handlers
  ========================= */
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const handleMonthClick = () => {
    setMonthOpen(!monthOpen);
    if (!monthOpen) setYearOpen(false);
  };

  const handleYearClick = () => {
    setYearOpen(!yearOpen);
    if (!yearOpen) setMonthOpen(false);
  };

  /* =========================
     Render
  ========================= */
  return (
    <div
      ref={containerRef}
      className={`border rounded-md p-3 w-[300px]  ${
        status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-600"
      } relative`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <button className="text-2xl" onClick={handlePrevMonth}>
          ‹
        </button>

        <div className="flex gap-2">
          {/* Month Dropdown */}
          <div
            className="border px-2 rounded cursor-pointer relative w-[120px] text-center"
            onClick={handleMonthClick}
          >
            {GREG_MONTHS[month - 1]}
            {monthOpen && (
              <div
                ref={monthRef}
                className={`absolute top-full left-0 w-full max-h-[128px] overflow-y-auto border  ${
                  status.setting?.theme === "light"
                    ? "bg-gray-50"
                    : "bg-gray-600"
                } shadow z-10 mt-1`}
              >
                {GREG_MONTHS.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-1 cursor-pointer hover:bg-[#8cc0ff] ${
                      month === idx + 1
                        ? "bg-[#62a7fa]  font-bold selected"
                        : ""
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

          {/* Year Dropdown */}
          <div
            className="border px-2 rounded cursor-pointer relative w-[100px] text-center"
            onClick={handleYearClick}
          >
            {year}
            {yearOpen && (
              <div
                ref={yearRef}
                className={`absolute top-full left-0 w-full max-h-[128px] overflow-y-auto border ${
                  status.setting?.theme === "light"
                    ? "bg-gray-50"
                    : "bg-gray-600"
                } shadow z-10 mt-1`}
              >
                {yearOptions.map((y) => (
                  <div
                    key={y}
                    className={`p-1 cursor-pointer hover:bg-[#8cc0ff] ${
                      y === year ? "bg-[#62a7fa] font-bold selected" : ""
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

        <button className="text-2xl" onClick={handleNextMonth}>
          ›
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-1">
        {GREG_WEEKDAYS.map((d) => (
          <div key={d} className="text-sm">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;

          const isToday =
            dayNum === today.getDate() &&
            month === today.getMonth() + 1 &&
            year === today.getFullYear();

          const isSelected =
            selected instanceof Date &&
            dayNum === selected.getDate() &&
            month === selected.getMonth() + 1 &&
            year === selected.getFullYear();

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
              onClick={() => onSelect(new Date(year, month - 1, dayNum))}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
