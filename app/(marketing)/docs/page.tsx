import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import Link from "next/link";
import { StarryBackground } from "@/components/magicui/starry-background";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation | Mesh Reality",
  description: "Learn how to use Mesh Reality's AI-powered 3D model generation features with our comprehensive documentation.",
  openGraph: {
    title: "Mesh Reality Documentation - AI-Powered 3D Generation",
    description: "Learn how to use Mesh Reality's AI-powered 3D model generation features with our comprehensive documentation.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Documentation",
      },
    ],
  },
};

export default function DocsPage() {
  const docsJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Mesh Reality Documentation",
    "description": "Comprehensive documentation for using Mesh Reality's AI-powered 3D model generation features",
    "author": {
      "@type": "Organization",
      "name": "Hack House",
      "url": "https://hackhouse.io"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hack House",
      "url": "https://hackhouse.io"
    },
    "inLanguage": "en-US",
    "datePublished": "2025-01-01", // Update with actual date
    "dateModified": "2025-02-26" // Update with actual date
  };

  const docCategories = [
    {
      title: "Getting Started",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      ),
      links: [
        { title: "Installation Guide", href: "#installation" },
        { title: "Quick Start", href: "#quick-start" },
        { title: "User Interface Overview", href: "#ui-overview" },
        { title: "Account Setup", href: "#account-setup" }
      ]
    },
    {
      title: "Core Features",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      links: [
        { title: "3D Model Generation", href: "#model-generation" },
        { title: "Editing Tools", href: "#editing-tools" },
        { title: "Texture Mapping", href: "#texture-mapping" },
        { title: "Export Options", href: "#export-options" }
      ]
    },
    {
      title: "Advanced Usage",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
      links: [
        { title: "Custom Prompts", href: "#custom-prompts" },
        { title: "Style Transfer", href: "#style-transfer" },
        { title: "Batch Processing", href: "#batch-processing" },
        { title: "API Integration", href: "#api-integration" }
      ]
    },
    {
      title: "Troubleshooting",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
      ),
      links: [
        { title: "Common Issues", href: "#common-issues" },
        { title: "Error Messages", href: "#error-messages" },
        { title: "Performance Tips", href: "#performance-tips" },
        { title: "Contact Support", href: "#contact-support" }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={docsJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="Documentation" 
          description="Learn how to use Mesh Reality"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-grow">
                  <Input 
                    placeholder="Search documentation..." 
                    className="bg-background/50 border-white/20"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {docCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                  </div>
                  
                  <ul className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          href={link.href} 
                          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
      
      <Section id="installation" className="py-16" align="center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Getting Started with Mesh Reality</h2>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-medium mb-4">Installation Guide</h3>
            <p className="mb-6 text-muted-foreground">
              Mesh Reality is available for both iOS and Android devices. Follow these steps to install the app:
            </p>
            
            <div className="space-y-4">
              <div className="bg-card/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">iOS Installation</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Open the App Store on your iOS device</li>
                  <li>Search for &quot;Mesh Reality&quot;</li>
                  <li>Tap &quot;Get&quot; to download and install the app</li>
                  <li>Once installed, tap &quot;Open&quot; to launch Mesh Reality</li>
                </ol>
              </div>
              
              <div className="bg-card/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Android Installation</h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Open the Google Play Store on your Android device</li>
                  <li>Search for &quot;Mesh Reality&quot;</li>
                  <li>Tap &quot;Install&quot; to download and install the app</li>
                  <li>Once installed, tap &quot;Open&quot; to launch Mesh Reality</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">
              Our documentation is constantly being updated. Check back regularly for new guides and tutorials.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/tutorials" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
              >
                View Tutorials
              </Link>
              <Link 
                href="/faq" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
