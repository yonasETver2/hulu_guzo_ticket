"use client";
import { useEffect, useRef, useState } from "react";

export function usePhoneDropdown() {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const phoneRef = useRef<HTMLDivElement | null>(null);

  const handlePhoneClick = () => {
    setPhoneOpen(!phoneOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        phoneRef.current &&
        !phoneRef.current.contains(event.target as Node)
      ) {
        setPhoneOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    phoneOpen,
    phoneRef,
    handlePhoneClick,
    closePhone: () => setPhoneOpen(false),
  };
}
