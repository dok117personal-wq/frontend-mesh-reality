"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StarryBackground } from "@/components/magicui/starry-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <StarryBackground />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
