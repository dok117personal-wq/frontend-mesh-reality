"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { removeImageBackground } from "@/lib/services/background-removal-service";
import ModelViewer from "@/components/tools/shared/model-viewer";
import FileUpload from "@/components/tools/shared/file-upload";
import ProcessingStatus, { ProcessingStep } from "@/components/tools/shared/processing-status";
import ExportOptions from "@/components/tools/shared/export-options";
import HowItWorks from "@/components/tools/shared/how-it-works";
import ExampleGallery from "@/components/tools/shared/example-gallery";
import UpgradeBanner from "@/components/tools/shared/upgrade-banner";
import LoginPrompt from "@/components/auth/login-prompt";
import { toast } from "sonner";
import { subscribeToJobStatus, JobStatus } from "@/lib/services/job-service";

export default function PhotogrammetryPage() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const isLoading = loading;

  // State for managing uploaded images (multiple photos from different angles)
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [processedImage, setProcessedImage] = useState<File | null>(null); // Only used when exactly 1 image + removeBackground
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 1, name: "Upload Images", status: "waiting", progress: 0 },
    { id: 2, name: "Generate 3D Model", status: "waiting", progress: 0 },
    { id: 3, name: "Finalize Model", status: "waiting", progress: 0 },
  ]);
  
  // Reference to download link
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // Handle file selection (multiple images for photogrammetry)
  const handleFileSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setUploadedImages(files);
      setProcessedImage(null);
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 1 
            ? { ...step, status: "completed", progress: 100 } 
            : step
        )
      );
      setModelUrl(null);
    }
  }, []);
  
  // Process single image for background removal (only when exactly 1 image selected)
  useEffect(() => {
    const processBackgroundRemoval = async () => {
      if (uploadedImages.length !== 1) {
        setProcessedImage(null);
        return;
      }
      const singleImage = uploadedImages[0];
      if (!removeBackground) {
        setProcessedImage(null);
        return;
      }
      try {
        setIsProcessingImage(true);
        toast.info('Removing background...');
        const processedBlob = await removeImageBackground(singleImage);
        const processedFile = new File(
          [processedBlob], 
          `${singleImage.name.split('.')[0]}-nobg.png`, 
          { type: 'image/png' }
        );
        setProcessedImage(processedFile);
        toast.success('Background removed successfully');
      } catch (error) {
        console.error('Error removing background:', error);
        toast.error('Failed to remove background');
        setProcessedImage(null);
        setRemoveBackground(false);
      } finally {
        setIsProcessingImage(false);
      }
    };
    processBackgroundRemoval();
  }, [uploadedImages, removeBackground]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // State for job tracking
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const terminalToastShownRef = useRef<string | null>(null);

  // Subscribe to job status updates
  useEffect(() => {
    if (!currentJobId) return;
    terminalToastShownRef.current = null;

    const unsubscribe = subscribeToJobStatus(currentJobId, (status: JobStatus) => {
      console.log('Job status update:', status);

      const rawStatus = String(status?.status ?? '').toLowerCase();

      if (rawStatus === 'processing' || rawStatus === 'pending') {
        const progress = typeof status.progress === 'number' ? status.progress : 50;
        setProcessingSteps(prev =>
          prev.map(step =>
            step.id === 3
              ? { ...step, status: "in-progress", progress }
              : step
          )
        );
        return;
      }

      if (rawStatus === 'completed') {
        if (status.outputUrl) setModelUrl(status.outputUrl);
        if (status.previewUrl) setPreviewUrl(status.previewUrl);
        setProcessingSteps(prev =>
          prev.map(step =>
            step.id === 3 ? { ...step, status: "completed", progress: 100 } : step
          )
        );
        setIsProcessing(false);
        if (terminalToastShownRef.current !== currentJobId) {
          terminalToastShownRef.current = currentJobId;
          toast.success('3D model generated successfully');
        }
        return;
      }

      if (rawStatus === 'failed' || rawStatus === 'not_found') {
        setProcessingSteps(prev =>
          prev.map(step =>
            step.id === 3 ? { ...step, status: "error", progress: 0 } : step
          )
        );
        setIsProcessing(false);
        if (terminalToastShownRef.current !== currentJobId) {
          terminalToastShownRef.current = currentJobId;
          const failedMessage =
            rawStatus === 'not_found'
              ? 'Job not found. Please try again.'
              : (status.errorMessage && status.errorMessage.trim())
                ? status.errorMessage
                : 'Failed to generate model. Use 20+ photos from different angles for best results.';
          toast.error(failedMessage);
        }
      }
    });

    return unsubscribe;
  }, [currentJobId]);

  // Process the images and generate 3D model (photogrammetry needs multiple photos)
  const processImage = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }
    if (uploadedImages.length < 3) {
      toast.error('Photogrammetry needs at least 3 photos from different angles. Add more photos.');
      return;
    }
    if (uploadedImages.length < 20) {
      toast.info('For best results use 20+ photos from different angles. Continuing with current selection.');
    }

    if (removeBackground && uploadedImages.length === 1 && isProcessingImage) {
      toast.info('Please wait for background removal to complete');
      return;
    }

    try {
      setIsProcessing(true);
      setModelUrl(null);
      setPreviewUrl(null);
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 2 
            ? { ...step, status: "in-progress", progress: 10 } 
            : step
        )
      );

      // Use processed (bg-removed) single image if applicable, otherwise all uploaded images
      const filesToSend: File[] =
        uploadedImages.length === 1 && removeBackground && processedImage
          ? [processedImage]
          : uploadedImages;

      const base64Images = await Promise.all(filesToSend.map(fileToBase64));
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 2 
            ? { ...step, progress: 30 } 
            : step
        )
      );

      toast.info('Uploading images and starting 3D reconstruction…');
      const response = await fetch('/api/generate-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: base64Images,
          title: 'Generated Model',
          description: 'Model generated from photogrammetry',
          priority: 5,
        }),
      });

      // Check if response is successful
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Get the job data
      const jobData = await response.json();
      
      // Set the current job ID
      setCurrentJobId(jobData.jobId);
      
      // Update step 2 to completed
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 2 
            ? { ...step, status: "completed", progress: 100 } 
            : step
        )
      );
      
      // Update step 3 to in-progress
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 3 
            ? { ...step, status: "in-progress", progress: 0 } 
            : step
        )
      );
      
      toast.info('Building 3D model…');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image');
      
      // Update steps to show error
      setProcessingSteps(prev => 
        prev.map(step => 
          step.status === "in-progress" 
            ? { ...step, status: "error", progress: 0 } 
            : step
        )
      );
      
      setIsProcessing(false);
    }
  };

  // Handle export/download
  const handleExport = (formatId: string) => {
    if (!modelUrl) {
      toast.error('No model available to export');
      return;
    }

    if (formatId === 'usdz' || formatId === 'glb') {
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = modelUrl;
        downloadLinkRef.current.download = `model-${Date.now()}.${formatId === 'usdz' ? 'usdz' : 'glb'}`;
        downloadLinkRef.current.click();
      }
    } else {
      toast.error(`Export format ${formatId} is not supported yet`);
    }
  };

  // Photogrammetry outputs USDZ; download as model
  const exportFormats = [
    { id: "usdz", name: "USDZ", description: "Apple 3D format (AR-ready)" },
  ];

  // Updated how it works steps
  const howItWorksSteps = [
    {
      id: 1,
      title: "Upload Image",
      description: "Upload a single image of your subject.",
      icon: "📸",
    },
    {
      id: 2,
      title: "Optional: Remove Background",
      description: "Isolate your subject from its background for better results.",
      icon: "✂️",
    },
    {
      id: 3,
      title: "Processing",
      description: "Our AI analyzes your image to create a 3D model.",
      icon: "⚙️",
    },
    {
      id: 4,
      title: "Download",
      description: "Download your 3D model in GLB format.",
      icon: "💾",
    },
  ];

  // Example gallery (unchanged)
  const examples = [
    {
      id: "example1",
      title: "Product Scan",
      description: "Detailed 3D model of a shoe created from a single image",
      image: "https://picsum.photos/seed/photogrammetry-shoe/800/450",
      link: "/examples/photogrammetry/shoe",
      tags: ["Product", "E-commerce"],
    },
    {
      id: "example2",
      title: "Architectural Model",
      description: "Historic building captured with a single image",
      image: "https://picsum.photos/seed/photogrammetry-building/800/450",
      link: "/examples/photogrammetry/building",
      tags: ["Architecture", "Heritage"],
    },
    {
      id: "example3",
      title: "Sculpture Digitization",
      description: "Museum artifact preserved in 3D",
      image: "https://picsum.photos/seed/photogrammetry-sculpture/800/450",
      link: "/examples/photogrammetry/sculpture",
      tags: ["Art", "Museum"],
    },
  ];

  // Pro features (updated)
  const proFeatures = [
    { text: "Higher resolution models" },
    { text: "Advanced texture generation" },
    { text: "Advanced background removal with AI" },
    { text: "Mesh cleanup and optimization" },
    { text: "Additional export formats" },
  ];

  // If still loading session, show a loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Single Image to 3D</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Convert a single image into a detailed 3D model
            </p>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Single Image to 3D</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Convert a single image into a detailed 3D model
            </p>
            
            <div className="max-w-md mx-auto">
              <LoginPrompt 
                title="Sign in to Create 3D Models"
                description="Please sign in to convert your images into 3D models. Transform any image into a detailed 3D model with our AI technology."
              />
            </div>
            
            <div className="mt-16">
              <HowItWorks steps={howItWorksSteps} />
            </div>
            
            <div className="mt-16">
              <ExampleGallery examples={examples} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, show the full UI
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">Single Image to 3D</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Convert a single image into a detailed 3D model
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative mb-4">
                {previewUrl && !modelUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                    <img 
                      src={previewUrl} 
                      alt="Model preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <ModelViewer
                  className="mb-4"
                  modelUrl={modelUrl || undefined}
                  placeholder={
                    <div className="text-white text-center">
                      <p className="text-lg mb-2">Upload an image to create a 3D model</p>
                      <p className="text-sm text-muted-foreground">
                        Our AI will generate a 3D model from a single image
                      </p>
                    </div>
                  }
                />
              </div>
              <ProcessingStatus steps={processingSteps} />
            </div>

            <div className="space-y-8">
              <FileUpload
                title="Upload Photos"
                description="Drag and drop 20+ photos from different angles, or click to browse"
                icon="📸"
                acceptedFormats={["jpg", "jpeg", "png", "ppm"]}
                onFilesSelected={handleFileSelected}
                multiple={true}
                selectedFiles={uploadedImages}
              />
              {uploadedImages.length > 0 && uploadedImages.length < 20 && (
                <p className="mt-2 text-sm text-amber-500">
                  For best results, add more photos (20+ recommended from different angles).
                </p>
              )}
              {uploadedImages.length >= 20 && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {uploadedImages.length} photos selected — good coverage for 3D reconstruction.
                </p>
              )}
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="remove-background" 
                    checked={removeBackground}
                    onCheckedChange={setRemoveBackground}
                    disabled={isProcessing || isProcessingImage || uploadedImages.length !== 1}
                  />
                  <Label htmlFor="remove-background">Remove Background (single photo only)</Label>
                  {isProcessingImage && (
                    <div className="ml-2 animate-pulse">
                      <div className="h-4 w-4 rounded-full bg-indigo-500"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground ml-6 mb-2">
                  When using one photo, isolate the subject for better results
                </p>
                {uploadedImages.length === 1 && processedImage && (
                  <div className="ml-6 mt-2 border border-white/10 rounded overflow-hidden w-24 h-24 relative">
                    <img 
                      src={URL.createObjectURL(processedImage)} 
                      alt="Processed" 
                      className="w-full h-full object-contain bg-gray-800/50"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-xs text-center py-1">
                      Background Removed
                    </div>
                  </div>
                )}
              </div>

              <button
                className={`w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded transition-all duration-200 ${
                  isProcessing || isProcessingImage || uploadedImages.length < 3
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-indigo-600 hover:to-purple-700"
                }`}
                onClick={processImage}
                disabled={isProcessing || isProcessingImage || uploadedImages.length < 3}
              >
                {isProcessing 
                  ? "Processing..." 
                  : isProcessingImage 
                    ? "Removing Background..." 
                    : "Generate 3D Model"}
              </button>

              <ExportOptions
                formats={exportFormats}
                onExport={handleExport}
                isDisabled={!modelUrl}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>

        <UpgradeBanner
          title="Upgrade to Pro for Better Results"
          description="Get higher quality models, advanced textures, and more export options."
          features={proFeatures}
        />

        <div className="my-16">
          <HowItWorks steps={howItWorksSteps} />
        </div>

        <div className="my-16">
          <ExampleGallery examples={examples} />
        </div>

        <div className="bg-card/50 p-8 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm my-16">
          <h2 className="text-2xl font-bold mb-4">Tips for Great Results</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Upload 20+ individual photos of the same object from different angles (not one combined image)</li>
            <li>Move around the object and overlap coverage between shots for best 3D reconstruction</li>
            <li>Use consistent lighting and keep the subject in focus in every photo</li>
            <li>Keep the subject centered and avoid reflective, transparent, or very thin objects</li>
            <li>For a single-photo upload, use background removal for cleaner results</li>
          </ul>
        </div>
      </div>
      
      {/* Hidden download link */}
      <a ref={downloadLinkRef} style={{ display: 'none' }} />
    </div>
  );
}
