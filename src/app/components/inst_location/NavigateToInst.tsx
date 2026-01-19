"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGlobalState } from "@/app/globalContext/GlobalState";

import TopBar from "./TopBar";
import TransportModes from "./TransportModes";
import RouteHeader from "./RouteHeader";
import MapContainer from "./MapContainer";

export default function NavigateToInst() {
  // ✅ hook at top level
  const searchParams = useSearchParams();
  const destinationParam = searchParams.get("destination");

  const [destination, setDestination] = useState<string>("Gonder");
  const { status } = useGlobalState();

  const [providers, setProviders] = useState<
    { transporter_name: string; transporter_name_amh: string; phone: string }[]
  >([]);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [carToggle, setCarToggle] = useState(false);
  const [bicycleToggle, setBicycleToggle] = useState(false);
  const [personToggle, setPersonToggle] = useState(false);

  const [carClick, setCarClick] = useState(true);
  const [bicycleClick, setBicycleClick] = useState(false);
  const [walkingClick, setWalkingClick] = useState(false);

  const [phoneOpen, setPhoneOpen] = useState(false);
  const handlePhoneClick = () => setPhoneOpen(!phoneOpen);

  // ✅ safely react to URL param
  useEffect(() => {
    if (destinationParam) {
      setDestination(destinationParam);
    }
  }, [destinationParam]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError("Unable to fetch location.");
        setLoading(false);
      }
    );
  }, []);

  const mapUrl = userLocation
    ? `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY
       &origin=${userLocation.lat},${userLocation.lng}
       &destination=${encodeURIComponent(destination)}
       &mode=driving`
    : undefined;

  return (
    <div
      className={`flex flex-col h-screen ${
        status.setting?.theme === "light" ? "bg-white" : "bg-gray-900"
      }`}
    >
      <TopBar status={status} />

      <div
        className={`sticky top-31 z-10 ${
          status.setting?.theme === "light" ? "bg-gray-50" : "bg-gray-600"
        } px-4 md:px-8 py-2 shadow-sm`}
      >
        <TransportModes
          status={status}
          carClick={carClick}
          bicycleClick={bicycleClick}
          walkingClick={walkingClick}
          carToggle={carToggle}
          bicycleToggle={bicycleToggle}
          personToggle={personToggle}
          onCarClick={() => {
            setCarClick(true);
            setBicycleClick(false);
            setWalkingClick(false);
          }}
          onBicycleClick={() => {
            setBicycleClick(true);
            setCarClick(false);
            setWalkingClick(false);
          }}
          onWalkingClick={() => {
            setWalkingClick(true);
            setCarClick(false);
            setBicycleClick(false);
          }}
          toggleCar={() => setCarToggle(!carToggle)}
          toggleBicycle={() => setBicycleToggle(!bicycleToggle)}
          togglePerson={() => setPersonToggle(!personToggle)}
        />

        <RouteHeader status={status} destination={destination} />
      </div>

      <div className="px-4">
        {loading && <p className="text-[#5376f6]">Fetching your location...</p>}
        {error && <p className="text-red-500 font-medium">{error}</p>}
      </div>

      <MapContainer
        loading={loading}
        error={error}
        userLocation={userLocation}
        mapUrl={mapUrl}
      />
    </div>
  );
}
