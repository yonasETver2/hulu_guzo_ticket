// components/TicketCard.tsx
"use client";

import Image from "next/image";
import QRCode from "react-qr-code";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { formatDate, formatTime } from "./hooks/TicketHelpers";

export interface BusTicketProps {
  provider_name: string;
  provider_logo: string;
  passenger_full_name: string;
  source_city: string;
  destination_city: string;
  tiket_number: string | null;
  tiketed_date: string | Date | null;
  seat_number: string;
  bus_code: string;
  travel_date: string | null;
  travel_time: string | null;
  travel_status: string;
  sequence?: number;
  total?: number;
  phone: string;
}

export default function TicketCard({ ticket }: { ticket: BusTicketProps }) {
  const { status } = useGlobalState();

  return (
    <div
      className={`max-w-sm sm:max-w-md w-margin mx-auto mt-6 shadow-xl rounded-2xl border p-6 flex flex-col gap-4 ${
        status.setting?.theme === "light"
          ? "border-gray-200 bg-white"
          : "border-gray-500 bg-gray-700"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-3 gap-2 sm:gap-0">
        {ticket.provider_logo ? (
          <Image
            src={ticket.provider_logo}
            alt={ticket.provider_name}
            width={60}
            height={60}
            unoptimized
            crossOrigin="anonymous"
            className="rounded-md"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
            {status.setting?.lang === "en" ? "No Logo" : "ሎጎ የለም"}
          </div>
        )}
        <div className="text-right mt-2 sm:mt-0">
          <p className="text-xs text-gray-400">
            {status.setting?.lang === "en" ? "Ticket No." : "የቲኬት ቁጥር"}
          </p>
          <p className="text-md sm:text-lg font-bold">
            {ticket.tiket_number || "N/A"}
          </p>
        </div>
      </div>

      {/* Passenger */}
      <div>
        <p className="text-gray-500 text-sm">
          {status.setting?.lang === "en" ? "Passenger" : "የተሳፋሪ ስም"}
        </p>
        <p className="text-lg font-semibold">{ticket.passenger_full_name}</p>
      </div>

      {/* Route */}
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {status.setting?.lang === "en" ? "From" : "መነሻ"}
          </p>
          <p className="font-semibold">{ticket.source_city}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">
            {status.setting?.lang === "en" ? "To" : "መዳረሻ"}
          </p>
          <p className="font-semibold">{ticket.destination_city}</p>
        </div>
      </div>

      {/* Seat & Bus Code */}
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {status.setting?.lang === "en" ? "Seat" : "መቀመጫ"}
          </p>
          <p className="font-semibold">{ticket.seat_number}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            {status.setting?.lang === "en" ? "Bus Code" : "የአውቶቢስ ቁጥር"}
          </p>
          <p className="font-semibold">{ticket.bus_code}</p>
        </div>
      </div>

      {/* QR */}
      <div className="flex justify-center mt-4">
        {ticket.tiket_number ? (
          <QRCode value={ticket.tiket_number} size={100} />
        ) : (
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            {status.setting?.lang === "en" ? "No QR" : "QR የለም"}
          </div>
        )}
      </div>

      {/* Travel Time */}
      <div className="flex justify-between text-sm text-gray-500">
        <p>
          {formatDate(ticket.travel_date)} - {formatTime(ticket.travel_time)}
        </p>
        <p>
          {ticket.travel_status === null
            ? status.setting?.lang === "en"
              ? "Pending"
              : "በሂደት ላይ"
            : status.setting?.lang === "en"
            ? ticket.travel_status
            : "ተረጋግጧል"}
        </p>
      </div>

      {/* Sequence */}
      {ticket.sequence !== undefined && ticket.total !== undefined && (
        <div className="mt-4 flex justify-center">
          <span className="text-sm font-semibold text-gray-600">
            {status.setting?.lang === "en" ? "Ticket" : "ቲኪት"} {ticket.sequence}{" "}
            {status.setting?.lang === "en" ? "of" : "ከ"} {ticket.total}
          </span>
        </div>
      )}
    </div>
  );
}
