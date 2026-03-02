import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import { StarryBackground } from "@/components/magicui/starry-background";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Mesh Reality",
  description: "Learn about Hack House, the team behind Mesh Reality - an AI-powered 3D model generation platform.",
  openGraph: {
    title: "About Mesh Reality - AI-Powered 3D Generation",
    description: "Learn about Hack House, the team behind Mesh Reality - an AI-powered 3D model generation platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Mesh Reality",
      },
    ],
  },
};

export default function AboutPage() {
  const companyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hack House",
    "url": "https://hackhouse.io",
    "logo": "https://meshreality.com/logo.png", // Update with actual logo URL
    "description": "A collaborative project that brings together passionate talent for one vision, build new and exciting projects.",
    "foundingDate": "2020", // Update with actual founding date
    "founders": [
      {
        "@type": "Person",
        "name": "Cody Kociemba"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://hackhouse.io"
      // Add social media links if available
    ]
  };

  return (
    <>
      <JsonLd data={companyJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="About Us" 
          description="The team behind Mesh Reality"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="mb-4">
                  Mesh Reality is developed by Hack House, a collaborative project that brings together passionate talent for one vision: to build new and exciting projects. Hack House is more than just a mobile development firm - it is a culture project.
                </p>
              <p className="mb-4">
                Our team was built around passion for growing and developing code. We build flawless projects and value success on happy customers. With team members spanning across the globe, we bring diverse perspectives and expertise to every project we undertake.
              </p>
              <p>
                Mesh Reality represents our vision for the future of 3D content creation - making powerful AI-driven tools accessible to everyone, regardless of their technical expertise.
              </p>
            </div>

            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-12">
              <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
              <p className="mb-4">
                We are an experienced, forward-thinking team of software engineers shaping a new reality with exciting ideas and cutting-edge technology. Our mission is to revolutionize 3D content creation by making it accessible, intuitive, and powerful.
              </p>
              <p>
                With Mesh Reality, we&apos;re democratizing 3D model generation, allowing creators of all skill levels to bring their ideas to life with unprecedented ease and quality.
              </p>
            </div>

            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6">Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-primary/10">
                    <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                      CK
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Cody Kociemba</h3>
                  <p className="text-muted-foreground">Founder and CEO</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-primary/10">
                    <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                      MP
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Malay Patel</h3>
                  <p className="text-muted-foreground">VoIP Solutions Architect</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-primary/10">
                    <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                      AK
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Aniruddh Kukadiya</h3>
                  <p className="text-muted-foreground">Full Stack Developer</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-primary/10">
                    <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                      MN
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Miranda Neddeau</h3>
                  <p className="text-muted-foreground">Customer Support Manager</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-primary/10">
                    <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                      LE
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Lewis Edwards</h3>
                  <p className="text-muted-foreground">Voice Talent Acquisition & Manager</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-primary/10">
                    <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">
                      CB
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Colin Brown</h3>
                  <p className="text-muted-foreground">React / React Native Developer</p>
                </div>
              </div>
              
              {/* Additional team members can be added here as needed */}
            </div>
          </div>
        </Section>
      </div>

      <Section className="py-16" align="center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Work With Us</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Interested in having us build your next app? Our dedicated and experienced team can design, build, and maintain your app with the same precision and care we put into Mesh Reality.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="https://hackhouse.io" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              Visit Hack House
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
