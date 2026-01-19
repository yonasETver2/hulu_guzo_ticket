"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalStateProvider as AppProvider } from "@/app/globalContext/GlobalState";
import { GlobalStateProvider as PassengerProvider } from "@/tools/GlobalState";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>
        <PassengerProvider>{children}</PassengerProvider>
      </AppProvider>
    </SessionProvider>
  );
}
