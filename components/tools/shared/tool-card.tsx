import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
  proOnly?: boolean;
  className?: string;
}

const ToolCard = ({
  title,
  description,
  icon,
  href,
  comingSoon = false,
  proOnly = false,
  className = "",
}: ToolCardProps) => {
  return (
    <Link
      href={comingSoon ? "#" : href}
      className={`block p-6 bg-card/50 rounded-lg shadow-lg border border-white/10 backdrop-blur-sm transition-all ${
        !comingSoon ? "hover:shadow-xl hover:border-white/20" : "opacity-70 cursor-not-allowed"
      } ${className}`}
    >
      <div className="flex items-start">
        <div className="w-12 h-12 bg-secondary/50 border border-white/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <div className="flex items-center mb-1">
            <h3 className="font-bold text-lg">{title}</h3>
            {proOnly && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-900/50 text-indigo-300 text-xs rounded-full border border-indigo-500/50">
                PRO
              </span>
            )}
            {comingSoon && (
              <span className="ml-2 px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded-full border border-blue-500/50">
                Coming Soon
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
