"use client";

import React from "react";
import ModelViewer from "@/components/tools/shared/model-viewer";
import FileUpload from "@/components/tools/shared/file-upload";
import ViewerControls from "@/components/tools/shared/viewer-controls";
import ExportOptions from "@/components/tools/shared/export-options";
import HowItWorks from "@/components/tools/shared/how-it-works";
import ExampleGallery from "@/components/tools/shared/example-gallery";
import UpgradeBanner from "@/components/tools/shared/upgrade-banner";

export default function ModelViewerPage() {
  const viewerControls = [
    { id: "rotate", icon: "🔄", label: "Rotate" },
    { id: "pan", icon: "👆", label: "Pan" },
    { id: "zoom", icon: "🔍", label: "Zoom" },
    { id: "reset", icon: "↩️", label: "Reset" },
    { id: "wireframe", icon: "🔲", label: "Wireframe" },
  ];

  const exportFormats = [
    { id: "glb", name: "GLB", description: "Standard 3D format" },
    { id: "usdz", name: "USDZ", description: "For Apple AR" },
    { id: "obj", name: "OBJ", description: "With materials" },
    { id: "fbx", name: "FBX", description: "For animation", proOnly: true },
  ];

  const howItWorksSteps = [
    {
      id: 1,
      title: "Upload Your Model",
      description: "Upload your 3D model in GLB, USDZ, OBJ, or other supported formats.",
      icon: "📤",
    },
    {
      id: 2,
      title: "View & Interact",
      description: "Rotate, pan, and zoom to explore your 3D model from all angles.",
      icon: "🔄",
    },
    {
      id: 3,
      title: "Export & Share",
      description: "Export your model to different formats or share it with others.",
      icon: "💾",
    },
  ];

  const examples = [
    {
      id: "example1",
      title: "Architectural Visualization",
      description: "Modern house with detailed interior",
      image: "/examples/model-viewer/house.jpg",
      link: "/examples/model-viewer/house",
      tags: ["Architecture", "Interior"],
    },
    {
      id: "example2",
      title: "Product Showcase",
      description: "Detailed product model for e-commerce",
      image: "/examples/model-viewer/product.jpg",
      link: "/examples/model-viewer/product",
      tags: ["Product", "E-commerce"],
    },
    {
      id: "example3",
      title: "Character Model",
      description: "Animated 3D character with textures",
      image: "/examples/model-viewer/character.jpg",
      link: "/examples/model-viewer/character",
      tags: ["Character", "Animation"],
    },
  ];

  const proFeatures = [
    { text: "Export to all formats including FBX, STL, and GLTF" },
    { text: "Advanced lighting and environment controls" },
    { text: "Texture and material editing" },
    { text: "Animation playback and control" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">3D Model Viewer</h1>
          <p className="text-xl text-muted-foreground mb-8">
            View and interact with 3D models in various formats
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ModelViewer
                className="mb-4"
                placeholder={
                  <div className="text-white text-center">
                    <p className="text-lg mb-2">Upload a 3D model to view</p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: GLB, USDZ, OBJ, FBX, and more
                    </p>
                  </div>
                }
              />
              <ViewerControls controls={viewerControls} className="mb-8" />
            </div>

            <div className="space-y-8">
              <FileUpload
                title="Upload 3D Model"
                description="Drag and drop your 3D model file here, or click to browse"
                icon="📦"
                acceptedFormats={["glb", "usdz", "obj", "fbx", "stl", "gltf"]}
                onFilesSelected={() => {}}
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
          title="Unlock Pro Features"
          description="Get access to advanced features like texture editing, animation controls, and more export formats."
          features={proFeatures}
        />

        <div className="my-16">
          <HowItWorks steps={howItWorksSteps} />
        </div>

        <div className="my-16">
          <ExampleGallery examples={examples} />
        </div>
      </div>
    </div>
  );
}
