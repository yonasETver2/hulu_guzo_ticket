"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  JSX,
} from "react";

import { useTheme } from "@/tools/useTheme";
import { useSetting } from "@/tools/useSetting";

// Type for the status state
interface StatusType {
  user: any;
  setting: {
    theme: any;
    lang: any;
  };
}

// Type for the full global context
export interface GlobalStateType {
  userVisibility: boolean;
  setUserVisibility: Dispatch<SetStateAction<boolean>>;
  status: StatusType;
  setStatus: Dispatch<SetStateAction<StatusType>>;
}

// Props for the provider
interface GlobalStateProviderProps {
  children: ReactNode;
}

// Create the context
const GlobalStateContext = createContext<GlobalStateType | undefined>(
  undefined
);

// Provider component
export const GlobalStateProvider = ({
  children,
}: GlobalStateProviderProps): JSX.Element => {
  const [userVisibility, setUserVisibility] = useState<boolean>(false);

  const [status, setStatus] = useState<StatusType>({
    user: null,
    setting: {
      theme: null,
      lang: null,
    },
  });

  useSetting(status, setStatus);
  useTheme(status);

  return (
    <GlobalStateContext.Provider
      value={{
        userVisibility,
        setUserVisibility,
        status,
        setStatus,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Hook to use the global state
export const useGlobalState = (): GlobalStateType => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
