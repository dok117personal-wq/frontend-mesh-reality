"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Single auth page is /signin; redirect /login so all auth is handled there (with backend).
export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/signin");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
