"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import NavigateToInst from "../inst_location/NavigateToInst";
import { useGlobalState } from "@/app/globalContext/GlobalState";

function NavigateS() {
  const { status } = useGlobalState();

  return (
    <div>
      <div className="p-4">
        <div
          className={`fixed top-16 left-0 w-full p-4 shadow-md ${
            status.setting?.theme === "light" ? "bg-white" : "bg-gray-700"
          } flex justify-between items-center z-30`}
        >
          {/* Left */}
          <div className="flex space-x-3">
            <Link href="/pages/result">
              <Image
                src={
                  status.setting?.theme === "light"
                    ? "/assets/icons/bus.svg"
                    : "/assets/icons/bus_white.svg"
                }
                alt="bus"
                width={30}
                height={30}
              />
            </Link>

            <div className="border-b-2 pb-1 border-[#5376f6]">
              <div
                className={`${
                  status.setting?.theme === "light"
                    ? "bg-[#000000bd]"
                    : "bg-gray-300"
                } rounded-full w-[24px] h-[24px] flex justify-center items-center`}
              >
                <Image
                  src="/assets/icons/location.svg"
                  alt="gps"
                  width={12}
                  height={12}
                />
              </div>
            </div>

            <Link href="/pages/tiket">
              <Image
                src={
                  status.setting?.theme === "light"
                    ? "/assets/icons/bus_tiket.svg"
                    : "/assets/icons/bus_tiket_white.svg"
                }
                alt="ticket"
                width={24}
                height={24}
              />
            </Link>
          </div>

          {/* Right */}
          <div
            className={`${
              status.setting?.theme === "light"
                ? "bg-white"
                : "bg-gray-50 rounded-full"
            } flex justify-center items-center`}
          >
            <Image
              src="/assets/icons/bus_call.png"
              alt="call"
              width={30}
              height={30}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NavigateSiteClient() {
  return (
    <>
      <NavigateS />
      <div className="mt-5">
        <NavigateToInst />
      </div>
    </>
  );
}
