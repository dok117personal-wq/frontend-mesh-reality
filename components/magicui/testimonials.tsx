"use client";

import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { StarFilledIcon } from "@radix-ui/react-icons";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-indigo-600/20 p-1 py-0.5 font-bold text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400",
        className,
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      "border border-white/10 bg-black/20 backdrop-blur-sm",
      className,
    )}
    {...props}
  >
    <div className="select-none text-sm font-normal text-neutral-300">
      {description}
      <div className="flex flex-row py-1">
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <img
        src={img}
        className="h-10 w-10 rounded-full ring-1 ring-white/10 ring-offset-4 ring-offset-black"
        alt={name}
      />

      <div>
        <p className="font-medium text-neutral-300">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Alex Rivera",
    role: "3D Artist",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    description: (
      <p>
        <Highlight>
          The AI-powered model generation is incredibly accurate.
        </Highlight>{" "}
        It&apos;s revolutionized my workflow and saved me countless hours.
      </p>
    ),
  },
  {
    name: "Samantha Lee",
    role: "Game Developer",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <p>
        <Highlight>Real-time customization is a game-changer.</Highlight> The
        ability to iterate quickly has improved our development process
        significantly.
      </p>
    ),
  },
  {
    name: "Raj Patel",
    role: "Product Designer",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <p>
        The cloud storage and version control features are fantastic.{" "}
        <Highlight>Collaboration has never been easier.</Highlight> Essential for
        any design team.
      </p>
    ),
  },
  {
    name: "Emily Chen",
    role: "Creative Director",
    img: "https://randomuser.me/api/portraits/women/83.jpg",
    description: (
      <p>
        <Highlight>The quality of generated models is outstanding.</Highlight>{" "}
        It&apos;s helped us deliver projects faster without compromising on quality.
      </p>
    ),
  },
  {
    name: "Michael Brown",
    role: "Indie Developer",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    description: (
      <p>
        As a solo developer, this platform has been invaluable.{" "}
        <Highlight>
          It&apos;s like having a professional 3D artist on the team.
        </Highlight>
      </p>
    ),
  },
  {
    name: "Linda Wu",
    role: "VR Designer",
    img: "https://randomuser.me/api/portraits/women/5.jpg",
    description: (
      <p>
        <Highlight>Perfect for VR content creation.</Highlight> The models work
        seamlessly in our virtual environments.
      </p>
    ),
  },
];

export function SocialProofTestimonials() {
  return (
    <section id="testimonials" className="mt-12">
      <div className="py-8">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="text-center text-sm font-semibold text-gray-400">
            TRUSTED BY CREATORS WORLDWIDE
          </h3>
          <div className="relative mt-6 max-h-[450px] overflow-hidden">
            <div className="gap-4 md:columns-2 xl:columns-3">
              {Array(Math.ceil(testimonials.length / 2))
                .fill(0)
                .map((_, i) => (
                  <Marquee
                    vertical
                    key={i}
                    className={cn({
                      "[--duration:40s]": i === 0,
                      "[--duration:30s]": i === 1,
                      "[--duration:50s]": i === 2,
                    })}
                  >
                    {testimonials.slice(i * 2, (i + 1) * 2).map((card, idx) => (
                      <TestimonialCard {...card} key={idx} />
                    ))}
                  </Marquee>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-black from-20%"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-black from-20%"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
