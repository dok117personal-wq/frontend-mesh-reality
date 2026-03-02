"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { JobStatus, getJobStatus } from "@/lib/services/upload-service";
import { getRandomLoadingMessage, getRandomTime } from "@/lib/loading-messages";

const INVALID_JOB_IDS = ["undefined", "null", ""];

export default function PreviewClient({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(
    !jobId || INVALID_JOB_IDS.includes(jobId) ? "Invalid or missing job ID. Please start from the upload page." : null
  );
  const [modelName, setModelName] = useState<string>("Your Model");
  const [loadingMessage, setLoadingMessage] = useState<string>(getRandomLoadingMessage());
  const [isFading, setIsFading] = useState<boolean>(false);
  const messageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect for cycling through loading messages
  useEffect(() => {
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
    
    // Cleanup on unmount
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!jobId || INVALID_JOB_IDS.includes(jobId)) return;

    let ws: WebSocket | null = null;
    let interval: NodeJS.Timeout | null = null;

    const connectWebSocket = () => {
      const baseUrl = process.env.NEXT_PUBLIC_SWIFT_WS_URL;
      if (!baseUrl || baseUrl === "undefined") {
        console.warn(
          "NEXT_PUBLIC_SWIFT_WS_URL is not set; using polling only. Set it to your Swift API WebSocket URL (e.g. ws://localhost:8080 or wss://your-swift-host)."
        );
        startPolling();
        return;
      }
      const wsUrl = `${baseUrl.replace(/\/$/, "")}/ws?jobId=${jobId}`;
      console.log("Connecting to WebSocket:", wsUrl);

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setStatus(data);
          if (data.title) setModelName(data.title);
          if (data.status === "completed") {
            toast.success("Model processing completed!");
            router.push("/dashboard/models");
          } else if (data.status === "failed") {
            setError(data.message || "Processing failed");
            toast.error(data.message || "Processing failed");
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        // Browser often gives an empty error object; avoid noisy log
        console.warn("WebSocket connection failed, falling back to polling. Ensure NEXT_PUBLIC_SWIFT_WS_URL is reachable from the browser (e.g. ws://localhost:8080 when dev server is on same machine).");
        startPolling();
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason || "(no reason)");
        startPolling();
      };
    };

    const startPolling = () => {
      if (interval) return;

      const pollStatus = async () => {
        try {
          const data = await getJobStatus(jobId);
          setStatus(data);
          
          // Update model name if available
          if (data.title) {
            setModelName(data.title);
          }

          if (data.status === "completed") {
            toast.success("Model processing completed!");
            router.push("/dashboard/models");
          } else if (data.status === "failed") {
            setError(data.message || "Processing failed");
            toast.error(data.message || "Processing failed");
          }
        } catch (error) {
          console.error("Error polling status:", error);
          setError(error instanceof Error ? error.message : "Failed to check status");
        }
      };

      // Poll every 15s; photogrammetry takes minutes and Swift logs each GET
      interval = setInterval(pollStatus, 15000);
      pollStatus(); // Initial poll
    };

    // Try WebSocket first, fallback to polling
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [jobId, router, user]);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Processing {modelName}</h1>
          <p className="text-muted-foreground mt-2">
            Please wait while we process your model
          </p>
        </div>

        <Card className="p-8">
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            {error ? (
              <div className="text-center text-red-500">
                <p className="font-semibold">Error</p>
                <p className="mt-2">{error}</p>
              </div>
            ) : (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <div className="text-center">
                  <p className="font-semibold">
                    {status?.status || "Initializing..."}
                  </p>
                  <p className={`text-sm text-muted-foreground mt-2 min-h-[40px] flex items-center justify-center transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    {loadingMessage}
                  </p>
                  {status?.progress !== undefined && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {Math.round(status.progress)}%
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
