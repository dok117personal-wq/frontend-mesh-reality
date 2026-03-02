"use client";

import { Section } from "@/components/section";
import { BrainIcon, ClockIcon, CalendarIcon, CloudIcon, UsersIcon, BellIcon } from "lucide-react";
import Link from "next/link";

const features = [
  {
    name: "AI-Powered Generation",
    description:
      "Intelligent 3D model generation that learns your style and preferences.",
    icon: BrainIcon,
  },
  {
    name: "Real-time Editing",
    description:
      "Edit and customize your 3D models in real-time with instant feedback.",
    icon: ClockIcon,
  },
  {
    name: "Version Control",
    description:
      "Track changes and maintain different versions of your 3D models.",
    icon: CalendarIcon,
  },
  {
    name: "Cloud Storage",
    description: "Access your 3D models from anywhere with secure cloud storage.",
    icon: CloudIcon,
  },
  {
    name: "Team Collaboration",
    description: "Work together with team members on shared 3D projects.",
    icon: UsersIcon,
  },
  {
    name: "Smart Updates",
    description:
      "Get notified about model processing status and team activities.",
    icon: BellIcon,
  },
];

export function Features() {
  return (
    <Section
      id="features"
      subtitle="Powerful features"
      className="max-w-screen-lg mx-auto container px-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ name, description, icon: Icon }, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden bg-card p-6 flex flex-col items-center text-center"
          >
            <div className="flex flex-col items-center gap-y-4 mb-4">
              <div className="bg-gradient-to-br from-black/90 to-black/70 dark:from-white/90 dark:to-white/70 p-2 rounded-lg text-white dark:text-black">
                <Icon className="h-6 w-6" />
              </div>
              <div className="relative pb-4">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {name}
                </h2>
                {/* Gradients */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-32 blur-sm" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-32" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-16 blur-sm" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-16" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <Link href="#" className="text-sm text-primary hover:underline">
              Learn more &gt;
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
