"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/**
 * App Install Banner Component
 * 
 * This component displays a banner prompting mobile users to install the app.
 * It appears at the bottom of the screen and can be dismissed.
 * The banner is only shown on mobile devices and remembers if it has been dismissed.
 */
export function AppInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user is on mobile and hasn't dismissed the banner
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const bannerDismissed = localStorage.getItem("appBannerDismissed");
    
    setIsIOS(/iPhone|iPad|iPod/i.test(navigator.userAgent));
    
    if (isMobile && !bannerDismissed) {
      setShowBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    localStorage.setItem("appBannerDismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 z-50 flex items-center justify-between">
      <div>
        <p className="font-medium">Get the Mesh Reality App</p>
        <p className="text-sm opacity-90">Create 3D models on the go</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => window.location.href = isIOS 
            ? "https://apps.apple.com/app/CHANGEME" // Replace with actual App Store URL when available
            : "https://play.google.com/store/apps/details?id=CHANGEME" // Replace with actual Play Store URL when available
          }
        >
          Download Now
        </Button>
        <Button variant="ghost" size="icon" onClick={dismissBanner}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
}
