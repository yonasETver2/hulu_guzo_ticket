"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchParamsWrapper({
  setSearchParams,
}: {
  setSearchParams: (params: URLSearchParams) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return null;
}
