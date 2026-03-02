import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import Link from "next/link";
import { StarryBackground } from "@/components/magicui/starry-background";
import { StoreIcons } from "@/components/landing/store-icons";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Mobile App | Mesh Reality",
  description: "Download the Mesh Reality mobile app for iOS and Android. Create stunning 3D models on the go with our AI-powered platform.",
  openGraph: {
    title: "Mesh Reality Mobile App - AI-Powered 3D Generation",
    description: "Download the Mesh Reality mobile app for iOS and Android. Create stunning 3D models on the go with our AI-powered platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Mobile App",
      },
    ],
  },
};

export default function MobileAppPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "name": "Mesh Reality",
    "operatingSystem": "iOS, Android",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "AI-powered 3D model generation mobile app",
    "screenshot": "https://meshreality.com/Device-1.png", // Replace with actual domain when available
    "softwareVersion": "1.0", // Update with actual version
    "author": {
      "@type": "Organization",
      "name": "Hack House",
      "url": "https://hackhouse.io"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8", // Update with actual rating
      "ratingCount": "1250" // Update with actual count
    }
  };

  const appFeatures = [
    {
      title: "Create Anywhere",
      description: "Generate stunning 3D models on the go, whether you're at home, in the office, or traveling."
    },
    {
      title: "Intuitive Interface",
      description: "Our user-friendly interface makes 3D creation accessible to everyone, regardless of experience level."
    },
    {
      title: "Real-time Preview",
      description: "See your 3D models come to life in real-time as you make adjustments and refinements."
    },
    {
      title: "Cloud Sync",
      description: "Access your projects across all your devices with seamless cloud synchronization."
    },
    {
      title: "AR Visualization",
      description: "Place your 3D models in the real world using augmented reality to see how they look at scale."
    },
    {
      title: "Share & Export",
      description: "Easily share your creations on social media or export them for use in other applications."
    }
  ];

  const deviceImages = [
    {
      src: "/Device-1.png",
      alt: "Mesh Reality app home screen"
    },
    {
      src: "/Device-2.png",
      alt: "3D model generation interface"
    },
    {
      src: "/Device-3.png",
      alt: "Model editing screen"
    },
    {
      src: "/Device-4.png",
      alt: "Texture customization interface"
    },
    {
      src: "/Device-5.png",
      alt: "AR preview mode"
    },
    {
      src: "/Device-6.png",
      alt: "Model gallery view"
    }
  ];

  return (
    <>
      <JsonLd data={appJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="Mobile App" 
          description="Experience the future of 3D creation on your device"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-4">AI-Powered 3D Creation in Your Pocket</h2>
                <p className="text-muted-foreground mb-6">
                  Mesh Reality brings the power of AI-driven 3D model generation to your mobile device. Create, edit, and share stunning 3D models anywhere, anytime with our intuitive and powerful mobile app.
                </p>
                <div className="mb-8 flex justify-start">
                  <StoreIcons />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/features" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors text-center"
                  >
                    Explore Features
                  </Link>
                  <Link 
                    href="/tutorials" 
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors text-center"
                  >
                    View Tutorials
                  </Link>
                </div>
              </div>
              <div className="relative h-[500px] flex items-center justify-center">
                <div className="absolute transform rotate-[-8deg] translate-x-[-30px]">
                  <Image 
                    src="/Device-1.png" 
                    alt="Mesh Reality app interface" 
                    width={250} 
                    height={500}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="absolute transform rotate-[8deg] translate-x-[30px] translate-y-[20px]">
                  <Image 
                    src="/Device-2.png" 
                    alt="Mesh Reality app interface" 
                    width={250} 
                    height={500}
                    className="rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mb-24">
            <h2 className="text-3xl font-semibold mb-12 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {appFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold mb-12 text-center">App Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {deviceImages.map((image, index) => (
                <div 
                  key={index} 
                  className="bg-card/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-[9/16] relative overflow-hidden rounded-lg">
                    <Image 
                      src={image.src} 
                      alt={image.alt} 
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
      
      <Section className="py-16" align="center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-4">System Requirements</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Mesh Reality is designed to work on a wide range of devices. Here are the minimum requirements:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">iOS</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>iOS 14.0 or later</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>iPhone 8 or newer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>iPad (6th generation) or newer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>2GB RAM minimum (4GB recommended)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>500MB free storage space</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Android</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>Android 10.0 or later</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>ARCore compatible device</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>3GB RAM minimum (6GB recommended)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>OpenGL ES 3.0 or higher</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 text-primary mr-2 flex items-center justify-center flex-shrink-0">•</span>
                    <span>500MB free storage space</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      <Section className="py-16 bg-card/30" align="center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Download Mesh Reality today and start creating amazing 3D models with the power of AI.
          </p>
          <div className="flex justify-center">
            <StoreIcons />
          </div>
        </div>
      </Section>
    </>
  );
}
