"use client";

import React, { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/app/globalContext/GlobalState";
import styles from "./header.module.css";

import { HandleThemeChange } from "@/tools/handleThemeChange";
import { HandleLanguageChange } from "@/tools/handleLanguageChange";

export default function User_info() {
  const { data: session } = useSession();

  // 🔥 Logged-in User Info
  const userName = session?.user?.name || "User";
  const userLogo = "/assets/images/person.png";

  const { setUserVisibility, status, setStatus } = useGlobalState();
  const [pencilToggle, setPencilToggel] = useState(false);
  const [cross, setCross] = useState(false);

  const router = useRouter();

  const handel_visiblity = () => setUserVisibility(false);
  const handel_mouse_in = () => setPencilToggel(true);
  const handel_mouse_out = () => setPencilToggel(false);
  const handel_cross_mousein = () => setCross(true);
  const handel_cross_mouseout = () => setCross(false);

  const [lang, setLang] = useState(true);
  const [mode, setMode] = useState(true);

  const change_mode = () => {
    setMode(!mode);
    changeTheme();
  };

  const change_lang = () => {
    setLang(!lang);
    changeLanguage();
  };

  const changeTheme = () => {
    if (status.setting.theme === "light") {
      HandleThemeChange(setStatus, "dark");
    } else {
      HandleThemeChange(setStatus, "light");
    }
  };

  const changeLanguage = () => {
    if (status.setting.lang === "am") {
      HandleLanguageChange(setStatus, "en");
    } else {
      HandleLanguageChange(setStatus, "am");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/components/login");
  };

  const handleEdit = () => {
    alert(
      status.setting?.lang === "en"
        ? "This feature is not currently available"
        : "ይህ አገልግሎት ለጊዜው አይገኝም"
    );
    //router.push(`/pages/login?userType=user&task=edit`);
  };

  return (
    <div
      className={`bg-[#e1dddd] bg-info text-black dark:bg-gray-800 border-1 border-gray-300 shadow-md px-2 rounded-md space-y-2 w-[200px]`}
    >
      <div className="flex justify-end">
        <button
          onMouseEnter={handel_cross_mousein}
          onMouseLeave={handel_cross_mouseout}
          onClick={handel_visiblity}
          className="cursor-pointer mt-2"
        >
          <Image
            src={`${
              cross == false
                ? "/assets/icons/cross_close.svg"
                : "/assets/icons/cross_close_hover.svg"
            }`}
            alt="cross"
            width={10}
            height={10}
          />
        </button>
      </div>

      {/* User photo + name */}
      <div className="flex justify-center">
        <div className="relative flex flex-col items-center">
          <div className="relative rounded-full overflow-hidden border-2 border-gray-300 w-20 h-20">
            <Image
              src={userLogo}
              alt={userName}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
            <Image
              onMouseEnter={handel_mouse_in}
              onMouseLeave={handel_mouse_out}
              onClick={handleEdit}
              src={
                pencilToggle
                  ? "/assets/icons/pencil_btn_hover.svg"
                  : "/assets/icons/pencil_btn.svg"
              }
              alt="edit"
              width={20}
              height={20}
              className="absolute bottom-0 right-0 -translate-x-1/4 -translate-y-1/4 bg-white p-[2px] rounded-full cursor-pointer shadow-md"
            />
          </div>

          <p className="mt-2 text-lg font-semibold text-center">{userName}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="h-auto">
        <div className={`space-y-2 ${styles.vsmd} ${styles.vssm}`}>
          <div className="flex items-center justify-between">
            <p>Language</p>
            <Image
              onClick={change_lang}
              className="border hover:border-amber-300 cursor-pointer"
              src={
                status.setting.lang === "en"
                  ? "/assets/icons/lang_eng.png"
                  : "/assets/icons/lang_amh.png"
              }
              alt="language"
              width={48}
              height={20}
            />
          </div>

          <div className="flex justify-between items-center">
            <p>Mode</p>
            <Image
              onClick={change_mode}
              className="border hover:border-amber-300 cursor-pointer rounded-[10px]"
              src={
                status.setting.theme === "light"
                  ? "/assets/icons/day_mode.png"
                  : "/assets/icons/night_mode.png"
              }
              alt="mode"
              width={48}
              height={20}
            />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="my-2 text-[#5376f6] hover:text-[#6ea5bf] cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
