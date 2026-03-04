"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { API_URL, backendFetchHeaders } from "@/lib/api-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    // Supabase may send token in hash (#access_token=...) or, if hash is stripped, in query (?access_token=...)
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const search = typeof window !== "undefined" ? window.location.search : "";
    const fromHash = new URLSearchParams(hash.slice(1)).get("access_token");
    const fromQuery = new URLSearchParams(search.slice(1)).get("access_token");
    const accessToken = fromHash ?? fromQuery ?? null;

    if (!accessToken) {
      setError("No token received. Please try signing in again.");
      return;
    }

    started.current = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...backendFetchHeaders() },
          body: JSON.stringify({ access_token: accessToken }),
          credentials: "include",
        });
        if (!res.ok) throw new Error("Login failed");
        await res.json();

        // Set the same session token as a cookie on the frontend origin so that
        // same-origin requests (e.g. POST /api/generate-model) include it and
        // the Next.js server can forward it to the backend.
        await fetch("/api/auth/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: accessToken }),
          credentials: "include",
        });

        // Update auth context with the new session before redirecting,
        // so the app doesn't think we're unauthenticated and send us to signin.
        await refreshSession();
        window.history.replaceState(null, "", window.location.pathname);
        router.replace("/dashboard");
      } catch {
        setError("Sign-in failed. Please try again.");
        started.current = false;
      }
    })();
  }, [router, refreshSession]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <a href="/signin" className="text-primary underline">
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
