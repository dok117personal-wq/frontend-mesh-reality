import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import Link from "next/link";
import { StarryBackground } from "@/components/magicui/starry-background";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tutorials | Mesh Reality",
  description: "Step-by-step tutorials to help you master Mesh Reality's AI-powered 3D model generation features.",
  openGraph: {
    title: "Mesh Reality Tutorials - AI-Powered 3D Generation",
    description: "Step-by-step tutorials to help you master Mesh Reality's AI-powered 3D model generation features.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Tutorials",
      },
    ],
  },
};

export default function TutorialsPage() {
  const tutorialsJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Getting Started with Mesh Reality",
        "url": "https://meshreality.com/tutorials#getting-started" // Update with actual URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Creating Your First 3D Model",
        "url": "https://meshreality.com/tutorials#first-model" // Update with actual URL
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Advanced Editing Techniques",
        "url": "https://meshreality.com/tutorials#advanced-editing" // Update with actual URL
      }
    ]
  };

  const tutorialCategories = [
    {
      title: "Beginner Tutorials",
      tutorials: [
        {
          title: "Getting Started with Mesh Reality",
          description: "Learn the basics of the Mesh Reality app interface and how to navigate through its features.",
          duration: "5 min",
          difficulty: "Beginner",
          href: "#getting-started",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        },
        {
          title: "Creating Your First 3D Model",
          description: "Follow along as we create a simple 3D model using AI generation.",
          duration: "8 min",
          difficulty: "Beginner",
          href: "#first-model",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        },
        {
          title: "Understanding Model Parameters",
          description: "Learn how different parameters affect your generated 3D models.",
          duration: "6 min",
          difficulty: "Beginner",
          href: "#model-parameters",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        }
      ]
    },
    {
      title: "Intermediate Tutorials",
      tutorials: [
        {
          title: "Advanced Editing Techniques",
          description: "Take your 3D models to the next level with these advanced editing techniques.",
          duration: "12 min",
          difficulty: "Intermediate",
          href: "#advanced-editing",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        },
        {
          title: "Custom Texturing",
          description: "Learn how to apply and customize textures for your 3D models.",
          duration: "10 min",
          difficulty: "Intermediate",
          href: "#custom-texturing",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        },
        {
          title: "Optimizing Models for Different Platforms",
          description: "Discover how to optimize your 3D models for various platforms and use cases.",
          duration: "9 min",
          difficulty: "Intermediate",
          href: "#optimizing-models",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        }
      ]
    },
    {
      title: "Advanced Tutorials",
      tutorials: [
        {
          title: "Creating Complex Scenes",
          description: "Learn how to create and manage complex 3D scenes with multiple models.",
          duration: "15 min",
          difficulty: "Advanced",
          href: "#complex-scenes",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        },
        {
          title: "Animation Basics",
          description: "Get started with animating your 3D models in Mesh Reality.",
          duration: "18 min",
          difficulty: "Advanced",
          href: "#animation-basics",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        },
        {
          title: "Exporting for Professional Workflows",
          description: "Learn how to export your models for use in professional 3D software.",
          duration: "11 min",
          difficulty: "Advanced",
          href: "#exporting-professional",
          thumbnail: "/placeholder.svg" // Replace with actual thumbnail
        }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={tutorialsJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="Tutorials" 
          description="Learn how to use Mesh Reality like a pro"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-grow">
                  <Input 
                    placeholder="Search tutorials..." 
                    className="bg-background/50 border-white/20"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-16">
            {tutorialCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tutorials.map((tutorial, tutorialIndex) => (
                    <Link 
                      key={tutorialIndex} 
                      href={tutorial.href}
                      className="bg-card/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-primary/50 transition-colors group"
                    >
                      <div className="aspect-video bg-primary/10 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50 group-hover:text-primary transition-colors">
                            <circle cx="12" cy="12" r="10"/>
                            <polygon points="10 8 16 12 10 16 10 8"/>
                          </svg>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{tutorial.duration}</span>
                          <span>{tutorial.difficulty}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
      
      <Section id="getting-started" className="py-16" align="center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6">Getting Started with Mesh Reality</h2>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <div className="aspect-video bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10 8 16 12 10 16 10 8"/>
              </svg>
            </div>
            
            <h3 className="text-2xl font-medium mb-4">Tutorial Overview</h3>
            <p className="mb-6 text-muted-foreground">
              In this tutorial, you&apos;ll learn the basics of navigating the Mesh Reality app interface and how to access its core features. We&apos;ll cover the home screen, navigation menu, and basic settings.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-medium mb-2">Step 1: Launching the App</h4>
                <p className="text-muted-foreground">
                  After installing Mesh Reality, tap the app icon to launch it. You&apos;ll be greeted with a welcome screen that introduces the app&apos;s key features.
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-medium mb-2">Step 2: Navigating the Home Screen</h4>
                <p className="text-muted-foreground">
                  The home screen displays your recent projects and provides quick access to create new models. Swipe left or right to browse your existing projects.
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-medium mb-2">Step 3: Accessing the Menu</h4>
                <p className="text-muted-foreground">
                  Tap the menu icon in the top-left corner to access additional features such as settings, tutorials, and your account information.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">
              Ready to create your first 3D model? Check out our next tutorial!
            </p>
            <Link 
              href="#first-model" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              Next Tutorial: Creating Your First 3D Model
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
