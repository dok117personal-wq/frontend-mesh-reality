import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import Script from "next/script";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mesh Reality - AI-Powered 3D Model Generation",
    template: "%s | Mesh Reality",
  },
  description: "Create stunning 3D models with AI technology. Transform your ideas into reality with our advanced 3D generation mobile app.",
  keywords: ["3D model generation", "AI 3D models", "3D content creation", "mesh reality", "3D generation app"],
  authors: [{ name: "Mesh Reality Team" }],
  creator: "Mesh Reality",
  publisher: "Mesh Reality",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://meshreality.com"), // Replace with your actual domain when available
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    // Add more icon sizes if available
    // apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Verification codes for search engines
  verification: {
    google: "CHANGEME", // Get from Google Search Console: https://search.google.com/search-console
    // bing: "CHANGEME", // Get from Bing Webmaster Tools: https://www.bing.com/webmasters
    // yandex: "CHANGEME", // Get from Yandex Webmaster: https://webmaster.yandex.com
  },
  // Social media metadata
  openGraph: {
    title: "Mesh Reality - Revolutionary 3D Generation for Modern Creators",
    description: "Create, customize, and share stunning 3D models with our AI-powered mobile app.",
    url: "https://meshreality.com", // Replace with your actual domain when available
    siteName: "Mesh Reality",
    images: [
      {
        url: "/og-image.jpg", // Create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "Mesh Reality - 3D Generation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mesh Reality - Revolutionary 3D Generation",
    description: "Create stunning 3D models with AI technology",
    creator: "@meshreality", // Replace with your actual Twitter handle when available
    images: ["/twitter-image.jpg"], // Create this image (1200x600px recommended)
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mesh Reality",
    "url": "https://meshreality.com", // Replace with your actual domain when available
    "logo": "https://meshreality.com/logo.png", // Create a logo image (recommended 112x112px at minimum)
    "sameAs": [
      "https://twitter.com/meshreality", // Replace with actual Twitter URL when available
      "https://discord.gg/meshreality", // Replace with actual Discord URL when available
      // Add other social profiles
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@meshreality.com", // Replace with actual contact email when available
      "contactType": "customer service"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-CHANGEME`} // Get from Google Analytics
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CHANGEME'); // Get from Google Analytics
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
