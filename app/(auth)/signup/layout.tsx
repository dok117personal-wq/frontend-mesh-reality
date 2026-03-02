import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Mesh Reality",
  description: "Create your Mesh Reality account and start generating stunning 3D models with our AI-powered platform. Sign up with Google, Apple, or phone number.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Sign Up for Mesh Reality - AI-Powered 3D Generation",
    description: "Create your Mesh Reality account and start generating stunning 3D models with our AI-powered platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesh Reality Sign Up",
      },
    ],
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
