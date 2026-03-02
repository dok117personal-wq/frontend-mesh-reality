"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

interface UsePhoneAuthReturn {
  loading: boolean;
  error: string | null;
  sendVerificationCode: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
}

export function usePhoneAuth(): UsePhoneAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>("");
  const router = useRouter();
  const { refreshSession } = useAuth();

  const sendVerificationCode = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      const formatted = phoneNumber.startsWith("+") ? phoneNumber : `+1${phoneNumber.replace(/\D/g, "")}`;
      setPhone(formatted);

      const res = await fetch(`${API_URL}/api/auth/phone/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formatted }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Failed to send code");
      }
      toast.success("Verification code sent!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send code";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/api/auth/phone/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, token: code }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Invalid code");
      }
      const token = data?.data?.token;
      if (token) {
        await fetch("/api/auth/set-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          credentials: "include",
        });
      }
      await refreshSession();
      toast.success("Signed in!");
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid code";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendVerificationCode,
    verifyCode,
  };
}
