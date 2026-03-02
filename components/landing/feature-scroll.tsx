"use client";

import { Section } from "@/components/section";
import { easeOutCubic } from "@/lib/animation";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import React, { useRef } from "react";

interface FeatureScrollProps {
  direction: "ltr" | "rtl";
  imageSrc: string;
  children: React.ReactNode;
  topPosition?: string;
}

const FeatureScrollContainer: React.FC<FeatureScrollProps> = ({
  direction,
  children,
  imageSrc,
  topPosition = "50%",
}) => {
  const isLTR = direction === "ltr";

  return (
    <div className="w-full">
      <div className="lg:hidden flex flex-col gap-y-10">
        <Image
          src={imageSrc}
          alt="Scrolling"
          width={300}
          height={600}
          className={`w-full max-w-[300px] mx-auto mb-4 ${isLTR ? "order-1" : "order-2"}`}
        />
        <div className={isLTR ? "order-2" : "order-1"}>{children}</div>
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 h-fit w-full justify-center items-start relative">
        <div
          className="sticky flex justify-center items-center"
          style={{ top: topPosition }}
        >
          {children}
        </div>
        <div
          className={`flex items-center justify-center h-fit ${isLTR ? "" : "row-start-1"}`}
        >
          <Image
            src={imageSrc}
            alt="Scrolling"
            width={300}
            height={600}
            className="w-full max-w-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export function FeatureScroll() {
  const phone1Ref = useRef(null);
  const phone2Ref = useRef(null);

  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: phone1Ref,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: phone2Ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress1, [0, 0.3], [150, 0], {
    ease: easeOutCubic,
  });
  const y2 = useTransform(scrollYProgress2, [0.1, 0.4], [200, 0], {
    ease: easeOutCubic,
  });

  return (
    <Section
      id="feature-scroll"
      className="container px-4 sm:px-10 relative"
    >
      <div className="flex flex-col gap-20">
        <FeatureScrollContainer
          topPosition="10%"
          direction="rtl"
          imageSrc="/Device-1.png"
        >
          <motion.div
            ref={phone1Ref}
            style={{ y: y1 }}
            className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 items-center justify-center lg:items-start lg:justify-start text-center lg:text-left"
          >
            <h1 className="text-4xl font-medium leading-none tracking-tighter bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl">AI-Powered Generation</h1>
            <p className="text-lg text-gray-500">
              Create stunning 3D models with our advanced AI technology. Transform your ideas into reality with unprecedented ease and precision.
            </p>
            <div className="flex gap-4 w-full">
              <button className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white px-6 py-2 rounded-md w-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </FeatureScrollContainer>

        <FeatureScrollContainer
          topPosition="10%"
          direction="ltr"
          imageSrc="/Device-2.png"
        >
          <motion.div
            ref={phone2Ref}
            style={{ y: y2 }}
            className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 items-center justify-center lg:items-start lg:justify-start text-center lg:text-left"
          >
            <h1 className="text-4xl font-medium leading-none tracking-tighter bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl">Real-time Customization</h1>
            <p className="text-lg text-gray-500">
              Customize and edit your 3D models in real-time. Our intuitive interface makes it easy to perfect every detail of your creation.
            </p>
            <div className="flex gap-4">
              <button className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white px-6 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                Try Now
              </button>
              <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </FeatureScrollContainer>
      </div>
    </Section>
  );
}
