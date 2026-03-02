"use client";

import React from "react";
import ModelViewer from "@/components/tools/shared/model-viewer";
import FileUpload from "@/components/tools/shared/file-upload";
import ProcessingStatus, { ProcessingStep } from "@/components/tools/shared/processing-status";
import ExportOptions from "@/components/tools/shared/export-options";
import HowItWorks from "@/components/tools/shared/how-it-works";
import ExampleGallery from "@/components/tools/shared/example-gallery";
import UpgradeBanner from "@/components/tools/shared/upgrade-banner";
import ViewerControls from "@/components/tools/shared/viewer-controls";

export default function GaussianSplattingPage() {
  const processingSteps: ProcessingStep[] = [
    { id: 1, name: "Upload Images", status: "completed", progress: 100 },
    { id: 2, name: "Camera Pose Estimation", status: "completed", progress: 100 },
    { id: 3, name: "Gaussian Initialization", status: "in-progress", progress: 45 },
    { id: 4, name: "Optimization", status: "waiting" },
    { id: 5, name: "Final Rendering", status: "waiting" },
  ];

  const viewerControls = [
    { id: "rotate", icon: "🔄", label: "Rotate" },
    { id: "pan", icon: "👆", label: "Pan" },
    { id: "zoom", icon: "🔍", label: "Zoom" },
    { id: "quality", icon: "⚙️", label: "Quality" },
    { id: "reset", icon: "↩️", label: "Reset" },
  ];

  const exportFormats = [
    { id: "gs", name: "GS", description: "Gaussian Splats" },
    { id: "ply", name: "PLY", description: "Point cloud" },
    { id: "glb", name: "GLB", description: "Mesh approximation" },
    { id: "video", name: "MP4", description: "Turntable video", proOnly: true },
  ];

  const howItWorksSteps = [
    {
      id: 1,
      title: "Upload Photos",
      description: "Upload 30-100 photos of your subject from different angles.",
      icon: "📸",
    },
    {
      id: 2,
      title: "AI Processing",
      description: "Our system estimates camera positions and creates gaussian splats.",
      icon: "🧠",
    },
    {
      id: 3,
      title: "Interactive Viewing",
      description: "View your high-quality 3D scene with real-time rendering.",
      icon: "🔍",
    },
  ];

  const examples = [
    {
      id: "example1",
      title: "Indoor Scene",
      description: "Living room captured with gaussian splatting",
      image: "/examples/gaussian-splatting/living-room.jpg",
      link: "/examples/gaussian-splatting/living-room",
      tags: ["Interior", "Room"],
    },
    {
      id: "example2",
      title: "Outdoor Environment",
      description: "Garden scene with complex lighting",
      image: "/examples/gaussian-splatting/garden.jpg",
      link: "/examples/gaussian-splatting/garden",
      tags: ["Outdoor", "Nature"],
    },
    {
      id: "example3",
      title: "Complex Object",
      description: "Detailed statue with intricate features",
      image: "/examples/gaussian-splatting/statue.jpg",
      link: "/examples/gaussian-splatting/statue",
      tags: ["Object", "Art"],
    },
  ];

  const proFeatures = [
    { text: "Higher quality optimization (2x iterations)" },
    { text: "Export turntable videos in 4K resolution" },
    { text: "Advanced lighting control and environment maps" },
    { text: "Process up to 300 images per model" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Gaussian Splatting</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Create photorealistic 3D scenes with advanced gaussian splatting
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ModelViewer
                className="mb-4"
                placeholder={
                  <div className="text-white text-center">
                    <p className="text-lg mb-2">Upload photos to create a gaussian splat model</p>
                    <p className="text-sm text-muted-foreground">
                      For best results, use 30-100 photos with good coverage
                    </p>
                  </div>
                }
              />
              <ViewerControls controls={viewerControls} className="mb-4" />
              <ProcessingStatus steps={processingSteps} />
            </div>

            <div className="space-y-8">
              <FileUpload
                title="Upload Photos"
                description="Drag and drop your photos here, or click to browse"
                icon="📸"
                acceptedFormats={["jpg", "jpeg", "png", "heif", "heic"]}
                onFilesSelected={() => {}}
                multiple={true}
              />

              <ExportOptions
                formats={exportFormats}
                onExport={() => {}}
                isDisabled={true}
              />
            </div>
          </div>
        </div>

        <UpgradeBanner
          title="Upgrade to Pro for Better Quality"
          description="Get higher quality optimization, advanced lighting controls, and more export options."
          features={proFeatures}
        />

        <div className="my-16">
          <HowItWorks steps={howItWorksSteps} />
        </div>

        <div className="my-16">
          <ExampleGallery examples={examples} />
        </div>

        <div className="bg-card/50 p-8 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm my-16">
          <h2 className="text-2xl font-bold mb-4">What is Gaussian Splatting?</h2>
          <p className="mb-4 text-muted-foreground">
            Gaussian Splatting is a cutting-edge 3D reconstruction technique that represents scenes as a collection of 3D Gaussian functions. Unlike traditional mesh-based approaches, gaussian splatting excels at:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4 text-muted-foreground">
            <li>Capturing complex lighting effects and reflections</li>
            <li>Representing fine details like hair, grass, and transparent objects</li>
            <li>Enabling real-time, high-quality rendering on modern devices</li>
            <li>Creating more photorealistic results than traditional methods</li>
          </ul>
          <p className="text-muted-foreground">
            This technology is particularly useful for creating virtual tours, digital twins, and immersive AR/VR experiences.
          </p>
        </div>
      </div>
    </div>
  );
}
