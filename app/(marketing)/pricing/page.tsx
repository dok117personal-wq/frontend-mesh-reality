import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import Link from "next/link";
import { StarryBackground } from "@/components/magicui/starry-background";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Pricing | Mesh Reality",
  description: "Choose the perfect Mesh Reality plan for your 3D model generation needs. Flexible pricing options for individuals and teams.",
  openGraph: {
    title: "Mesh Reality Pricing - AI-Powered 3D Generation",
    description: "Choose the perfect Mesh Reality plan for your 3D model generation needs. Flexible pricing options for individuals and teams.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Pricing",
      },
    ],
  },
};

export default function PricingPage() {
  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Mesh Reality",
    "description": "AI-powered 3D model generation mobile app",
    "offers": {
      "@type": "AggregateOffer",
      "offerCount": 3,
      "lowPrice": "0",
      "highPrice": "499",
      "priceCurrency": "USD",
      "offers": [
        {
          "@type": "Offer",
          "name": "Free",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Basic 3D model generation with limited features"
        },
        {
          "@type": "Offer",
          "name": "Pro",
          "price": "19.99",
          "priceCurrency": "USD",
          "description": "Advanced 3D model generation with premium features"
        },
        {
          "@type": "Offer",
          "name": "Enterprise",
          "price": "499",
          "priceCurrency": "USD",
          "description": "Team-based 3D model generation with collaboration features"
        }
      ]
    },
    "brand": {
      "@type": "Brand",
      "name": "Mesh Reality"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Hack House",
      "url": "https://hackhouse.io"
    }
  };

  const pricingPlans = [
    {
      name: "Free",
      description: "Perfect for beginners exploring 3D generation",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      features: [
        "5 AI-generated models per month",
        "Basic editing tools",
        "720p resolution export",
        "Community support",
        "1GB cloud storage"
      ],
      limitations: [
        "Limited model complexity",
        "Standard render quality",
        "Mesh Reality watermark",
        "No team collaboration"
      ],
      cta: "Get Started",
      ctaLink: "/signup",
      popular: false
    },
    {
      name: "Pro",
      description: "For creators who need more power and flexibility",
      monthlyPrice: "$19.99",
      yearlyPrice: "$199.99",
      features: [
        "Unlimited AI-generated models",
        "Advanced editing tools",
        "4K resolution export",
        "Priority support",
        "50GB cloud storage",
        "No watermarks",
        "Custom textures",
        "Style transfer",
        "AR preview"
      ],
      limitations: [],
      cta: "Choose Pro",
      ctaLink: "/signup?plan=pro",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For teams and businesses with advanced needs",
      monthlyPrice: "$499",
      yearlyPrice: "$4,999",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Team collaboration tools",
        "Admin dashboard",
        "Usage analytics",
        "500GB cloud storage",
        "API access",
        "Dedicated account manager",
        "Custom onboarding",
        "24/7 priority support"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaLink: "/contact?enterprise=true",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, the changes will take effect at the end of your current billing cycle."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, we offer a 14-day free trial for our Pro plan. No credit card is required to start the trial, and you can cancel anytime before the trial ends."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and Apple Pay. For Enterprise plans, we also offer invoice payment options."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. If you cancel, you&apos;ll still have access to your paid features until the end of your current billing cycle."
    }
  ];

  return (
    <>
      <JsonLd data={pricingJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="Pricing" 
          description="Choose the perfect plan for your needs"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-5xl mx-auto mb-12">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-medium">Monthly</span>
                  <Switch id="billing-toggle" />
                  <span className="text-lg font-medium">Yearly (Save 20%)</span>
                </div>
                <p className="text-muted-foreground max-w-lg">
                  All plans include a 14-day free trial. No credit card required to start.
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`bg-card/30 backdrop-blur-sm rounded-xl border ${
                    plan.popular ? "border-primary" : "border-white/10"
                  } overflow-hidden relative flex flex-col`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold">{plan.monthlyPrice}</div>
                      <div className="text-muted-foreground">per month</div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <p className="font-medium">What&apos;s included:</p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {plan.limitations.length > 0 && (
                        <div className="pt-4">
                          <p className="font-medium text-muted-foreground">Limitations:</p>
                          <ul className="space-y-2 text-muted-foreground">
                            {plan.limitations.map((limitation, limitationIndex) => (
                              <li key={limitationIndex} className="flex items-start">
                                <span className="h-5 w-5 text-muted-foreground mr-2 flex items-center justify-center flex-shrink-0">•</span>
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-white/10">
                    <Link 
                      href={plan.ctaLink} 
                      className={`w-full flex items-center justify-center px-6 py-3 rounded-md font-medium transition-colors ${
                        plan.popular 
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                          : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
      
      <Section className="py-16" align="center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="mb-6 text-muted-foreground">
              Have more questions about our pricing or need a custom plan?
            </p>
            <Link 
              href="/contact" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              Contact Our Sales Team
            </Link>
          </div>
        </div>
      </Section>
      
      <Section className="py-16 bg-card/30" align="center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Enterprise Solutions</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Need a custom solution for your organization? Our Enterprise plan offers advanced features, dedicated support, and flexible pricing options tailored to your specific needs.
          </p>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="text-xl font-medium mb-3">Custom Integration</h3>
                <p className="text-muted-foreground">
                  Integrate Mesh Reality with your existing workflows and systems.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Team Management</h3>
                <p className="text-muted-foreground">
                  Advanced user roles, permissions, and collaboration tools.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Dedicated Support</h3>
                <p className="text-muted-foreground">
                  Priority support with a dedicated account manager.
                </p>
              </div>
            </div>
          </div>
          <Link 
            href="/contact?enterprise=true" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
          >
            Contact Enterprise Sales
          </Link>
        </div>
      </Section>
    </>
  );
}
