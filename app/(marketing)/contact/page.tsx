import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import { StarryBackground } from "@/components/magicui/starry-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Mesh Reality",
  description: "Get in touch with the Mesh Reality team for questions, support, or to discuss your 3D model generation needs.",
  openGraph: {
    title: "Contact Mesh Reality - AI-Powered 3D Generation",
    description: "Get in touch with the Mesh Reality team for questions, support, or to discuss your 3D model generation needs.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Mesh Reality",
      },
    ],
  },
};

export default function ContactPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Mesh Reality",
    "description": "Get in touch with the Mesh Reality team",
    "mainEntity": {
      "@type": "Organization",
      "name": "Hack House",
      "url": "https://hackhouse.io",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "hello@meshreality.com" // Update with actual email
      }
    }
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="Contact Us" 
          description="Get in touch with our team"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <h2 className="text-2xl font-semibold mb-4">Reach Out</h2>
                <p className="mb-6 text-muted-foreground">
                  Have questions about Mesh Reality? Want to learn more about our 3D model generation technology? Fill out the form and our team will get back to you as soon as possible.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:hello@meshreality.com" className="hover:text-primary transition-colors">
                        hello@meshreality.com
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visit Our Developer</h3>
                    <p className="text-muted-foreground">
                      <a 
                        href="https://hackhouse.io" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        Hack House
                      </a>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      aria-label="Discord"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="12" r="1"></circle>
                        <circle cx="15" cy="12" r="1"></circle>
                        <path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path>
                        <path d="M7 16.5c3.5 1 6.5 1 10 0"></path>
                        <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5"></path>
                        <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <select 
                      id="subject" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message" rows={5} />
                  </div>
                  
                  <Button type="submit" className="w-full">Send Message</Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our{" "}
                    <Link href="/privacy" className="underline hover:text-primary">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </Section>
      </div>
      
      <Section className="py-16" align="center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Looking for App Development?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Our parent company, Hack House, specializes in mobile app development. If you need a custom app built, they can help!
          </p>
          <Link 
            href="https://hackhouse.io" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
          >
            Visit Hack House
          </Link>
        </div>
      </Section>
    </>
  );
}
