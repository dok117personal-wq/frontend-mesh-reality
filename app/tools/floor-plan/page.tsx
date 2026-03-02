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

export default function FloorPlanPage() {
  const processingSteps: ProcessingStep[] = [
    { id: 1, name: "Upload 3D Model", status: "completed", progress: 100 },
    { id: 2, name: "Floor Detection", status: "completed", progress: 100 },
    { id: 3, name: "Wall Detection", status: "in-progress", progress: 70 },
    { id: 4, name: "Room Segmentation", status: "waiting" },
    { id: 5, name: "Measurement Calculation", status: "waiting" },
  ];

  const viewerControls = [
    { id: "2d", icon: "📄", label: "2D View", active: true },
    { id: "3d", icon: "🏠", label: "3D View" },
    { id: "measure", icon: "📏", label: "Measure" },
    { id: "rooms", icon: "🚪", label: "Rooms" },
    { id: "reset", icon: "↩️", label: "Reset" },
  ];

  const exportFormats = [
    { id: "png", name: "PNG", description: "Image" },
    { id: "pdf", name: "PDF", description: "Document" },
    { id: "dxf", name: "DXF", description: "CAD format" },
    { id: "ifc", name: "IFC", description: "BIM format", proOnly: true },
  ];

  const howItWorksSteps = [
    {
      id: 1,
      title: "Upload 3D Model",
      description: "Upload your 3D scan or model in supported formats.",
      icon: "📤",
    },
    {
      id: 2,
      title: "AI Processing",
      description: "Our AI detects floors, walls, and rooms automatically.",
      icon: "🧠",
    },
    {
      id: 3,
      title: "Edit & Export",
      description: "Make adjustments if needed and export your floor plan.",
      icon: "✏️",
    },
  ];

  const examples = [
    {
      id: "example1",
      title: "Apartment Floor Plan",
      description: "2-bedroom apartment with measurements",
      image: "/examples/floor-plan/apartment.jpg",
      link: "/examples/floor-plan/apartment",
      tags: ["Residential", "Apartment"],
    },
    {
      id: "example2",
      title: "Office Layout",
      description: "Open office with meeting rooms",
      image: "/examples/floor-plan/office.jpg",
      link: "/examples/floor-plan/office",
      tags: ["Commercial", "Office"],
    },
    {
      id: "example3",
      title: "Multi-Level Home",
      description: "Two-story house with detailed measurements",
      image: "/examples/floor-plan/house.jpg",
      link: "/examples/floor-plan/house",
      tags: ["Residential", "Multi-level"],
    },
  ];

  const proFeatures = [
    { text: "Export to professional CAD formats (IFC, RVT)" },
    { text: "Furniture and fixture detection" },
    { text: "Custom room labels and annotations" },
    { text: "Multi-level floor plans for complex buildings" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Floor Plan Generator</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Generate accurate floor plans from 3D models with automatic measurements
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card/50 border border-white/10 rounded-lg mb-4 shadow-lg backdrop-blur-sm">
                <div className="bg-gray-900 aspect-video rounded-t-lg">
                  <ModelViewer
                    placeholder={
                      <div className="text-white text-center h-full flex items-center justify-center">
                        <p className="text-lg mb-2">Upload a 3D model to generate a floor plan</p>
                        <p className="text-sm text-muted-foreground">
                          Supported formats: GLB, USDZ, OBJ, PLY
                        </p>
                      </div>
                    }
                  />
                </div>
                <div className="p-4">
                  <ViewerControls controls={viewerControls} className="mb-4" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Area: --</span>
                    <span>Rooms: --</span>
                    <span>Scale: 1:100</span>
                  </div>
                </div>
              </div>
              <ProcessingStatus steps={processingSteps} />
            </div>

            <div className="space-y-8">
              <FileUpload
                title="Upload 3D Model"
                description="Drag and drop your 3D model or scan here"
                icon="🏠"
                acceptedFormats={["glb", "usdz", "obj", "ply"]}
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
          description="Get access to professional CAD exports, furniture detection, and multi-level floor plans."
          features={proFeatures}
        />

        <div className="my-16">
          <HowItWorks steps={howItWorksSteps} />
        </div>

        <div className="my-16">
          <ExampleGallery examples={examples} />
        </div>

        <div className="bg-card/50 p-8 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm my-16">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background/80 p-6 rounded-lg border border-white/10 shadow-lg">
              <h3 className="font-bold text-lg mb-2">Real Estate</h3>
              <p className="text-muted-foreground text-sm">
                Create professional floor plans for property listings to give potential buyers a clear understanding of the layout.
              </p>
            </div>
            <div className="bg-background/80 p-6 rounded-lg border border-white/10 shadow-lg">
              <h3 className="font-bold text-lg mb-2">Interior Design</h3>
              <p className="text-muted-foreground text-sm">
                Generate accurate floor plans to use as a foundation for interior design projects and space planning.
              </p>
            </div>
            <div className="bg-background/80 p-6 rounded-lg border border-white/10 shadow-lg">
              <h3 className="font-bold text-lg mb-2">Architecture</h3>
              <p className="text-muted-foreground text-sm">
                Convert 3D scans of existing buildings into CAD-ready floor plans for renovation projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
