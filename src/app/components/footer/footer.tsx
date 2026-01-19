"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGlobalState } from "@/app/globalContext/GlobalState";

export default function Page() {
  const { status } = useGlobalState();
  return (
    <div
      className={`py-2 landscape-box ${
        status.setting?.theme === "light" ? "bg-[#6ea5bf]" : "bg-gray-800"
      } md:fixed md:bottom-0 md:left-0 md:right-0 z-50 w-full`}
    >
      <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between mx-2 gap-y-4 text-center md:text-left">

        {/* Left Bottom Bar */}
        <div className="flex justify-center items-center space-x-4">
          <Image
            className=" hidden sm:block border hover:border-amber-300 rounded-[24px] cursor-pointer"
            src="/assets/icons/logo.png"
            width={48}
            height={48}
            alt="logo"
          />
          <div className="flex space-x-2 sm:space-x-5">
            <Image
              className="border hover:border-amber-300 cursor-pointer rounded-md"
              src="/assets/icons/youtube.png"
              width={24}
              height={24}
              alt="youtube"
            />
            <Image
              className="border hover:border-amber-300 cursor-pointer rounded-[20px]"
              src="/assets/icons/facebook.png"
              width={24}
              height={24}
              alt="facebook"
            />
            <Image
              className="border hover:border-amber-300 cursor-pointer rounded-[10px]"
              src="/assets/icons/tiktok.svg"
              width={24}
              height={24}
              alt="tiktok"
            />
            <Image
              className="border hover:border-amber-300 cursor-pointer rounded-[20px]"
              src={
                status.setting?.theme === "light"
                  ? "/assets/icons/x.svg"
                  : "/assets/icons/x_white.svg"
              }
              width={24}
              height={24}
              alt="x"
            />
          </div>
        </div>

        {/* middle*/}
        <div className="flex justify-center items-center w-full md:w-auto text-white">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 Your Company. All rights reserved.</p>
          </div>
        </div>

        {/* Right Bottom Bar */}
        <div className="space-y-3 flex justify-center items-center text-white italic">
          <div>
            <Link
              className="block text-center hover:text-amber-300 cursor-pointer"
              href="/"
            >
              hulunat.net.et
            </Link>
            <Link
              className="block text-center hover:text-amber-300 cursor-pointer"
              href="/"
            >
              +251-922-598191
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
