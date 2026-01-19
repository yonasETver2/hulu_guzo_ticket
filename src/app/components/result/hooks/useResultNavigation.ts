"use client";
import { useRouter } from "next/navigation";

export function useResultNavigation() {
  const router = useRouter();
  const handelBack = () => router.back();
  return { handelBack };
}
