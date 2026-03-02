import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import Link from "next/link";
import { StarryBackground } from "@/components/magicui/starry-background";
import { Button } from "@/components/ui/button";
import { BrainIcon, ClockIcon, CalendarIcon, CloudIcon, UsersIcon, BellIcon, WandIcon, PaletteIcon, DownloadIcon, SmartphoneIcon, LockIcon, GlobeIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Features | Mesh Reality",
  description: "Explore the powerful features of Mesh Reality's AI-powered 3D model generation platform.",
  openGraph: {
    title: "Mesh Reality Features - AI-Powered 3D Generation",
    description: "Explore the powerful features of Mesh Reality's AI-powered 3D model generation platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Features",
      },
    ],
  },
};

export default function FeaturesPage() {
  const featuresJsonLd = {
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
    "featureList": "AI-Powered Generation, Real-time Editing, Version Control, Cloud Storage, Team Collaboration, Smart Updates",
    "screenshot": "https://meshreality.com/Device-1.png", // Replace with actual domain when available
    "softwareVersion": "1.0", // Update with actual version
    "author": {
      "@type": "Organization",
      "name": "Hack House",
      "url": "https://hackhouse.io"
    }
  };

  const featureCategories = [
    {
      title: "Core Features",
      description: "The foundation of Mesh Reality's powerful 3D generation capabilities",
      features: [
        {
          title: "AI-Powered Generation",
          description: "Create stunning 3D models with simple text prompts. Our advanced AI understands your vision and brings it to life in seconds.",
          icon: <BrainIcon className="h-6 w-6" />
        },
        {
          title: "Real-time Editing",
          description: "Make changes to your models and see the results instantly. Adjust, refine, and perfect your creations with intuitive controls.",
          icon: <ClockIcon className="h-6 w-6" />
        },
        {
          title: "Version Control",
          description: "Track changes and maintain different versions of your 3D models. Easily revert to previous iterations or branch out with new ideas.",
          icon: <CalendarIcon className="h-6 w-6" />
        },
        {
          title: "Cloud Storage",
          description: "Access your 3D models from anywhere with secure cloud storage. Your creations are always available across all your devices.",
          icon: <CloudIcon className="h-6 w-6" />
        }
      ]
    },
    {
      title: "Collaboration & Sharing",
      description: "Work together and showcase your creations",
      features: [
        {
          title: "Team Collaboration",
          description: "Invite team members to collaborate on projects in real-time. Share feedback, make edits, and create together seamlessly.",
          icon: <UsersIcon className="h-6 w-6" />
        },
        {
          title: "Smart Updates",
          description: "Get notified about model processing status and team activities. Stay in the loop with important changes and feedback.",
          icon: <BellIcon className="h-6 w-6" />
        },
        {
          title: "Social Sharing",
          description: "Share your creations directly to social media or export them for use in other platforms and applications.",
          icon: <GlobeIcon className="h-6 w-6" />
        },
        {
          title: "Permission Controls",
          description: "Set granular permissions for collaborators, determining who can view, edit, or share your 3D models.",
          icon: <LockIcon className="h-6 w-6" />
        }
      ]
    },
    {
      title: "Advanced Capabilities",
      description: "Take your 3D models to the next level",
      features: [
        {
          title: "Style Transfer",
          description: "Apply artistic styles to your 3D models with our AI-powered style transfer technology. Transform the look and feel of your creations instantly.",
          icon: <WandIcon className="h-6 w-6" />
        },
        {
          title: "Texture Customization",
          description: "Fine-tune textures with advanced controls. Adjust materials, colors, reflectivity, and more to achieve the perfect look.",
          icon: <PaletteIcon className="h-6 w-6" />
        },
        {
          title: "Multi-Format Export",
          description: "Export your models in various formats including OBJ, STL, GLB, and USDZ for compatibility with different platforms and software.",
          icon: <DownloadIcon className="h-6 w-6" />
        },
        {
          title: "AR Preview",
          description: "View your 3D models in augmented reality directly from your device. Place your creations in the real world to see how they look at scale.",
          icon: <SmartphoneIcon className="h-6 w-6" />
        }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={featuresJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="Features" 
          description="Powerful tools for 3D creation"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-semibold mb-4">Revolutionary 3D Creation</h2>
                  <p className="text-muted-foreground mb-6">
                    Mesh Reality combines cutting-edge AI technology with intuitive design to make 3D model creation accessible to everyone. Whether you&apos;re a professional designer or a complete beginner, our platform provides the tools you need to bring your ideas to life.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href="/pricing" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      View Pricing
                    </Link>
                    <Link 
                      href="/mobile-app" 
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Download App
                    </Link>
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                  <div className="aspect-square rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-24">
            {featureCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-semibold mb-3">{category.title}</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
      
      <Section className="py-16" align="center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Download Mesh Reality today and start creating amazing 3D models with the power of AI.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/mobile-app" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              Download Now
            </Link>
            <Link 
              href="/tutorials" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              View Tutorials
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
