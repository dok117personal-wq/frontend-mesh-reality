"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LoginPromptProps {
  title?: string;
  description?: string;
  className?: string;
}

// All auth is handled on the main auth page (/signin) with the backend (session, OAuth, phone).
// This component prompts unauthenticated users to go there.
const LoginPrompt: React.FC<LoginPromptProps> = ({
  title = "Authentication Required",
  description = "Please sign in to access this feature.",
  className = "",
}) => {
  return (
    <div className={`bg-card/50 p-8 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm text-center ${className}`}>
      <div className="mb-6">
        <div className="w-16 h-16 bg-secondary/50 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
      </div>

      <div className="space-y-4">
        <Button asChild className="w-full bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2">
          <Link href="/signin">
            Sign in to continue
          </Link>
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default LoginPrompt;
