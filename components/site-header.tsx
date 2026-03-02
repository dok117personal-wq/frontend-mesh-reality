"use client";

import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlignJustify, XIcon, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/contexts/auth-context";

const menuItem = [
  {
    id: 1,
    label: "Tools",
    href: "/tools",
    submenu: [
      {
        id: "model-viewer",
        label: "Model Viewer",
        href: "/tools/model-viewer",
        description: "View and interact with 3D models in various formats"
      },
      {
        id: "photogrammetry",
        label: "Photogrammetry",
        href: "/tools/photogrammetry",
        description: "Convert photos into detailed 3D models"
      },
      {
        id: "gaussian-splatting",
        label: "Gaussian Splatting",
        href: "/tools/gaussian-splatting",
        description: "Create high-quality 3D representations"
      },
      {
        id: "floor-plan",
        label: "Floor Plan Generator",
        href: "/tools/floor-plan",
        description: "Generate accurate floor plans from 3D models"
      },
      {
        id: "model-generator",
        label: "Model Generator",
        href: "/tools/model-generator",
        description: "Generate 3D models from text descriptions using AI"
      }
    ]
  },
  {
    id: 2,
    label: "Features",
    href: "/features",
  },
  {
    id: 3,
    label: "Pricing",
    href: "/pricing",
  },
  {
    id: 4,
    label: "Mobile App",
    href: "/mobile-app",
  },
  {
    id: 5,
    label: "Contact Us",
    href: "/contact",
  },
];

export function SiteHeader() {
  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;

  // Track scroll position to determine if we've scrolled past the hero section
  useEffect(() => {
    const handleScroll = () => {
      // Assuming hero section is approximately 100vh (adjust as needed)
      const heroHeight = window.innerHeight;
      setScrolledPastHero(window.scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobilenavbarVariant = {
    initial: {
      opacity: 0,
      scale: 1,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const buttonVariant = {
    initial: {
      opacity: 0,
      y: -10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const mobileLinkVar = {
    initial: {
      y: "-20px",
      opacity: 0,
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) html.classList.toggle("overflow-hidden", hamburgerMenuIsOpen);
  }, [hamburgerMenuIsOpen]);

  useEffect(() => {
    const closeHamburgerNavigation = () => setHamburgerMenuIsOpen(false);
    window.addEventListener("orientationchange", closeHamburgerNavigation);
    window.addEventListener("resize", closeHamburgerNavigation);

    return () => {
      window.removeEventListener("orientationchange", closeHamburgerNavigation);
      window.removeEventListener("resize", closeHamburgerNavigation);
    };
  }, [setHamburgerMenuIsOpen]);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
        <div className="container flex h-[3.5rem] items-center justify-between">
          <Link className="text-md flex items-center" href="/">
            Mesh Reality
          </Link>

          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              {menuItem.map((item) => (
                <div key={item.id} className="relative group">
                  <Link
                    href={item.href}
                    className="text-sm font-medium hover:text-gray-300 transition-colors"
                  >
                    {item.label}
                  </Link>
                  
                  {item.submenu && (
                    <div className="absolute left-0 mt-2 w-72 bg-card/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-4 grid gap-3">
                        {item.submenu.map((subitem) => (
                          <Link 
                            key={subitem.id} 
                            href={subitem.href}
                            className="block p-2 hover:bg-white/5 rounded-md transition-colors"
                          >
                            <div className="font-medium">{subitem.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">{subitem.description}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {!authLoading && isAuthenticated ? (
                <motion.div
                  key="dashboard-button"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={buttonVariant}
                >
                  <Button
                    asChild
                    variant="ghost"
                    className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white px-6 py-2 rounded-md mr-6 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                </motion.div>
              ) : scrolledPastHero ? (
                <motion.div
                  key="create-button"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={buttonVariant}
                >
                  <RainbowButton
                    className="mr-6"
                    onClick={() => window.location.href = '/signup'}
                  >
                    <span>Start Creating Now</span>
                    <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                  </RainbowButton>
                </motion.div>
              ) : (
                <motion.div
                  key="login-button"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={buttonVariant}
                >
                  <Button 
                    asChild 
                    variant="ghost"
                    className="bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white px-6 py-2 rounded-md mr-6 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Link href="/signin">
                      <span>Login</span>
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="ml-6 md:hidden"
            onClick={() => setHamburgerMenuIsOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        <motion.nav
          initial="initial"
          exit="exit"
          variants={mobilenavbarVariant}
          animate={hamburgerMenuIsOpen ? "animate" : "exit"}
          className={cn(
            `fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-background/70 backdrop-blur-[12px] `,
            {
              "pointer-events-none": !hamburgerMenuIsOpen,
            }
          )}
        >
          <div className="container flex h-[3.5rem] items-center justify-between">
            <Link className="text-md flex items-center" href="/">
              Mesh Reality
            </Link>

            <button
              className="ml-6 md:hidden"
              onClick={() => setHamburgerMenuIsOpen((open) => !open)}
            >
              <span className="sr-only">Toggle menu</span>
              {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
            </button>
          </div>
          <motion.ul
            className={`flex flex-col md:flex-row md:items-center uppercase md:normal-case ease-in`}
            variants={containerVariants}
            initial="initial"
            animate={hamburgerMenuIsOpen ? "open" : "exit"}
          >
            {menuItem.map((item) => (
              <motion.li
                variants={mobileLinkVar}
                key={item.id}
                className="border-grey-dark pl-6 py-0.5 border-b md:border-none"
              >
                <Link
                  className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${
                    hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
                
                {item.submenu && hamburgerMenuIsOpen && (
                  <div className="pl-4 mt-2 mb-2 space-y-2">
                    {item.submenu.map((subitem) => (
                      <motion.div
                        key={subitem.id}
                        variants={mobileLinkVar}
                        className="py-1"
                      >
                        <Link
                          href={subitem.href}
                          className="text-gray-400 hover:text-white text-base flex flex-col"
                        >
                          <span>{subitem.label}</span>
                          <span className="text-xs text-gray-500">{subitem.description}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.li>
            ))}
            {!authLoading && isAuthenticated ? (
              <motion.li
                variants={mobileLinkVar}
                className="border-grey-dark pl-6 py-0.5 border-b md:border-none"
              >
                <Link
                  className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${
                    hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""
                  }`}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </motion.li>
            ) : (
              <>
                <motion.li
                  variants={mobileLinkVar}
                  className="border-grey-dark pl-6 py-0.5 border-b md:border-none"
                >
                  <Link
                    className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${
                      hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""
                    }`}
                    href="/signup"
                  >
                    Start Creating Now
                  </Link>
                </motion.li>
                <motion.li
                  variants={mobileLinkVar}
                  className="border-grey-dark pl-6 py-0.5 border-b md:border-none"
                >
                  <Link
                    className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${
                      hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""
                    }`}
                    href="/signin"
                  >
                    Login
                  </Link>
                </motion.li>
              </>
            )}
          </motion.ul>
        </motion.nav>
      </AnimatePresence>
    </>
  );
}
