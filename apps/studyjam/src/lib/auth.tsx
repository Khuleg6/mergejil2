/* eslint-disable @typescript-eslint/no-empty-function */
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import { authStorage } from './authStorage';
import type { User } from './types';

const listeners = new Set<() => void>();
let currentUser: User | null = null;
let loaded = false;

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!loaded) {
    currentUser = authStorage.getUser();
    loaded = true;
  }
  return currentUser;
}

function getServerSnapshot() {
  return null;
}

const noopSubscribe = () => () => {};

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  setSession: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<{
  setSession: AuthContextValue['setSession'];
  logout: AuthContextValue['logout'];
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useCallback((token: string, nextUser: User) => {
    authStorage.setSession(token, nextUser);
    currentUser = nextUser;
    loaded = true;
    notify();
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    currentUser = null;
    loaded = true;
    notify();
  }, []);

  return (
    <AuthContext.Provider value={{ setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  return { user, ready, setSession: ctx.setSession, logout: ctx.logout };
}
