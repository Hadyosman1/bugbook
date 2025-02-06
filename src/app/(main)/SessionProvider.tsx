"use client";

import { createContext, useContext } from "react";
import { Session, User } from "lucia";

interface SessionContext {
  session: Session;
  user: User;
}

const SessionContext = createContext<SessionContext | null>(null);

interface SessionProviderProps {
  children: React.ReactNode;
  value: SessionContext;
}

const SessionProvider = ({ children, value }: SessionProviderProps) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
export default SessionProvider;

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
