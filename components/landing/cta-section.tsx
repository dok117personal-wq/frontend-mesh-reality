"use client";

import Link from "next/link";
import { StoreIcons } from "@/components/landing/store-icons";
import { Squares } from "@/components/magicui/squares-background";

export default function CallToActionSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Squares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333" 
          hoverFillColor="#222"
        />
      </div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl font-medium leading-none tracking-tighter bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap">
              Experience Our Mobile App
            </h2>
            <p className="text-sm text-muted-foreground md:text-base max-w-2xl mx-auto">
              Discover a seamless mobile experience with our feature-rich app.
              Designed for convenience and efficiency, it puts the power of
              our platform right at your fingertips, anytime and anywhere.
            </p>
          </div>
          <StoreIcons />
        </div>
      </div>
    </section>
  );
}
