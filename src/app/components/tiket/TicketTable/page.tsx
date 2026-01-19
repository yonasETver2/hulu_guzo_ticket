"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { BusTicketProps } from "../TicketCard";
import { formatDate, formatTime } from "../hooks/TicketHelpers";

// 📦 Excel export
import * as XLSX from "xlsx";

export default function AllTickets() {
  const { data: session } = useSession();
  const user_id = session?.user?.id || 0;
  const { status } = useGlobalState();

  const [tickets, setTickets] = useState<BusTicketProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterBy, setFilterBy] = useState("all");
  const [searchText, setSearchText] = useState("");

  // ================= FETCH TICKETS =================
  useEffect(() => {
    if (!user_id) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/getTiket?userId=${user_id}`);
        const data = await res.json();
        setTickets(data.success ? data.data : []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user_id]);

  // ================= FILTER LOGIC =================
  const filteredTickets = tickets.filter((ticket) => {
    const q = searchText.toLowerCase().trim();
    if (!q) return true;

    switch (filterBy) {
      case "name":
        return ticket.passenger_full_name?.toLowerCase().includes(q);
      case "ticket":
        return ticket.tiket_number?.toLowerCase().includes(q);
      case "busCode":
        return ticket.bus_code?.toLowerCase().includes(q);
      case "date":
        return ticket.travel_date?.includes(q);
      case "phone":
        return ticket.phone?.toLowerCase().includes(q);
      default:
        return (
          ticket.passenger_full_name?.toLowerCase().includes(q) ||
          ticket.tiket_number?.toLowerCase().includes(q) ||
          ticket.bus_code?.toLowerCase().includes(q) ||
          ticket.travel_date?.includes(q) ||
          ticket.phone?.toLowerCase().includes(q)
        );
    }
  });

  // ================= EXPORT TO EXCEL =================
  const handleExportExcel = () => {
    const worksheetData = filteredTickets.map((t) => ({
      "Passenger Name": t.passenger_full_name,
      "Ticket Number": t.tiket_number,
      "Bus Code": t.bus_code,
      "Seat Number": t.seat_number,
      From: t.source_city,
      To: t.destination_city,
      "Travel Date": formatDate(t.travel_date),
      "Travel Time": formatTime(t.travel_time),
      Phone: t.phone,
      "Travel Status": t.travel_status || "Pending",
      "Ticketed by": session?.user?.id || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    XLSX.writeFile(workbook, "Tickets.xlsx");
  };

  if (loading) return <p className="text-center mt-32">Loading tickets...</p>;
  if (error) return <p className="text-center mt-32 text-red-500">{error}</p>;
  if (!tickets.length)
    return <p className="text-center mt-32">No tickets found</p>;

  return (
    <div className="p-0 space-y-6">
      {/* ================= FIXED HEADER ================= */}
      <div
        className={`sticky top-12 z-20 ${
          status.setting?.theme === "light" ? "bg-white" : "bg-black"
        } px-6 pt-4 pb-2 space-y-4 `}
      >
        <h1 className="text-2xl font-bold">
          {status.setting?.lang === "en" ? "All Tickets" : "ሁሉም ቲኬቶች"}
        </h1>

        {/* ================= FILTER & SEARCH ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
          {/* Select */}
          <div className="flex gap-4 w-full sm:w-auto order-1 lg:order-1">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className={`border rounded px-3 py-2 w-1/2 sm:w-auto ${
                status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-400"
              }`}
            >
              <option value="all">All</option>
              <option value="name">Passenger Name</option>
              <option value="ticket">Ticket Number</option>
              <option value="busCode">Bus Code</option>
              <option value="date">Travel Date</option>
              <option value="phone">Phone</option>
            </select>

            <button
              onClick={handleExportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-1/2 sm:w-auto sm:hidden"
            >
              {status.setting?.lang === "en"
                ? "Export to Excel"
                : "ወደ Excel ይላኩ"}
            </button>
          </div>

          {/* Search (moves to middle on small and above screen) */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={
              status.setting?.lang === "en"
                ? "Type to search..."
                : "ለመፈለግ ይፃፉ..."
            }
            className="border rounded px-3 py-2 w-full sm:flex-1 order-2 sm:order-2 "
          />

          {/* Export button (right on small and above screen) */}
          <button
            onClick={handleExportExcel}
            className="hidden sm:block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded order-3"
          >
            {status.setting?.lang === "en" ? "Export to Excel" : "ወደ Excel ይላኩ"}
          </button>
        </div>
      </div>

      <div className=" max-h-[370px] mx-2 overflow-auto border border-gray-300">
        <table className="w-full table-auto border-collapse">
          <thead
            className={`sticky top-0 z-10 ${
              status.setting?.theme === "light" ? "bg-gray-200" : "bg-gray-600"
            }`}
          >
            <tr>
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Passenger" : "ተጓዥ"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Ticket No." : "የቲኬት ቁጥር"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Bus Code" : "የአውቶቢስ ቁጥር"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Seat" : "ወንበር"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "From" : "መነሻ"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "To" : "መዳረሻ"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Travel Date" : "የመጓዣ ቀን"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Travel Time" : "የመጓዣ ሰአት"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Phone" : "ስልክ"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Status" : "ሁኔታ"}
              </th>
              <th className="border px-3 py-2">
                {status.setting?.lang === "en" ? "Ticketed by" : "ትኬት ሰጪ"}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map((t, idx) => (
              <tr
                key={`${t.tiket_number}-${idx}`}
                className="even:bg-[#f9f3c1] odd:bg-[#edc9cc] even:hover:bg-[#f0e795] odd:hover:bg-[#b8979a] cursor-pointer text-black"
              >
                <td className="border px-3 py-1 text-center">{idx + 1}</td>
                <td className="border px-3 py-1">{t.passenger_full_name}</td>
                <td className="border px-3 py-1">{t.tiket_number}</td>
                <td className="border px-3 py-1">{t.bus_code}</td>
                <td className="border px-3 py-1">{t.seat_number}</td>
                <td className="border px-3 py-1">{t.source_city}</td>
                <td className="border px-3 py-1">{t.destination_city}</td>
                <td className="border px-3 py-1">
                  {formatDate(t.travel_date)}
                </td>
                <td className="border px-3 py-1">
                  {formatTime(t.travel_time)}
                </td>
                <td className="border px-3 py-1">{t.phone}</td>
                <td className="border px-3 py-1">
                  {t.travel_status || "Pending"}
                </td>
                <td className="border px-3 py-1">{session?.user?.id}</td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className="border px-3 py-2 text-center text-red-500"
                >
                  {status.setting?.lang === "en"
                    ? "No tickets found"
                    : "ቲኬቶች አልተገኙም"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
