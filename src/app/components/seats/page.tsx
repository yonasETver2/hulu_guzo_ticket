"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Suspense
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import { useGlobalStateTwo } from "@/tools/GlobalState";
import { busLayout } from "@/tools/constant";
import { useHomePageState } from "../home/hooks/useHomePageState";
import SeatMap from "./SeatMap";
import TripSummary from "./TripSummary";
import TripHeader from "./TripHeader";

import {
  to24Hour,
  readJSON,
  writeJSON,
  groupSeatsByRow,
  layoutToOrderedSeats,
} from "./utils/seatUtils";
import { DateTime } from "next-auth/providers/kakao";
import { number } from "framer-motion";

type PassengersData = {
  firstTrip?: any[]; // or more specific type if you know the structure
  roundTrip?: any[];
  // you can add more keys if needed
};

type PassengerInfoStorage = {
  firstTrip?: {
    count: number;
  };
  roundTrip?: {
    count: number;
  };
};

type Seat = {
  seat_number: string;
  pos_row: number;
  pos_col: number;
  // add others if needed
};

type SeatLayout = Record<number, Seat[]>;

type Trip = {
  trip_date?: string | number | Date | DateTime | null;
  trip_time?: string | null;
  trip_sort_date: string | number | Date;
  trip_sort_time: string | number | Date | DateTime;
  payment_per_passenger?: number | string;
  source_city?: string;
  source_city_amh?: string;
  destination_city?: string;
  destination_city_amh?: string;
  transporter_name?: string;
  plate_number?: string;
  bus_code?: string;
  passenger_seats?: number | string;
  total_booked?: number | string;
  available_seats?: number | string;
  provider_id?: number;
  boarding_name?: string;
  distance?: number | string;
  duration?: number | string;
  trip_type?: string;
};

type TripKey = "first" | "round";
type BusTypes = "Large Bus" | "Min Bus";

type TripType = "one-way" | "two-way";

