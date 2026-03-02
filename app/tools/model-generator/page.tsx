"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import ModelViewer from "@/components/tools/shared/model-viewer";
import ProcessingStatus, { ProcessingStep } from "@/components/tools/shared/processing-status";
import ExportOptions from "@/components/tools/shared/export-options";
import HowItWorks from "@/components/tools/shared/how-it-works";
import ExampleGallery from "@/components/tools/shared/example-gallery";
import UpgradeBanner from "@/components/tools/shared/upgrade-banner";
import LoginPrompt from "@/components/auth/login-prompt";
import { subscribeToJobStatus, JobStatus } from "@/lib/services/job-service";
import { getRandomLoadingMessage, getRandomTime } from "@/lib/loading-messages";

export default function ModelGeneratorPage() {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const isLoading = loading;

  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  
  // Loading message state
  const [loadingMessage, setLoadingMessage] = useState<string>(getRandomLoadingMessage());
  const [isFading, setIsFading] = useState<boolean>(false);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect for cycling through loading messages when processing
  useEffect(() => {
    // Only cycle messages when processing
    if (!isProcessing) {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
        messageTimerRef.current = null;
      }
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      return;
    }
    
    // Function to update the loading message with fade effect
    const updateLoadingMessage = () => {
      // Start fade out
      setIsFading(true);
      
      // After fade out, change message and fade in
      fadeTimerRef.current = setTimeout(() => {
        setLoadingMessage(getRandomLoadingMessage());
        setIsFading(false);
        
        // Schedule the next update after a random time
        messageTimerRef.current = setTimeout(updateLoadingMessage, getRandomTime());
      }, 300); // Match the duration in the CSS transition
    };
    
    // Start the cycle
    messageTimerRef.current = setTimeout(updateLoadingMessage, getRandomTime());
    
    // Cleanup on unmount or when processing stops
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, [isProcessing]);

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 1, name: "Text Analysis", status: "waiting", progress: 0 },
    { id: 2, name: "Queued", status: "waiting", progress: 0 },
    { id: 3, name: "Model Exported", status: "waiting", progress: 0 },
  ]);

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
        setProcessingSteps(prev =>
          prev.map(step => {
            if (step.id === 1) return { ...step, status: "completed", progress: 100 };
            if (step.id === 2) {
              return {
                ...step,
                name: "Processing",
                status: "in-progress",
                progress: (status.progress ?? 0) * 100,
              };
            }
            return { ...step, status: "waiting", progress: 0 };
          })
        );
        return;
      }

      if (rawStatus === 'completed') {
        if (status.outputUrl) setModelUrl(status.outputUrl);
        if (status.previewUrl) setPreviewUrl(status.previewUrl);
        setProcessingSteps(prev =>
          prev.map(step => ({ ...step, status: "completed", progress: 100 }))
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
            step.status === "in-progress" ? { ...step, status: "error", progress: 0 } : step
          )
        );
        setIsProcessing(false);
        if (terminalToastShownRef.current !== currentJobId) {
          terminalToastShownRef.current = currentJobId;
          toast.error(
            rawStatus === 'not_found'
              ? 'Job not found. Please try again.'
              : (status.errorMessage || 'Failed to generate model')
          );
        }
      }
    });

    return unsubscribe;
  }, [currentJobId]);

  // Handle model generation
  const generateModel = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a text prompt');
      return;
    }

    try {
      setIsProcessing(true);
      setModelUrl(null);
      setPreviewUrl(null);
      
      // Reset processing steps
      setProcessingSteps(prev => 
        prev.map(step => ({ ...step, status: "waiting", progress: 0 }))
      );
      
      // Step 1: Text Analysis (client-side only)
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 1 
            ? { ...step, status: "in-progress", progress: 50 } 
            : step
        )
      );
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 1 
            ? { ...step, status: "completed", progress: 100 } 
            : step
        )
      );
      
      // Step 2: Start Shape Generation
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === 2 
            ? { ...step, status: "in-progress", progress: 10 } 
            : step
        )
      );
      
      toast.info('Creating job for 3D model generation...');
      
      // Call the API to create a job
      const response = await fetch('/api/generate-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
          title: `AI Generated: ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}`,
          description: prompt,
          texture: true, // Enable texture generation
          priority: 5, // Default priority
        }),
      });
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // Get the job data
      const jobData = await response.json();
      
      // Set the current job ID
      setCurrentJobId(jobData.jobId);
      
      toast.success('Job created successfully, generating model...');
    } catch (error) {
      console.error('Error generating model:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate model');
      
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

    // For now, we only support GLB format
    if (formatId === 'glb') {
      // Create a download link
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = modelUrl;
        downloadLinkRef.current.download = `model-${Date.now()}.glb`;
        downloadLinkRef.current.click();
      }
    } else {
      toast.error(`Export format ${formatId} is not supported yet`);
    }
  };

  const exportFormats = [
    { id: "glb", name: "GLB", description: "Standard 3D format" },
    { id: "usdz", name: "USDZ", description: "For Apple AR" },
    { id: "obj", name: "OBJ", description: "With materials" },
    { id: "fbx", name: "FBX", description: "For animation", proOnly: true },
  ];

  const howItWorksSteps = [
    {
      id: 1,
      title: "Describe Your Model",
      description: "Enter a detailed description of what you want to create.",
      icon: "💬",
    },
    {
      id: 2,
      title: "AI Generation",
      description: "Our AI analyzes your description and generates a 3D model.",
      icon: "🤖",
    },
    {
      id: 3,
      title: "Download & Use",
      description: "Download your model in various formats for games, AR, or 3D printing.",
      icon: "💾",
    },
  ];

  const proFeatures = [
    { text: "Higher resolution textures (4K)" },
    { text: "More detailed geometry (2x polygon count)" },
    { text: "Priority processing in queue" },
    { text: "Advanced prompt controls with style parameters" },
  ];

  // Larger array of example prompts for various 3D models
  const allPromptExamples = [
    "A cute dinosaur with tiny hands and a monocle",
    "A robot cat with glowing eyes and mechanical ears",
    "A stylized cartoon fox wearing a wizard hat and robe",
    "A steampunk owl with brass gears and copper wings",
    "A friendly monster with three eyes and polka dot fur",
    "A vintage sports car with chrome details and leather seats",
    "A futuristic hover bike with glowing energy trails",
    "An ancient treasure chest with gold trim and jeweled lock",
    "A fantasy sword with a crystal blade and ornate hilt",
    "A mechanical dog with visible gears and a wagging tail",
    "A plush teddy bear with button eyes and a stitched smile",
    "A fantasy creature that's half rabbit, half fish",
    "A detailed architectural model of a futuristic skyscraper",
    "A stylized low-poly tree with autumn-colored leaves",
    "A chibi-style samurai frog with armor and a katana",
    "A sci-fi drone with multiple propellers and a camera",
    "A crystal golem with glowing runes etched into its body",
    "An ornate antique pocket watch with visible gears",
    "A fluffy monster with six arms and a cyclops eye",
    "A magical staff with floating orbs and ethereal effects",
  ];
  
  // State for the current set of example prompts
  const [promptExamples, setPromptExamples] = useState<string[]>([]);
  
  // Function to randomly select 4 prompts from the larger array
  const refreshExamples = useCallback(() => {
    const shuffled = [...allPromptExamples].sort(() => 0.5 - Math.random());
    setPromptExamples(shuffled.slice(0, 4));
  }, []);
  
  // Initialize the example prompts on component mount
  useEffect(() => {
    refreshExamples();
  }, [refreshExamples]);

  // If still loading session, show a loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">AI Model Generator</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Generate 3D models from text descriptions using AI
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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">AI Model Generator</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Generate 3D models from text descriptions using AI
            </p>
            
            <div className="max-w-md mx-auto">
              <LoginPrompt 
                title="Sign in to Generate 3D Models"
                description="Please sign in to use our AI model generator. Create amazing 3D models with just a text description."
              />
            </div>
            
            <div className="mt-16">
              <HowItWorks steps={howItWorksSteps} />
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">AI Model Generator</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Generate 3D models from text descriptions using AI
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
                      {isProcessing ? (
                        <>
                          <p className="text-lg mb-2">Generating your 3D model</p>
                          <p className={`text-sm text-muted-foreground min-h-[40px] flex items-center justify-center transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                            {loadingMessage}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg mb-2">Your 3D model will appear here</p>
                          <p className="text-sm text-muted-foreground">
                            Describe what you want to generate to get started
                          </p>
                        </>
                      )}
                    </div>
                  }
                />
              </div>
              <ProcessingStatus steps={processingSteps} />
            </div>

            <div className="space-y-8">
              <div className="bg-card/50 p-4 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm">
                <h3 className="font-bold text-lg mb-2">Describe Your Model</h3>
                <textarea
                  className="w-full p-3 bg-background/80 border border-white/10 rounded mb-3 h-32 text-foreground placeholder:text-muted-foreground focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  placeholder="Describe what you want to generate with details about appearance, style, and unique features..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                <button
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!prompt.trim() || isProcessing}
                  onClick={generateModel}
                >
                  {isProcessing ? "Generating..." : "Generate Model"}
                </button>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">Example prompts:</p>
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      onClick={refreshExamples}
                      type="button"
                    >
                      <span>Refresh</span>
                      <span className="text-xs">⟳</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {promptExamples.map((example, index) => (
                      <button
                        key={index}
                        className="text-xs bg-secondary/50 text-foreground p-2 rounded block w-full text-left hover:bg-secondary/80 border border-white/5 transition-colors"
                        onClick={() => setPrompt(example)}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <ExportOptions
                formats={exportFormats}
                onExport={handleExport}
                isDisabled={!modelUrl || isProcessing}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>

        <UpgradeBanner
          title="Upgrade to Pro for Better Models"
          description="Get higher quality models with more detailed geometry, better textures, and advanced controls."
          features={proFeatures}
        />

        <div className="my-16">
          <HowItWorks steps={howItWorksSteps} />
        </div>
        
        <div className="bg-card/50 p-8 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm my-16">
          <h2 className="text-2xl font-bold mb-4">Tips for Great Results</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Focus on a single object or subject in your description</li>
            <li>Include specific details about appearance, like colors, textures, and materials</li>
            <li>Specify the style (realistic, cartoon, low-poly, stylized, etc.)</li>
            <li>Describe distinctive features that make your model unique</li>
            <li>Mention the orientation or position if relevant</li>
            <li>Keep your description concise and focused on the main subject</li>
          </ul>
        </div>
      </div>
      
      {/* Hidden download link */}
      <a ref={downloadLinkRef} style={{ display: 'none' }} />
    </div>
  );
}
