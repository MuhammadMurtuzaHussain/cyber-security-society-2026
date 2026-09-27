import { useCallback, useEffect, useState } from "react";

type StaticUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

const STORAGE_KEY = "cyber-society-static-user-v1";
const DEMO_USER: StaticUser = {
  id: 1,
  name: "Cyber Recruit",
  email: "recruit@cyber-society.local",
  role: "user",
};

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const [user, setUser] = useState<StaticUser | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ? DEMO_USER : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!options?.redirectOnUnauthenticated || user) return;
    window.location.hash = options.redirectPath ?? "/";
  }, [options?.redirectOnUnauthenticated, options?.redirectPath, user]);

  const logout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    user,
    loading: false,
    error: null,
    isAuthenticated: Boolean(user),
    refresh: async () => undefined,
    logout,
  };
}

export function activateStaticDemoUser() {
  localStorage.setItem(STORAGE_KEY, "active");
}

export type { StaticUser };
