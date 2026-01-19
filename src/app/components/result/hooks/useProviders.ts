"use client";
import { useEffect, useState } from "react";

export function useProviders(lang: string) {
  const [providerList, setProviderList] = useState<any[]>([]);

  // read providers (UNCHANGED)
  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch("/api/getProvider");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data);
          return;
        }

        const providerOptions = data.map((provider) => ({
          id: provider.provider_id,
          en: provider.transporter_name,
          am: provider.transporter_name_amh,
          logo: provider.image_data
            ? Buffer.from(provider.image_data).toString("base64")
            : null,
          type: provider.image_type || "image/png",
        }));

        setProviderList(providerOptions);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    }

    loadProviders();
  }, [lang]);

  /** find bus provider name */
  function formatProviderName(
    providerId: string | number,
    lang?: string
  ): string {
    if (!providerList || providerList.length === 0) return "...";

    const provider = providerList.find(
      (p: any) => String(p.id) === String(providerId)
    );

    if (!provider) return "Unknown";

    return lang === "en" ? provider.en : provider.am;
  }

  /** find bus provider logo */
  function getProviderLogo(providerId: string | number): string {
    if (!providerList || providerList.length === 0) return "";

    const provider = providerList.find(
      (p: any) => String(p.id) === String(providerId)
    );

    if (!provider || !provider.logo) return "";

    return `data:${provider.type || "image/png"};base64,${provider.logo}`;
  }

  return {
    providerList,
    formatProviderName,
    getProviderLogo,
  };
}
