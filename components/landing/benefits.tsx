"use client";

import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { WavyBackground } from "@/components/magicui/wavy-background";
import Image from "next/image";

const benefits = [
  {
    id: 1,
    text: "Save hours with AI-powered 3D model generation.",
    image: "/Device-6.png",
  },
  {
    id: 2,
    text: "Reduce iterations with real-time customization.",
    image: "/Device-7.png",
  },
  {
    id: 3,
    text: "Improve workflow with team collaboration features.",
    image: "/Device-8.png",
  },
  {
    id: 4,
    text: "Increase productivity with cloud-based model management.",
    image: "/Device-1.png",
  },
];

export function Benefits() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <WavyBackground 
        className="absolute inset-0 z-[-1]" 
        containerClassName="h-full"
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
        waveWidth={50}
        backgroundFill="#000"
        blur={10}
        speed="slow"
        waveOpacity={0.3}
        verticalPosition={0.3}
      />
      <Section
        subtitle="What you can do with Mesh Reality"
        className="relative z-10 max-w-screen"
      >
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Add empty div for extra gap on desktop */}
          <div
            className="hidden md:block flex-shrink-0 w-[calc(90%-1rem)] md:w-1/3 lg:w-1/3 xl:w-1/4 snap-start select-none px-4"
            aria-hidden="true"
          />
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="flex-shrink-0 w-[calc(90%-1rem)] md:w-1/3 lg:w-1/3 xl:w-1/4 snap-center md:snap-start select-none px-4"
            >
              <div className="h-[500px] relative rounded-xl overflow-hidden">
                <Image
                  src={benefit.image}
                  alt={benefit.text}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-all duration-500 ease-out object-[0px_10px] hover:object-top"
                  priority={benefit.id === 1} // Only prioritize the first image
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-muted to-transparent pointer-events-none" />
              </div>
              <div className="mt-4">
                <h2 className="text-balance text-xl tracking-tight font-semibold leading-[1.25] text-left text-foreground/80 dark:text-foreground/90">
                  {benefit.text}
                </h2>
              </div>
            </div>
          ))}
          {/* Add empty div for extra gap on desktop */}
          <div
            className="hidden md:block flex-shrink-0 w-1/3 lg:w-1/3 xl:w-1/4 snap-start"
            aria-hidden="true"
          />
        </div>
        <div className="flex justify-center md:justify-end mt-4 md:mt-8 md:pr-32">
          <div className="flex gap-4">
            <Button
              onClick={scrollPrev}
              className="size-8 rounded-full"
              variant="outline"
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              onClick={scrollNext}
              className="size-8 rounded-full"
              variant="outline"
              size="icon"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
