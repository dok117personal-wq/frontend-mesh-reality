"use client";

import React from "react";
import ToolCard from "@/components/tools/shared/tool-card";

export default function ToolsPage() {
  const tools = [
    {
      title: "Model Viewer",
      description: "View and interact with 3D models in various formats including USDZ, GLB, and OBJ.",
      icon: "🔍",
      href: "/tools/model-viewer",
    },
    {
      title: "Photogrammetry",
      description: "Convert photos into detailed 3D models with our advanced photogrammetry engine.",
      icon: "📸",
      href: "/tools/photogrammetry",
    },
    {
      title: "Gaussian Splatting",
      description: "Create high-quality 3D representations using the latest gaussian splatting techniques.",
      icon: "✨",
      href: "/tools/gaussian-splatting",
    },
    {
      title: "Floor Plan Generator",
      description: "Generate accurate floor plans from 3D scans or models with automatic measurements.",
      icon: "📐",
      href: "/tools/floor-plan",
    },
    {
      title: "Model Generator",
      description: "Generate 3D models from text descriptions using AI.",
      icon: "🤖",
      href: "/tools/model-generator",
      proOnly: true,
    },
    {
      title: "Texture Editor",
      description: "Edit and enhance textures for your 3D models with advanced tools.",
      icon: "🎨",
      href: "/tools/texture-editor",
      comingSoon: true,
    },
    {
      title: "Mesh Simplifier",
      description: "Optimize and reduce polygon count while preserving model quality.",
      icon: "⚙️",
      href: "/tools/mesh-simplifier",
      comingSoon: true,
    },
    {
      title: "AR Viewer",
      description: "View your 3D models in augmented reality on compatible devices.",
      icon: "📱",
      href: "/tools/ar-viewer",
      comingSoon: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Mesh Reality Tools</h1>
          <p className="text-xl text-muted-foreground">
            Powerful tools to create, view, and transform 3D content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              href={tool.href}
              comingSoon={tool.comingSoon}
              proOnly={tool.proOnly}
            />
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-indigo-950/30 to-purple-950/30 rounded-xl p-8 border border-white/10 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Need a Custom 3D Solution?</h2>
          <p className="mb-6 text-muted-foreground">
            Our team can help you build custom 3D applications for your specific needs.
            From real estate to e-commerce, we have got you covered.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
