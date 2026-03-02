import { Metadata } from "next";
import { Benefits } from "@/components/landing/benefits";
import CallToActionSection from "@/components/landing/cta-section";
import { Features } from "@/components/landing/features";
import { FeatureScroll } from "@/components/landing/feature-scroll";
import HeroSection from "@/components/landing/hero-section";
import PressSection from "@/components/landing/press-section";
import PricingSection from "@/components/landing/pricing-section";
import FAQSection from "@/components/landing/faq-section";
import { SphereMask } from "@/components/magicui/sphere-mask";
import { StarryBackground } from "@/components/magicui/starry-background";
import JsonLd from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Revolutionary 3D Generation for Modern Creators",
  description: "Experience the future of 3D content creation with Mesh Reality's advanced AI technology. Create, customize, and share your 3D models with unprecedented ease.",
  openGraph: {
    title: "Mesh Reality - Create Amazing 3D Models with AI",
    description: "Transform your ideas into stunning 3D models with our mobile app. Available soon on iOS and Google Play.",
    images: [
      {
        url: "/og-marketing-page.jpg", // Create a marketing-specific OG image
        width: 1200,
        height: 630,
        alt: "Mesh Reality App Interface",
      },
    ],
  },
};

export default function Page() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Mesh Reality",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0", // Update with actual pricing if not free
      "priceCurrency": "USD"
    },
    "description": "AI-powered 3D model generation mobile app",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8", // CHANGEME: Update with actual rating
      "ratingCount": "1250" // CHANGEME: Update with actual count
    },
    "featureList": "AI-Powered Generation, Real-time Editing, Version Control, Cloud Storage, Team Collaboration",
    "screenshot": "https://meshreality.com/Device-1.png", // Replace with actual domain when available
    "softwareVersion": "1.0", // CHANGEME: Update with actual version
    "author": {
      "@type": "Organization",
      "name": "Mesh Reality",
      "url": "https://meshreality.com" // Replace with actual domain when available
    }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      {/* Hero and Press sections with starry background */}
      <div className="relative w-full overflow-hidden">
        {/* The starry background positioned to cover from top of page to end of this container */}
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        <HeroSection />
        <PressSection />
      </div>
      
      {/* Rest of the page content */}
      <SphereMask />
      <FeatureScroll />
      <Features />
      <Benefits />
      <PricingSection />
      <FAQSection />
      <CallToActionSection />
    </>
  );
}
