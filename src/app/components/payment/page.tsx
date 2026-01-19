"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { useSession } from "next-auth/react";
import TeleBirrPayment from "./TeleBirrPayment";
import OtherBankPayment from "./OtherBankPayment";

interface Seat {
  seat_number: string | number;
  pos_row: number;
  pos_col: number;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string | number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

function PaymentPage() {
  const { status } = useGlobalState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const mapSeatWithPosition = (
    seatIds: (string | number)[],
    layoutObj: Record<number, Seat[]> | null
  ) => {
    if (!layoutObj) return [];

    const seatPositions: {
      seat_number: string | number;
      row: number;
      col: number;
    }[] = [];

    // cast Object.values to Seat[][]
    for (const id of seatIds) {
      for (const rowSeats of Object.values(layoutObj) as Seat[][]) {
        const seat = rowSeats.find((s) => s.seat_number === id);
        if (seat) {
          seatPositions.push({
            seat_number: seat.seat_number,
            row: seat.pos_row,
            col: seat.pos_col,
          });
          break;
        }
      }
    }

    return seatPositions;
  };

  useEffect(() => {
    const tripsRaw = searchParams.get("trips");
    const layoutRaw = localStorage.getItem("seatLayout");
    const layout: Record<number, Seat[]> | null = layoutRaw
      ? (JSON.parse(layoutRaw) as Record<number, Seat[]>)
      : null;

    if (tripsRaw) {
      try {
        const parsed = JSON.parse(tripsRaw);
        parsed.forEach((trip: any) => {
          if (trip.seats && layout) {
            trip.seats = mapSeatWithPosition(trip.seats, layout);
          }
        });
        setTrips(parsed);

        const totalPrice = parsed.reduce(
          (sum: number, t: any) =>
            sum + (t.passengers?.length || 0) * (t.price_per_passenger || 0),
          0
        );
        setTotal(totalPrice);
      } catch (e) {
        console.error("Failed to parse trips:", e);
      }
    }
  }, [searchParams]);

  const user_id = session?.user?.id ?? 0;

  const handleSendTrips = async (paymentType = "TeleBirr") => {
    if (!trips || trips.length === 0) return;

    setLoading(true);
    const payment_unique_id = "PAY-" + Date.now();
    const first_trip_payment =
      trips[0]?.passengers?.length * (trips[0]?.price_per_passenger || 0) || 0;
    const round_trip_payment =
      trips[1]?.passengers?.length * (trips[1]?.price_per_passenger || 0) || 0;

    try {
      const res = await fetch("/api/addTripInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trips,
          payment_unique_id,
          first_trip_payment,
          round_trip_payment,
          total_payment: total,
          payment_type: paymentType,
          tiket_optained_at: "Online",
          travel_status: "Pending",
          user_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.includes("already reserved")) {
          alert(`Seat conflict: ${data.message}`);
        } else {
          alert("Failed to save trips: " + data.message);
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(
        `/components/paymentCode?paymentId=${payment_unique_id}&total=${total}&type=${paymentType}`
      );
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while saving trips.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className={`w-[80%] lg:w-[60%] flex justify-center mt-6 border border-gray-100 shadow-md rounded-md p-4 ${
          status.setting?.theme === "light" ? "bg-white" : "bg-gray-900"
        }`}
      >
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0 items-center justify-center w-full">
          <TeleBirrPayment
            status={status}
            total={total}
            trips={trips}
            handleSendTrips={handleSendTrips}
            loading={loading}
          />
          <OtherBankPayment
            status={status}
            total={total}
            handleSendTrips={handleSendTrips}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default function PaymentWithSuspense() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
