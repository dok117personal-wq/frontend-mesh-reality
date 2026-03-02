import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import Link from "next/link";
import { StarryBackground } from "@/components/magicui/starry-background";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ | Mesh Reality",
  description: "Find answers to frequently asked questions about Mesh Reality's AI-powered 3D model generation platform.",
  openGraph: {
    title: "Mesh Reality FAQ - AI-Powered 3D Generation",
    description: "Find answers to frequently asked questions about Mesh Reality's AI-powered 3D model generation platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality FAQ",
      },
    ],
  },
};

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Mesh Reality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mesh Reality is an AI-powered 3D model generation mobile app that allows you to create, customize, and share stunning 3D models with unprecedented ease."
        }
      },
      {
        "@type": "Question",
        "name": "When will the app be available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Mesh Reality app will be available soon on iOS and Google Play. Sign up for our newsletter to be notified when it launches."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI-powered generation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our advanced AI technology analyzes your inputs and preferences to generate high-quality 3D models that match your vision. The AI learns from your feedback to improve results over time."
        }
      },
      {
        "@type": "Question",
        "name": "Can I collaborate with others on 3D projects?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Mesh Reality includes team collaboration features that allow multiple users to work on shared 3D projects simultaneously."
        }
      },
      {
        "@type": "Question",
        "name": "Is cloud storage included?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all your 3D models are securely stored in the cloud, allowing you to access them from anywhere and across devices."
        }
      },
      {
        "@type": "Question",
        "name": "What file formats does Mesh Reality support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mesh Reality supports exporting to common 3D file formats including OBJ, STL, GLB, and USDZ, making it compatible with most 3D software and platforms."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free version of Mesh Reality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Mesh Reality offers a free tier with limited features. Premium subscriptions unlock additional capabilities, higher resolution models, and more cloud storage."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use Mesh Reality for commercial projects?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you own the rights to the 3D models you create with Mesh Reality and can use them for both personal and commercial purposes."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an internet connection to use Mesh Reality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An internet connection is required for AI-powered generation and cloud storage features. However, you can view and make basic edits to downloaded models offline."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get support if I have issues?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact our support team through the app or visit our website&apos;s contact page. We also offer comprehensive documentation and tutorials to help you get the most out of Mesh Reality."
        }
      }
    ]
  };

  const faqCategories = [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What is Mesh Reality?",
          answer: "Mesh Reality is an AI-powered 3D model generation mobile app that allows you to create, customize, and share stunning 3D models with unprecedented ease."
        },
        {
          question: "When will the app be available?",
          answer: "The Mesh Reality app will be available soon on iOS and Google Play. Sign up for our newsletter to be notified when it launches."
        },
        {
          question: "Who develops Mesh Reality?",
          answer: "Mesh Reality is developed by Hack House, a collaborative project that brings together passionate talent for one vision: to build new and exciting projects. Hack House is more than just a mobile development firm - it &apos;s a culture project focused on creating innovative software solutions."
        }
      ]
    },
    {
      title: "Features & Functionality",
      faqs: [
        {
          question: "How does the AI-powered generation work?",
          answer: "Our advanced AI technology analyzes your inputs and preferences to generate high-quality 3D models that match your vision. The AI learns from your feedback to improve results over time."
        },
        {
          question: "Can I collaborate with others on 3D projects?",
          answer: "Yes! Mesh Reality includes team collaboration features that allow multiple users to work on shared 3D projects simultaneously."
        },
        {
          question: "Is cloud storage included?",
          answer: "Yes, all your 3D models are securely stored in the cloud, allowing you to access them from anywhere and across devices."
        },
        {
          question: "What file formats does Mesh Reality support?",
          answer: "Mesh Reality supports exporting to common 3D file formats including OBJ, STL, GLB, and USDZ, making it compatible with most 3D software and platforms."
        }
      ]
    },
    {
      title: "Pricing & Licensing",
      faqs: [
        {
          question: "Is there a free version of Mesh Reality?",
          answer: "Yes, Mesh Reality offers a free tier with limited features. Premium subscriptions unlock additional capabilities, higher resolution models, and more cloud storage."
        },
        {
          question: "What are the subscription options?",
          answer: "Mesh Reality offers monthly and annual subscription plans. The Pro plan includes unlimited model generation, advanced editing tools, and priority support. Visit our pricing page for detailed information."
        },
        {
          question: "Can I use Mesh Reality for commercial projects?",
          answer: "Yes, you own the rights to the 3D models you create with Mesh Reality and can use them for both personal and commercial purposes."
        },
        {
          question: "Do you offer educational or team discounts?",
          answer: "Yes, we offer special pricing for educational institutions and enterprise teams. Contact our sales team for more information."
        }
      ]
    },
    {
      title: "Technical Support",
      faqs: [
        {
          question: "Do I need an internet connection to use Mesh Reality?",
          answer: "An internet connection is required for AI-powered generation and cloud storage features. However, you can view and make basic edits to downloaded models offline."
        },
        {
          question: "What devices are compatible with Mesh Reality?",
          answer: "Mesh Reality is compatible with iOS devices running iOS 14 or later and Android devices running Android 10 or later. For optimal performance, we recommend devices with at least 4GB of RAM."
        },
        {
          question: "How do I get support if I have issues?",
          answer: "You can contact our support team through the app or visit our website&apos;s contact page. We also offer comprehensive documentation and tutorials to help you get the most out of Mesh Reality."
        },
        {
          question: "Is my data secure?",
          answer: "Yes, we take data security seriously. All data is encrypted in transit and at rest. We do not share your models or personal information with third parties without your consent. For more details, please review our Privacy Policy."
        }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-0 w-full">
          <StarryBackground />
        </div>
        
        <Section 
          subtitle="Frequently Asked Questions" 
          description="Find answers to common questions about Mesh Reality"
          className="relative z-10 pt-24"
          align="center"
        >
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-grow">
                  <Input 
                    placeholder="Search questions..." 
                    className="bg-background/50 border-white/20"
                  />
                </div>
                <Button>Search</Button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-8">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10">
                  <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>
                  <div className="space-y-6">
                    {category.faqs.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                        <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
      
      <Section className="py-16" align="center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Still Have Questions?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            If you couldn&apos;t find the answer you were looking for, our support team is here to help.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="/docs" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Documentation
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