// ----------------- Main Seat Component -----------------
function Seat() {
  const { status } = useGlobalState();
  const {
    passengersData,
    seatsData,
    updateSeats,
    passengerCount,
    updatePassengerCount,
  } = useGlobalStateTwo();

  const { selectedCity, selectedCityAmh, selectedCityTwo, selectedCityTwoAmh } =
    useHomePageState();
  const searchParams = useSearchParams();
  const router = useRouter();

  // UI state
  const [layout, setLayout] = useState<SeatLayout | null>(null); // seat objects grouped by row
  const [busType, setBusType] = useState<BusTypes | null>(null);

  // Reserved sets (from DB) for both trips
  const [reservedFirst, setReservedFirst] = useState(new Set());
  const [reservedRound, setReservedRound] = useState(new Set());

  // derived from global state (keeps layout same)
  const userReservedFirst = seatsData.firstTrip;
  const userReservedRound = seatsData.roundTrip;

  // totals (kept minimal)
  const [totalPriceFirst, setTotalPriceFirst] = useState(0);
  const [totalPriceRound, setTotalPriceRound] = useState(0);

  // search param derived
  const cityOne =
    status.setting?.lang === "en" ? selectedCity : selectedCityAmh;
  const cityTwo =
    status.setting?.lang === "en" ? selectedCityTwo : selectedCityTwoAmh;
  const tripTypeParam = searchParams.get("tripType")?.toLowerCase();
  const tripType: TripType =
    tripTypeParam === "two-way" ? "two-way" : "one-way";

  const numberPassenger = passengerCount.firstTrip;
  const numberPassengerTwo = passengerCount.roundTrip;

  const prevRoundPassengerRef = useRef(numberPassengerTwo);

  // If passenger count changes on the other page, allow auto-select again and trim/adjust seats to match the new count.
  useEffect(() => {
    // Reset the user-changed flag so auto-selection can run after a count change
    try {
      localStorage.setItem("userChangedFirstTrip", "false");
    } catch {}

    const cur = new Set(seatsData.firstTrip || []);
    if (cur.size > numberPassenger) {
      const trimmed = new Set(Array.from(cur).slice(0, numberPassenger));
      updateSeats("firstTrip", trimmed);
      writeJSON("userReservedSeatsFirstTrip", trimmed);
    }
  }, [numberPassenger, seatsData.firstTrip]);

  useEffect(() => {
    const curR = new Set(seatsData.roundTrip || []);
    if (curR.size > numberPassengerTwo) {
      const trimmedR = new Set(Array.from(curR).slice(0, numberPassengerTwo));
      updateSeats("roundTrip", trimmedR);
      writeJSON("userReservedSeatsRoundTrip", trimmedR);
    }

    // ✅ keep ref in sync
    prevRoundPassengerRef.current = numberPassengerTwo;
  }, [numberPassengerTwo, seatsData.roundTrip]);

  // local refs
  const restoredRef = useRef(false);
  const pollingRef = useRef<number | null>(null);

  // --- initialize passenger counts from localStorage or URL once ---
  useEffect(() => {
    // Read the saved passenger info from localStorage
    const saved = readJSON<PassengerInfoStorage | null>("passengerInfo", null);

    // If 'saved' is not null, update the passenger counts
    if (saved) {
      updatePassengerCount("firstTrip", saved.firstTrip?.count ?? 1);
      updatePassengerCount("roundTrip", saved.roundTrip?.count ?? 0);
    }

    // Get passenger counts from the search parameters, if available
    const num1 = searchParams.get("numPass");
    const num2 = searchParams.get("numPassTwo");

    if (num1 !== null) updatePassengerCount("firstTrip", parseInt(num1));
    if (num2 !== null) updatePassengerCount("roundTrip", parseInt(num2));
  }, []); // run only once

  // --- Restore user seats from localStorage once ---
  useEffect(() => {
    const savedFirst = readJSON("userReservedSeatsFirstTrip", []);
    const savedRound = readJSON("userReservedSeatsRoundTrip", []);
    if (savedFirst.length) updateSeats("firstTrip", new Set(savedFirst));
    if (savedRound.length) updateSeats("roundTrip", new Set(savedRound));
    restoredRef.current = true;
  }, []);

  // ----------------- Fetch bus type & seat layout (single effect) -----------------
  useEffect(() => {
    let mounted = true;
    const fetchBoth = async () => {
      if (!selectedDataRef.current) return; // safety

      // determine busCode & providerId from selectedData in URL
      const busCode =
        selectedDataRef.current?.trip?.bus_code ||
        selectedDataRef.current?.one?.trip?.bus_code;
      const providerId =
        selectedDataRef.current?.trip?.provider_id ||
        selectedDataRef.current?.one?.trip?.provider_id;
      if (!busCode || !providerId) return;

      try {
        // fetch bus type and seats in parallel
        const [typeRes, seatsRes] = await Promise.all([
          fetch(
            `/api/getBusType?provider_id=${providerId}&bus_code=${busCode}`
          ),
          fetch(
            `/api/getBusSeats?provider_id=${providerId}&bus_code=${busCode}`
          ),
        ]);

        const typeData = await typeRes.json();
        const seatsDataApi = await seatsRes.json();

        if (!mounted) return;

        if (typeData?.busType) {
          // normalize string to match busLayout keys
          const normalizedType = Object.keys(busLayout).find(
            (k) =>
              k.toLowerCase().replace(/\s+/g, "") ===
              typeData.busType.toLowerCase().replace(/\s+/g, "")
          ) as BusTypes | undefined; // ✅ cast to BusTypes

          if (normalizedType) setBusType(normalizedType); // now type-safe
        }

        if (seatsDataApi?.seats?.length) {
          setLayout(groupSeatsByRow(seatsDataApi.seats));
        }
      } catch (e) {
        console.error("Failed to fetch bus type or seats:", e);
      }
    };

    fetchBoth();
    return () => {
      mounted = false;
    };
  }, []);

  // ----------------- selectedData parsing (from URL) -----------------
  const selectedDataRaw = searchParams.get("selectedData");
  const selectedData = useMemo(() => {
    try {
      return selectedDataRaw ? JSON.parse(selectedDataRaw) : null;
    } catch {
      return null;
    }
  }, [selectedDataRaw]);

  // Cache selectedData for effects that run outside React lifecycle
  const selectedDataRef = useRef(selectedData);
  useEffect(() => {
    selectedDataRef.current = selectedData;
  }, [selectedData]);

  // ----------------- Polling for reserved seats (single interval) -----------------
  const fetchReserved = useCallback(async () => {
    if (!selectedDataRef.current) return;

    const makeCall = async (
      tripData: Trip,
      tripKey: TripKey,
      setter: (s: Set<string>) => void
    ) => {
      if (!tripData?.provider_id) return;
      try {
        const d = new Date(tripData.trip_sort_date);
        const dateOnly = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const t24 = to24Hour(tripData.trip_time ?? null);

        const url = `/api/getBookedSeats?provider_id=${tripData.provider_id}&departure_date=${dateOnly}&departure_time=${t24}&trip_type=${tripKey}&bus_code=${tripData.bus_code}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("bad");

        // ✅ Tell TypeScript the type of each item in data
        type SeatResponse = { seat_number: string };

        const data: SeatResponse[] = await res.json();

        setter(new Set(data.map((s) => s.seat_number)));
      } catch (e) {
        // fail silently — we'll try next tick
        // console.warn("fetchReserved failed", e);
      }
    };

    // first trip data may be in selectedData.trip OR selectedData.one.trip depending on tripType
    const firstTripData =
      tripType === "one-way"
        ? selectedDataRef.current?.trip
        : selectedDataRef.current?.one?.trip;
    if (firstTripData) await makeCall(firstTripData, "first", setReservedFirst);

    if (tripType === "two-way") {
      const round = selectedDataRef.current?.two?.trip;
      if (round) await makeCall(round, "round", setReservedRound);
    }
  }, [tripType]);

  useEffect(() => {
    if (!selectedData) return;

    // run once immediately
    fetchReserved();

    // store interval ID in ref
    pollingRef.current = window.setInterval(fetchReserved, 5000);

    return () => {
      if (pollingRef.current !== null) {
        clearInterval(pollingRef.current);
      }
    };
  }, [selectedData, fetchReserved]);

  // ----------------- Auto selection logic (centralized & debounced) -----------------
  const layoutOrder = useMemo(
    () => (layout ? layoutToOrderedSeats(layout) : []),
    [layout]
  );

  const autoSelectSeats = useCallback(
    (needed: number, reservedSet: Set<string>, existingSet: Set<string>) => {
      if (!layoutOrder.length || needed <= 0) return [];
      const result = [];
      for (const seatId of layoutOrder) {
        if (!reservedSet.has(seatId) && !existingSet.has(seatId)) {
          result.push(seatId);
          if (result.length >= needed) break;
        }
      }
      return result;
    },
    [layoutOrder]
  );

  // Helper for deciding whether to auto-select for a trip
  const handleAutoForTrip = useCallback(
    (isFirst = true) => {
      if (!restoredRef.current) return;
      const reservedSet = isFirst ? reservedFirst : reservedRound;
      if (!reservedSet) return; // allow empty set

      const flagKey = isFirst ? "userChangedFirstTrip" : "userChangedRoundTrip";

      const limit = isFirst ? numberPassenger : numberPassengerTwo;

      // ✅ AUTO-RESET if passenger count increased
      if (!isFirst) {
        if (numberPassengerTwo > prevRoundPassengerRef.current) {
          localStorage.setItem(flagKey, "false");
        }
      }

      const userChanged = localStorage.getItem(flagKey) === "true";
      if (userChanged) return;

      const currentSet: Set<string> = new Set(
        isFirst ? userReservedFirst : userReservedRound
      );
      const needed =
        (isFirst ? numberPassenger : numberPassengerTwo) - currentSet.size;
      if (needed <= 0) return;

      const add = autoSelectSeats(
        needed,
        reservedSet as Set<string>,
        currentSet
      );
      if (add.length === 0) return;

      const final = new Set([...currentSet, ...add]);
      updateSeats(isFirst ? "firstTrip" : "roundTrip", final);
      writeJSON(
        isFirst ? "userReservedSeatsFirstTrip" : "userReservedSeatsRoundTrip",
        final
      );

      if (!isFirst) {
        prevRoundPassengerRef.current = numberPassengerTwo;
      }
    },
    [
      reservedFirst,
      reservedRound,
      userReservedFirst,
      userReservedRound,
      numberPassenger,
      numberPassengerTwo,
      autoSelectSeats,
    ]
  );

  // Run auto-select when passenger counts change or reservedFromDB changes or layout becomes available
  useEffect(() => {
    handleAutoForTrip(true);
  }, [layout, reservedFirst, numberPassenger, userReservedFirst]);

  // Auto-select for round trip whenever layout, reserved seats, or passenger count changes
  useEffect(() => {
    if (!restoredRef.current) return;
    if (!layout || !reservedRound) return;

    handleAutoForTrip(false);
  }, [layout, reservedRound, numberPassengerTwo, userReservedRound]);

  // ----------------- Persist user seats when global seat sets change -----------------
  useEffect(() => {
    writeJSON("userReservedSeatsFirstTrip", userReservedFirst);
  }, [userReservedFirst]);

  useEffect(() => {
    writeJSON("userReservedSeatsRoundTrip", userReservedRound);
  }, [userReservedRound]);

  // ----------------- Price calculations -----------------
  const getPrice = useCallback(
    (tripData: Trip | undefined | null) =>
      Number(tripData?.payment_per_passenger) || 0,
    []
  );

  useEffect(() => {
    const tripData =
      tripType === "one-way" ? selectedData?.trip : selectedData?.one?.trip;
    setTotalPriceFirst((userReservedFirst?.size || 0) * getPrice(tripData));
  }, [userReservedFirst, selectedData, tripType]);

  useEffect(() => {
    const tripData = selectedData?.two?.trip;
    setTotalPriceRound((userReservedRound?.size || 0) * getPrice(tripData));
  }, [userReservedRound, selectedData]);

  // ----------------- Toggle seat (user interaction) -----------------
  const toggleSeat = useCallback(
    (seatId: string | number, isFirstTrip = true) => {
      const tripKey = isFirstTrip ? "firstTrip" : "roundTrip";
      const current = new Set(
        isFirstTrip ? userReservedFirst : userReservedRound
      );

      // Ensure seatId is a string
      const seatIdStr = String(seatId); // Convert to string

      if (current.has(seatIdStr)) current.delete(seatIdStr);
      else {
        const limit = isFirstTrip ? numberPassenger : numberPassengerTwo;
        if (current.size < limit) current.add(seatIdStr);
        else {
          // replace oldest seat
          current.delete([...current][0]);
          current.add(seatIdStr);
        }
      }

      updateSeats(tripKey, current);
      writeJSON(
        isFirstTrip
          ? "userReservedSeatsFirstTrip"
          : "userReservedSeatsRoundTrip",
        current
      );
      localStorage.setItem(
        isFirstTrip ? "userChangedFirstTrip" : "userChangedRoundTrip",
        "true"
      );
    },
    [userReservedFirst, userReservedRound, numberPassenger, numberPassengerTwo]
  );

  // ----------------- helpers used by UI (map seat to positions) -----------------
  
  const mapSeatWithPosition = useCallback(
    (
      seatIds: (string | number)[],
      layoutObj: Record<number, Seat[]>
    ): { seat_number: string | number; pos_row: number; pos_col: number }[] => {
      const out: {
        seat_number: string | number;
        pos_row: number;
        pos_col: number;
      }[] = [];

      // Cast Object.values to Seat[][]
      for (const id of seatIds) {
        for (const rowSeats of Object.values(layoutObj) as Seat[][]) {
          const seat = rowSeats.find((s: Seat) => s.seat_number === id);
          if (seat) {
            out.push({
              seat_number: seat.seat_number,
              pos_row: seat.pos_row,
              pos_col: seat.pos_col,
            });
            break;
          }
        }
      }

      return out;
    },
    []
  );

  // ----------------- payment navigation + validation -----------------
  // Inside your component, update the relevant part of the code
  const validatePassengerInfo = useCallback(() => {
    const trips = [
      { tripKey: "firstTrip", seats: numberPassenger },
      { tripKey: "roundTrip", seats: numberPassengerTwo },
    ];

    for (const { tripKey, seats } of trips) {
      // Ensure tripKey is correctly typed
      let passengers = passengersData[tripKey as keyof PassengersData] || [];

      if (!passengers.length) {
        const saved = readJSON(
          tripKey === "firstTrip"
            ? "passengersFirstTrip"
            : "passengersRoundTrip",
          []
        );
        passengers = saved || [];
      }

      // Validate if the number of passengers and their details are correct
      if (seats > 0) {
        if (passengers.length !== seats) return false;
        for (const p of passengers) {
          if (!p.firstName || !p.lastName || !p.phone || !p.sex) return false;
        }
      }
    }
    return true;
  }, [passengersData, numberPassenger, numberPassengerTwo]);

  const handlePayClick = useCallback(() => {
    if (!validatePassengerInfo()) {
      alert(
        status.setting?.lang === "en"
          ? "Please fill in all passenger information before proceeding to payment."
          : "ወደ ክፍያ ከማለፎ በፊት እባኮትን ሁሉንም የተጓዥ መረጃ ይሙሉ"
      );
      return;
    }

    if (
      (numberPassenger > 0 && (userReservedFirst?.size || 0) === 0) ||
      (tripType === "two-way" &&
        numberPassengerTwo > 0 &&
        (userReservedRound?.size || 0) === 0)
    ) {
      alert(
        status.setting?.lang === "en"
          ? "Please select seats for all passengers before proceeding to payment."
          : "ወደ ክፍያ ከማለፎ በፊት እባኮትን ሁሉንም የተጓዥ ወንበር ይምረጡ"
      );
      return;
    }

    // Build seat lookup
    const layoutBySeat: Record<string, Seat> = {};
    for (const rowSeats of Object.values(layout || {})) {
      for (const s of rowSeats) {
        layoutBySeat[s.seat_number] = s;
      }
    }

    const tripsData = [];

    // --- FIRST TRIP ---
    if (numberPassenger > 0) {
      const tripData =
        tripType === "one-way" ? selectedData?.trip : selectedData?.one?.trip;

      const passengerSeats = Array.from(userReservedFirst || []) as string[];

      const passengersMapped = (passengersData.firstTrip || []).map(
        (p: any, idx: number) => {
          const seatId = passengerSeats[idx] || p.seat;
          const seatObj = layoutBySeat[seatId] || {};
          return {
            ...p,
            seat: seatId,
            seat_row: seatObj.pos_row ?? null,
            seat_col: seatObj.pos_col ?? null,
          };
        }
      );

      tripsData.push({
        provider_id: tripData?.provider_id,
        date: tripData?.trip_date,
        time: tripData?.trip_time,
        price_per_passenger: tripData?.payment_per_passenger,
        seats: mapSeatWithPosition(passengerSeats, layout || {}),
        passengers: passengersMapped,
        source_city: tripData?.source_city,
        source_city_amh: tripData?.source_city_amh,
        destination_city: tripData?.destination_city,
        destination_city_amh: tripData?.destination_city_amh,
        trip_sort_date: tripData?.trip_sort_date,
        bus_code: tripData?.bus_code,
      });
    }

    // --- ROUND TRIP ---
    if (tripType === "two-way" && numberPassengerTwo > 0) {
      const tripData = selectedData?.two?.trip;
      const passengerSeats = Array.from(userReservedFirst || []) as string[];

      const passengersMapped = (passengersData.roundTrip || []).map(
        (p: any, idx: number) => {
          const seatId = passengerSeats[idx] || p.seat;
          const seatObj = layoutBySeat[seatId] || {};
          return {
            ...p,
            seat: seatId,
            seat_row: seatObj.pos_row ?? null,
            seat_col: seatObj.pos_col ?? null,
          };
        }
      );

      tripsData.push({
        provider_id: tripData?.provider_id,
        date: tripData?.trip_date,
        time: tripData?.trip_time,
        price_per_passenger: tripData?.payment_per_passenger,
        seats: mapSeatWithPosition(passengerSeats, layout || {}),
        passengers: passengersMapped,
        source_city: tripData?.source_city,
        source_city_amh: tripData?.source_city_amh,
        destination_city: tripData?.destination_city,
        destination_city_amh: tripData?.destination_city_amh,
        trip_sort_date: tripData?.trip_sort_date,
        bus_code: tripData?.bus_code,
      });
    }

    // console.log("object:", JSON.stringify(tripsData, null, 2));

    router.push(
      `/components/payment?trips=${encodeURIComponent(
        JSON.stringify(tripsData)
      )}`
    );
  }, [
    validatePassengerInfo,
    numberPassenger,
    numberPassengerTwo,
    userReservedFirst,
    userReservedRound,
    selectedData,
    passengersData,
    layout,
    mapSeatWithPosition,
  ]);

  // ----------------- person info navigation -----------------
  const handlePersonInfo = useCallback(
    (
      indexTop: number,
      reservedSeats: Set<string | number>,
      providerId: string | number
    ) => {
      const selectedTripType = indexTop === 0 ? "one-way" : "two-way";
      const seatParam = Array.from(reservedSeats).join(","); // works for string | number
      router.push(
        `/components/person_info?tripType=${selectedTripType}&cityOne=${cityOne}&cityTwo=${cityTwo}&numPass=${numberPassenger}&numPassTwo=${numberPassengerTwo}&seats=${seatParam}&provider_id=${providerId}`
      );
    },
    [numberPassenger, numberPassengerTwo, cityOne, cityTwo]
  );

  // ----------------- display helpers -----------------
  const tripsToRender = tripType === "two-way" ? [0, 1] : [0];

  // ----------------- render -----------------
  return (
    <div className="p-4">
      {/* Header */}
      <TripHeader
        cityOne={cityOne}
        cityTwo={cityTwo}
        totalPriceFirst={totalPriceFirst}
        totalPriceRound={totalPriceRound}
        status={status}
        handlePayClick={handlePayClick}
      />

      {/* Trips */}
      {tripsToRender.map((indexTop) => {
        const reservedFromDB = (
          indexTop === 0 ? reservedFirst : reservedRound
        ) as Set<string | number>;

        const reservedSeats =
          indexTop === 0 ? userReservedFirst : userReservedRound;

        return (
          <div key={indexTop} className="mt-10">
            <SeatMap
              layout={layout || {}}
              layoutType={busLayout[busType ?? "Large Bus"]}
              reservedFromDB={reservedFromDB}
              userReservedSeats={reservedSeats}
              toggleSeat={(seatId) => toggleSeat(seatId, indexTop === 0)}
            />

            {/* Trip summary */}
            <TripSummary
              indexTop={indexTop}
              tripType={tripType}
              selectedData={selectedData}
              reservedSeats={reservedSeats}
              status={status}
              handlePersonInfo={handlePersonInfo}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Seats() {
  return (
    <Suspense fallback={<div>Loading seats...</div>}>
    <div className="mb-30">
      <Seat />
    </div>
    </Suspense>
  );
}
