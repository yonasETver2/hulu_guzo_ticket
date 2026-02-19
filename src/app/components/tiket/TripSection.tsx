// components/TripSection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TicketCard, { BusTicketProps } from "./TicketCard";
import { formatDate, formatDateTime } from "./hooks/TicketHelpers";

const SENDER_PHONE = "+251922598191"; //phone for sender of the ticket

export default function TripSection({
  date,
  tickets,
  idx,
  status,
}: {
  date: string;
  tickets: BusTicketProps[];
  idx: number;
  status: any;
}) {
  const tripRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const tripPhone = tickets[0]?.phone ?? "";

  const [phone, setPhone] = useState(tripPhone);
  const [sending, setSending] = useState<string | null>(null);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => setIsClient(true), []);

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowSendOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   const sanitizeForCanvas = (element: HTMLElement) => {
    const all = element.querySelectorAll("*");

    all.forEach((el) => {
      const htmlEl = el as HTMLElement;

      // remove Tailwind gradients / fancy colors
      htmlEl.style.backgroundImage = "none";

      const style = getComputedStyle(htmlEl);

      if (style.color.includes("lab") || style.color.includes("oklch")) {
        htmlEl.style.color = "#000";
      }

      if (
        style.backgroundColor.includes("lab") ||
        style.backgroundColor.includes("oklch")
      ) {
        htmlEl.style.backgroundColor = "#fff";
      }

      if (
        style.borderColor.includes("lab") ||
        style.borderColor.includes("oklch")
      ) {
        htmlEl.style.borderColor = "#000";
      }
    });
  };

  // ================= IMAGE GENERATOR =================
  const generateImage = async () => {
    if (!tripRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(tripRef.current, {
      scale: 2,
      useCORS: true,
    });
    return canvas.toDataURL("image/png");
  };

  // ================= SEND HANDLER =================
  const sendTicket = async (channel: "whatsapp" | "telegram" | "sms") => {
    if (!phone) return alert("Enter phone number");

    setSending(channel);

    const image = channel !== "sms" ? await generateImage() : null;

    await fetch("/api/send-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel,
        phone,
        image,
        sender: SENDER_PHONE,
        ticketNumbers: tickets.map((t) => t.tiket_number),
      }),
    });

    setSending(null);
    setShowSendOptions(false);
    alert("Ticket sent");
  };

  // ================= DOWNLOAD IMAGE =================
 const handleDownloadImage = async () => {
    if (!tripRef.current) return;

    const html2canvas = (await import("html2canvas")).default;

    sanitizeForCanvas(tripRef.current); // 🔥 important

    const canvas = await html2canvas(tripRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `Tickets-${date}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const bgColor =
    status.setting?.theme === "light" ? "bg-blue-100" : "bg-blue-700";

  return (
    <div
      className={`w-margin max-w-sm mx-auto p-3 border rounded-lg ${bgColor}`}
    >
      <div ref={tripRef}>
        <h2 className="font-bold text-lg mb-2 flex justify-center gap-2">
          {formatDateTime(date)}
          <Image
            src="/assets/icons/tiket_time.svg"
            alt="ticket"
            width={25}
            height={25}
          />
          <span className="text-blue-400">={tickets.length}</span>
        </h2>

        {tickets.map((ticket, index) => (
          <TicketCard key={ticket.tiket_number || index} ticket={ticket} />
        ))}
      </div>

      {isClient && (
        <div className="flex flex-col gap-2 mt-4 print:hidden relative">
          <input
            type="tel"
            placeholder={
              status.setting?.lang === "en"
                ? "Receiver phone or user name"
                : "የተቀባይ ስልክ ወይም የተጠቃሚ ስም"
            }
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded px-3 py-2"
          />

          {/* BUTTONS */}
          <div className="flex justify-center items-center gap-3 mt-2 relative">
            {/* DOWNLOAD BUTTON */}
            <button
              onClick={handleDownloadImage}
              className="bg-[#6654f9] hover:bg-[#6754f9b9] cursor-pointer text-white px-4 py-2 rounded-lg relative"
            >
              {status.setting?.lang === "en" ? "Download" : "ይጫኑ"}
            </button>

            {/* SEND BUTTON */}
            <div className={`relative `} ref={popupRef}>
              <button
                onClick={() => setShowSendOptions(!showSendOptions)}
                className="bg-[#0bb99c] hover:bg-[#0bb99cc1] cursor-pointer text-white px-4 py-2 rounded-lg relative z-10"
              >
                ✈️
              </button>

              {/* POPUP OPTIONS FLOATING ABOVE */}
              {showSendOptions && (
                <div
                  className={`absolute right-0 bottom-full mb-2 flex flex-col gap-2 ${
                    status.setting?.theme === "light"
                      ? "bg-gray-50"
                      : "bg-gray-500"
                  } border rounded-lg shadow-lg p-2 animate-fade-in z-20`}
                >
                  <button
                    onClick={() => sendTicket("whatsapp")}
                    className="bg-[#00b83dfd] hover:bg-[#00b83dcb] cursor-pointer text-white px-3 py-1 rounded-lg"
                  >
                    {sending === "whatsapp"
                      ? status.setting?.lang === "en"
                        ? "Sending..."
                        : "በመላክ ላይ..."
                      : status.setting?.lang === "en"
                        ? "WhatsApp"
                        : "ዋትስአፕ"}
                  </button>

                  <button
                    onClick={() => sendTicket("telegram")}
                    className="bg-[#00a1f7] hover:bg-[#00a1f7ce] cursor-pointer text-white px-3 py-1 rounded-lg"
                  >
                    {sending === "telegram"
                      ? status.setting?.lang === "en"
                        ? "Sending..."
                        : "በመላክ ላይ..."
                      : status.setting?.lang === "en"
                        ? "Telegram"
                        : "ቴሌግራም"}
                  </button>

                  <button
                    onClick={() => sendTicket("sms")}
                    className="bg-[#363f53] hover:bg-[#363f53cd] cursor-pointer text-white px-3 py-1 rounded-lg"
                  >
                    {sending === "sms"
                      ? status.setting?.lang === "en"
                        ? "Sending..."
                        : "በመላክ ላይ..."
                      : status.setting?.lang === "en"
                        ? "SMS"
                        : "አጭር መልክት"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
