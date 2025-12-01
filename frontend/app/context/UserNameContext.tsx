"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

type UserNameContextValue = {
  userName: string | null;
  setUserName: (name: string | null) => void;
};

const UserNameContext = createContext<UserNameContextValue | undefined>(
  undefined
);

export function UserNameProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      userName,
      setUserName,
    }),
    [userName]
  );

  return (
    <UserNameContext.Provider value={value}>
      {children}
    </UserNameContext.Provider>
  );
}

export function useUserName() {
  const ctx = useContext(UserNameContext);
  if (!ctx) {
    throw new Error("useUserName must be used within a UserNameProvider");
  }
  return ctx;
}
