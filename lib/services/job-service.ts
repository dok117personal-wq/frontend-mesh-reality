export interface JobStatus {
  id: string;
  status: string;
  progress: number;
  errorMessage?: string;
  modelId: string;
  outputUrl?: string;
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get the status of a job
 * @param jobId The job ID to get the status for
 * @returns The job status
 */
async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`/api/jobs/${jobId}`);
  const body = await response.json().catch(() => ({}));

  if (response.status === 404 || (body?.error && String(body.error).toLowerCase().includes("job not found"))) {
    // Job doesn't exist (e.g. not yet synced, wrong id, or removed). Return a terminal status so polling stops.
    return {
      id: jobId,
      status: "not_found",
      progress: 0,
      modelId: "",
      createdAt: "",
      updatedAt: "",
    };
  }

  if (!response.ok) {
    const errorText = body?.error ?? response.statusText;
    throw new Error(`Failed to get job status: ${response.status} ${errorText}`);
  }

  // Backend may return { data: JobStatus } or plain JobStatus
  const status = (body && typeof body === 'object' && 'data' in body && body.data != null)
    ? (body.data as JobStatus)
    : (body as JobStatus);
  return status;
}

export type JobStatusCallback = (status: JobStatus) => void;

interface JobPollingState {
  interval: NodeJS.Timeout | null;
  callbacks: Map<string, Set<JobStatusCallback>>;
}

const state: JobPollingState = {
  interval: null,
  callbacks: new Map(),
};

const POLLING_INTERVAL = 2000; // 2 seconds for smoother progress updates

/**
 * Start polling for job status
 */
function startPolling() {
  if (state.interval) return;

  state.interval = setInterval(async () => {
    // Skip if no jobs to poll
    if (state.callbacks.size === 0) return;

    // Poll each job
    for (const [jobId, callbacks] of Array.from(state.callbacks.entries())) {
      try {
        const status = await getJobStatus(jobId);
        
        // Notify all callbacks for this job
        callbacks.forEach((callback: JobStatusCallback) => callback(status));
        
        // If job is in a terminal state, stop polling
        if (status.status === 'completed' || status.status === 'failed' || status.status === 'not_found') {
          state.callbacks.delete(jobId);
        }
      } catch (error) {
        console.error(`Error polling job ${jobId}:`, error);
      }
    }
    
    // Stop polling if no more jobs
    if (state.callbacks.size === 0 && state.interval) {
      clearInterval(state.interval);
      state.interval = null;
    }
  }, POLLING_INTERVAL);
}

/**
 * Subscribe to job status updates
 * @param jobId The job ID to subscribe to
 * @param callback The callback to call when the job status changes
 * @returns A function to unsubscribe
 */
export function subscribeToJobStatus(jobId: string, callback: JobStatusCallback): () => void {
  // Add callback to the job
  if (!state.callbacks.has(jobId)) {
    state.callbacks.set(jobId, new Set());
  }
  
  state.callbacks.get(jobId)!.add(callback);
  
  // Start polling if not already started
  startPolling();
  
  // Initial poll to get current status
  getJobStatus(jobId)
    .then(status => callback(status))
    .catch(error => console.error(`Error getting initial job status for ${jobId}:`, error));
  
  // Return unsubscribe function
  return () => {
    const callbacks = state.callbacks.get(jobId);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        state.callbacks.delete(jobId);
      }
    }
  };
}
