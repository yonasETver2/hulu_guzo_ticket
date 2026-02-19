"use client";
import { useEffect, useState } from "react";

export function useProviders(lang: string) {
  const [providerList, setProviderList] = useState<
    {
      id: number;
      en: string;
      am: string;
      logo: string; // already a data URI from backend
      type: string;
    }[]
  >([]);

  // Load providers from API
  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch("/api/getProvider");
        const data = await res.json();

        const providersArray = data.providers ?? [];

        const providerOptions = providersArray.map((provider: any) => ({
          id: provider.id,
          en: provider.en,
          am: provider.am,
          logo: provider.logo || "", // Already full data URI
          type: provider.type || "image/png",
        }));

        setProviderList(providerOptions);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    }

    loadProviders();
  }, [lang]);

  /** Get provider name by ID */
  function formatProviderName(providerId: string | number): string {
    const provider = providerList.find(
      (p) => String(p.id) === String(providerId)
    );
    if (!provider) return "Unknown";
    return lang === "en" ? provider.en : provider.am;
  }

  /** Get provider logo by ID */
  function getProviderLogo(providerId: string | number): string {
    const provider = providerList.find(
      (p) => String(p.id) === String(providerId)
    );
    if (!provider || !provider.logo) return "";
    return provider.logo; // ✅ Already contains full data URI
  }

  return {
    providerList,
    formatProviderName,
    getProviderLogo,
  };
}
