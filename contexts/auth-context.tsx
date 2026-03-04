"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { API_URL, backendFetchHeaders } from "@/lib/api-client";

interface BackendUser {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

interface AuthContextType {
  user: BackendUser | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const refreshSession = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/session`, {
        credentials: "include",
        headers: { ...backendFetchHeaders() },
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const body = await res.json();
      const data = body?.data ?? body;
      setUser(data ?? null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const isProtected =
      pathname?.startsWith("/dashboard") ||
      pathname === "/tools/model-generator" ||
      pathname === "/tools/photogrammetry";
    if (!loading && !user && isProtected) {
      router.push("/signin");
    }
  }, [user, loading, router, pathname]);

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { ...backendFetchHeaders() },
      });
      await fetch("/api/auth/clear-session", { method: "POST", credentials: "include" });
      setUser(null);
      router.push("/signin");
      toast.success("Signed out successfully");
    } catch (err) {
      console.error("Error signing out:", err);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}
