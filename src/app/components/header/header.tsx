"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import User_info from "./user_info";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import styles from "./header.module.css";
import { HandleThemeChange } from "@/tools/handleThemeChange";
import { HandleLanguageChange } from "@/tools/handleLanguageChange";
import { LABELS } from "@/tools/languages";
import { useSession, signOut } from "next-auth/react";

type Lang = "en" | "am";
type Theme = "light" | "dark";

interface Provider {
  logo?: string | null;
  name?: string;
}

export default function Header() {
  const [mode, setMode] = useState(true);
  const { userVisibility, setUserVisibility, status, setStatus } =
    useGlobalState();

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  // Ensure lang is strongly typed
  const lang: Lang = (status.setting?.lang as Lang) || "en";
  const theme: Theme = (status.setting?.theme as Theme) || "light";

  // Toggle user info popup
  const handel_visibility = () => {
    setUserVisibility(!userVisibility);
  };

  // Theme change
  const change_mode = () => {
    setMode(!mode);
    changeTheme();
  };

  const changeTheme = () => {
    if (theme === "light") {
      HandleThemeChange(setStatus, "dark");
    } else {
      HandleThemeChange(setStatus, "light");
    }
  };

  // Language change
  const change_lang = () => {
    if (lang === "am") {
      HandleLanguageChange(setStatus, "en");
    } else {
      HandleLanguageChange(setStatus, "am");
    }
  };

  // Protected button click
  const handleProtectedClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    alert("Please log in to access this section.");
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full ${
          theme === "light" ? "bg-[#6ea5bf]" : "bg-gray-800"
        } py-2 shadow-md z-50`}
      >
        <div className="flex justify-between mx-2">
          {/* Left header */}
          <div className="flex space-x-4 justify-center items-center">
            <Image
              className="border hover:border-amber-300 rounded-[24px] cursor-pointer"
              src="/assets/icons/logo.png"
              alt="logo"
              width={48}
              height={48}
            />
            <div className="flex space-x-2 sm:space-x-4 text-white">
              {/* Home button */}
              <button
                onClick={async () => {
                  await signOut({ redirect: false });
                  window.location.href = "/";
                }}
                className="hover:text-amber-300 cursor-pointer"
              >
                {LABELS.home[lang]}
              </button>

              {/* About button conditional */}
              {isLoggedIn ? (
                <Link
                  className="hover:text-amber-300"
                  href="/components/about/"
                >
                  {LABELS.about[lang]}
                </Link>
              ) : (
                <button
                  onClick={handleProtectedClick}
                  className="opacity-70 cursor-not-allowed hover:text-amber-300"
                >
                  {LABELS.about[lang]}
                </button>
              )}
            </div>
          </div>

          {/* Right header */}
          <div className="flex space-x-4 justify-center items-center">
            {/* Language toggle */}
            <Image
              onClick={change_lang}
              className={`border hover:border-amber-300 cursor-pointer ${styles.vsfmd} ${styles.vsfsm}`}
              src={
                lang === "en"
                  ? "/assets/icons/lang_eng.png"
                  : "/assets/icons/lang_amh.png"
              }
              alt="language"
              width={48}
              height={20}
            />
            {/* Theme toggle */}
            <Image
              onClick={change_mode}
              className={`border hover:border-amber-300 cursor-pointer rounded-[10px] ${styles.vsfmd} ${styles.vsfsm}`}
              src={
                theme === "light"
                  ? "/assets/icons/day_mode.png"
                  : "/assets/icons/night_mode.png"
              }
              alt="mode"
              width={48}
              height={20}
            />
            {/* User profile */}
            <div
              onClick={handel_visibility}
              className="w-9 h-9 rounded-full overflow-hidden border bg-amber-500 cursor-pointer hover:border-amber-300"
            >
              <Image
                src={"/assets/images/person.png"}
                alt="person"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* User popup */}
          {userVisibility && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserVisibility(false)}
              />
              <div className="absolute z-50 top-[80px] right-0 mr-4 pointer-events-auto">
                <User_info />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[72px]" />
    </>
  );
}
