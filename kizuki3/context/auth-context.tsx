import React, { createContext, useContext } from 'react';
import { type UserProfile, useAuth } from '@/hooks/use-auth';

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
