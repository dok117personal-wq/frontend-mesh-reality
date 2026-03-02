"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { PhoneAuthForm } from "@/components/auth/phone-auth-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { BorderBeam } from "@/components/magicui/border-beam";
import { SocialProofTestimonials } from "@/components/magicui/testimonials";
import type { EnabledProviders } from "@/app/api/auth/providers/route";

export default function SignInPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [providers, setProviders] = useState<EnabledProviders | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then(setProviders)
      .catch(() => setProviders(null));
  }, []);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] w-screen flex-col items-center justify-start pt-52">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-20 md:left-8 md:top-24"
        )}
      >
        <>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[600px] z-10">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-4xl font-medium leading-none tracking-tighter bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-500">
            Sign in to your account
          </p>
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <BorderBeam
            size={300}
            duration={12}
            delay={11}
            colorFrom="var(--color-one)"
            colorTo="var(--color-two)"
          />
          <div className="relative z-20 backdrop-blur-sm bg-black/20 p-6 rounded-lg border border-white/10 shadow-xl">
            <div className="grid gap-6">
              <SocialAuthButtons enabled={providers} />

              {providers && !providers.google && !providers.apple && !providers.phone && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Sign-in requires backend. Set NEXT_PUBLIC_API_URL in .env to your backend URL. Auth is handled by the backend (cookies).
                </p>
              )}

              {providers?.phone && (
                <>
                  {(providers.google || providers.apple) && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>
                  )}
                  <PhoneAuthForm />
                </>
              )}
            </div>

            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="hover:text-white underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-40">
        <SocialProofTestimonials />
      </div>
    </div>
  );
}
