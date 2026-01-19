"use client"; // Client-side only for this route

import React, { useEffect, useState } from "react";
import ResultPage from "@/app/components/result/ResultPage";

// Ensure we handle the query params dynamically on client-side
export const dynamic = "force-dynamic"; // Prevent SSR

export default function Page() {
  const [loading, setLoading] = useState(true);

  // Wait for client-side rendering
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ResultPage />;
}
