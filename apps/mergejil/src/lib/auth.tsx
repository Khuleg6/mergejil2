/* eslint-disable @typescript-eslint/no-empty-function */
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  // Хадгалсан токен хүчинтэй эсэхийг сервер дээр шалгана. Хугацаа дууссан
  // токентой үед апп нэвтэрсэн гэж үзээд тест өгүүлдэг, харин үр дүн 401-ээр
  // хадгалагдахгүй байсан — тиймээс буруу session-ыг цэвэрлэнэ.
  useEffect(() => {
    const token = authStorage.getToken();
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;

        if (res.status === 401) {
          authStorage.clear();
          currentUser = null;
          loaded = true;
          notify();
          return;
        }
        if (!res.ok) return;

        // Серверийн хувилбараар шинэчилнэ (нэр, avatar зэрэг өөрчлөгдсөн бол).
        const fresh = (await res.json()) as User;
        if (cancelled) return;
        authStorage.setSession(token, fresh);
        currentUser = fresh;
        loaded = true;
        notify();
      } catch {
        // Сүлжээний алдаа — хадгалсан session-ыг хүчингүй болгохгүй.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
