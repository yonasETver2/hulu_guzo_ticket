// tiket/index.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useGlobalState } from "@/app/globalContext/GlobalState";

import ActionButtons from "../commonComponent/TopActionBar/ActionButtons";
import TripSection from "./TripSection";
import { BusTicketProps } from "./TicketCard";

export default function Tiket() {
  const { data: session } = useSession();
  const user_id = session?.user?.id || 0;

  const { status } = useGlobalState();

  const [tickets, setTickets] = useState<BusTicketProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 SEARCH STATE
  const [search, setSearch] = useState("");

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

  if (loading) return <p className="text-center mt-32">Loading tickets...</p>;
  if (error) return <p className="text-center mt-32 text-red-500">{error}</p>;

  // ================= FILTER LOGIC =================
  const normalizeDate = (date?: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return `${d.getFullYear()} ${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")} ${d.getDate().toString().padStart(2, "0")}`;
  };

  const normalizeDateTime = (date?: string | Date | null | number) : string=> {
    if (!date) return "N/A";

    const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "N/A";

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0"); // ✅ hour
    const min = String(d.getMinutes()).padStart(2, "0"); // ✅ minute

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      normalizeDateTime(ticket.tiketed_date).includes(q) ||
      normalizeDate(ticket.travel_date).includes(q) ||
      ticket.passenger_full_name?.toLowerCase().includes(q) ||
      ticket.tiket_number?.toLowerCase().includes(q) ||
      ticket.phone?.toLowerCase().includes(q)
    );
  });

  // ================= GROUP BY DATE =================
  const grouped = filteredTickets.reduce((acc: any, ticket) => {
    const key = normalizeDateTime(ticket.tiketed_date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(ticket);
    return acc;
  }, {});

  const sequenceTickets = Object.entries(grouped).map(([date, items]: any) => ({
    date,
    tickets: items.map((t: BusTicketProps, i: number) => ({
      ...t,
      sequence: i + 1,
      total: items.length,
    })),
  }));

  return (
    <div className="space-y-12 md:mb-30">
      {/* ================= TOP BAR ================= */}
      <div
        className={`fixed top-16 left-0 w-full p-4 shadow-md ${
          status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-700"
        } z-30`}
      >
        <ActionButtons status={status} />

        {/* 🔍 SEARCH BAR */}
        <input
          type="text"
          placeholder={
            status.setting?.lang === "en"
              ? "Search by date (YYYY-MM-DD), name, #ticket or phone"
              : "ቀን (ዓመት-ወር-ቀን), ስም, #ቲኬት ወይም ስልክ ቁጥር ይፈልጉ"
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-3 px-4 py-2 rounded-lg border focus:outline-none"
        />

        {/* ❌ NO RESULTS MESSAGE */}
        {search && filteredTickets.length === 0 && (
          <p className="mt-2 text-sm text-red-500 text-center">
            {status.setting?.lang === "en"
              ? "No matching trips found"
              : "የተመሳሰሉ ጉዞዎች አልተገኙም"}
          </p>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="mt-32 mx-4">
        <div
          className="grid gap-4 
                  grid-cols-1      // 1 card per row on small screens
                  sm:grid-cols-2   // 2 cards per row on medium screens
                  lg:grid-cols-3" // 3 cards per row on large screens
        >
          {sequenceTickets.map(({ date, tickets }, idx) => (
            <TripSection
              key={`${date}-${tickets[0]?.bus_code}-${tickets[0]?.travel_time}`}
              date={date}
              tickets={tickets}
              idx={idx}
              status={status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
