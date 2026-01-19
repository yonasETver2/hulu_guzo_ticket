"use client";
import React, { useCallback } from "react";
import Image from "next/image";

interface Seat {
  seat_number: string | number;
  pos_row: number;
  pos_col: number;
}

interface LayoutType {
  rowSeats: Record<number, number>;
  blankIndices?: Record<number, number[]>;
}

interface SeatMapProps {
  layout: Record<number, Seat[]>; // cannot be null
  layoutType: LayoutType; // cannot be null
  reservedFromDB?: Set<string | number>; // optional
  userReservedSeats?: Set<string | number>; // optional
  toggleSeat: (seatId: string | number) => void;
}

const SeatMap: React.FC<SeatMapProps> = React.memo(function SeatMap({
  layout,
  layoutType,
  reservedFromDB,
  userReservedSeats,
  toggleSeat,
}) {
  // render each row
  const renderRow = useCallback(
    (rowIndex: number, seats: Seat[]) => {
      if (!layoutType) return null;
      const rowSeats = Array.isArray(seats) ? [...seats] : [];
      rowSeats.sort((a, b) => (a.pos_col ?? 0) - (b.pos_col ?? 0));

      let ptr = 0;
      const totalCols = layoutType.rowSeats[rowIndex];
      const blankCols = new Set(layoutType.blankIndices?.[rowIndex] || []);

      const nodes = [];
      for (let col = 1; col <= totalCols; col++) {
        if (blankCols.has(col)) {
          nodes.push(
            <div
              key={`blank-${rowIndex}-${col}`}
              className="w-[50px] h-[50px]"
            />
          );
          continue;
        }

        const seat = rowSeats[ptr];
        ptr++;
        if (!seat) {
          nodes.push(
            <div
              key={`empty-${rowIndex}-${col}`}
              className="w-[50px] h-[50px]"
            />
          );
          continue;
        }

        const seatId = seat.seat_number;
        const isTaken = reservedFromDB?.has(seatId);
        const isMine = userReservedSeats?.has(seatId);

        const seatColor = isTaken
          ? "bg-red-400 cursor-not-allowed"
          : isMine
          ? "bg-[#4bf288] cursor-pointer"
          : "bg-gray-300 hover:bg-green-200";

        nodes.push(
          <button
            key={seatId}
            onClick={() => !isTaken && toggleSeat(seatId)}
            disabled={isTaken}
            className={`w-[50px] h-[50px] rounded-full ${seatColor} transition`}
          >
            {seatId}
          </button>
        );
      }

      return (
        <div key={rowIndex} className="flex gap-2 mb-2">
          {nodes}
        </div>
      );
    },
    [layoutType, reservedFromDB, userReservedSeats, toggleSeat]
  );

  return (
    <div className="overflow-x-auto">
      <div className="flex-nowrap inline-flex space-x-2 border border-gray-400 rounded-r-lg p-2 min-w-max">
        <div className="space-y-2">
          {Object.entries(layout || {}).map(([row, seats]) =>
            renderRow(Number(row), seats)
          )}
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/assets/images/driver_seat.png"
            alt="driver_seat"
            width={100}
            height={200}
          />
        </div>
      </div>
    </div>
  );
});

export default SeatMap;
