"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Upload,
  Box,
  Settings,
  LogOut,
  User,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Upload Model",
    icon: Upload,
    href: "/dashboard/upload",
    color: "text-violet-500",
  },
  {
    label: "My Models",
    icon: Box,
    href: "/dashboard/models",
    color: "text-pink-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function SideNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const getUserDisplayInfo = () => {
    return {
      name: user?.displayName || user?.email || "User",
      subtitle: user?.email || "",
      photoURL: user?.photoUrl ?? undefined,
    };
  };

  const userInfo = getUserDisplayInfo();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#111827] text-white">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center">
          <h1 className="text-2xl font-bold">
            Mesh Reality
          </h1>
        </Link>
      </div>
      <div className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          {userInfo.photoURL ? (
            <img
              src={userInfo.photoURL}
              alt={userInfo.name}
              className="rounded-full h-10 w-10 bg-white/10 flex items-center justify-center text-white"
            />
          ) : (
            <div className="rounded-full h-10 w-10 bg-white/10 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userInfo.name}</span>
            <span className="text-xs text-zinc-400">{userInfo.subtitle}</span>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
