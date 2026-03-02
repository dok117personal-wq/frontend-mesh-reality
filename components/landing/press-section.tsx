"use client";

import Marquee from "@/components/magicui/marquee";

const press = [
  "TheNewYorkTimes",
  "TheWashingtonPost",
  "Forbes",
  "Bloomberg",
  "BusinessInsider",
  "TechCrunch",
  "TheGuardian",
  "Wired",
];

export default function PressSection() {
  return (
    <section id="press" className="relative overflow-hidden">
      <div className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
            Featured In
          </h3>
          <div className="relative mt-8">
            <Marquee 
              className="max-w-full [--duration:30s] [--gap:2rem]" 
              pauseOnHover={true}
            >
              {press.map((logo, idx) => (
                <div key={idx} className="flex items-center justify-center px-4">
                  <img
                    src={`https://cdn.magicui.design/press/${logo}.svg`}
                    className="h-8 w-auto opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0 dark:brightness-0 dark:invert"
                    alt={`${logo} logo`}
                    loading="lazy"
                  />
                </div>
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
