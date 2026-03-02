import { Metadata } from "next";
import { Section } from "@/components/section";
import JsonLd from "@/components/json-ld";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Mesh Reality",
  description: "Learn how Mesh Reality collects, uses, and protects your personal information.",
  openGraph: {
    title: "Privacy Policy | Mesh Reality",
    description: "Learn how Mesh Reality collects, uses, and protects your personal information.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPage() {
  const privacyJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "description": "Mesh Reality Privacy Policy",
    "publisher": {
      "@type": "Organization",
      "name": "Hack House",
      "url": "https://hackhouse.io"
    },
    "inLanguage": "en-US",
    "datePublished": "2025-01-01", // Update with actual date
    "dateModified": "2025-02-26" // Update with actual date
  };

  const lastUpdated = "February 26, 2025"; // Update with actual date

  return (
    <>
      <JsonLd data={privacyJsonLd} />
        <Section 
          subtitle="Privacy Policy" 
          description="How we handle your data"
          className="relative z-10 pt-24"
          align="center"
        >
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
            <p className="text-sm text-muted-foreground mb-6">
              Last Updated: {lastUpdated}
            </p>
            
            <div className="prose prose-invert max-w-none">
              <p>
                At Mesh Reality, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
              </p>
              
              <h2>Information We Collect</h2>
              
              <h3>Personal Data</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you register with the app, express an interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Content of messages sent through our contact forms</li>
                <li>Any other information you choose to provide</li>
              </ul>
              
              <h3>Automatically Collected Information</h3>
              <p>
                When you access our app or website, we may automatically collect certain information about your device, including:
              </p>
              <ul>
                <li>Device type</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>App usage data</li>
                <li>Time spent in the app</li>
                <li>Features used</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>We may use the information we collect for various purposes, including to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative information, such as updates, security alerts, and support messages</li>
                <li>Respond to comments, questions, and requests</li>
                <li>Develop new products and services</li>
                <li>Monitor usage patterns and analyze trends</li>
                <li>Protect against, identify, and prevent fraud and other illegal activity</li>
              </ul>
              
              <h2>Sharing Your Information</h2>
              <p>We may share your information in the following situations:</p>
              <ul>
                <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us.</li>
                <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
                <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information where required to do so by law or in response to valid requests by public authorities.</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>
                We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that no security measures are &quot;perfect or impenetrable&quot;, and we cannot guarantee the &quot;security of your information&quot;.
              </p>
              
              <h2>Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, such as:
              </p>
              <ul>
                <li>The right to access personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to object to processing of your information</li>
                <li>The right to data portability</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
              </p>
              
              <h2>Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.
              </p>
              
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <p>
                <a href="mailto:privacy@meshreality.com" className="text-primary hover:underline">privacy@meshreality.com</a>
              </p>
              <p>
                Or visit our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
