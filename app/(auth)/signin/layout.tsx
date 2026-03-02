import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Mesh Reality",
  description: "Sign in to your Mesh Reality account and continue creating stunning 3D models with our AI-powered platform. Sign in with Google, Apple, or phone number.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sign In to Mesh Reality - AI-Powered 3D Generation",
    description: "Sign in to your Mesh Reality account and continue creating stunning 3D models with our AI-powered platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Sign In",
      },
    ],
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
