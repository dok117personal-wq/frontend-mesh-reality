export interface UploadResponse {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  model: {
    id: string;
  };
  outputFormats: string[];
  outputUrls: null | Record<string, string>;
  outputUrl: null | string;
  errorMessage: null | string;
}

export interface JobStatus {
  status: string;
  progress: number;
  message: string;
  title?: string;
  outputUrls?: {
    [key: string]: string;
  };
}

const SWIFT_API_URL = process.env.NEXT_PUBLIC_SWIFT_API_URL;

export async function uploadFiles(files: File[], title: string, description: string = ""): Promise<UploadResponse> {
  if (!SWIFT_API_URL) throw new Error("NEXT_PUBLIC_SWIFT_API_URL is not configured");
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });
  formData.append("title", title);
  formData.append("description", description);

  const response = await fetch(`${SWIFT_API_URL}/jobs`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ?? `Upload failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function uploadFile(file: File, title: string, description: string = ""): Promise<UploadResponse> {
  return uploadFiles([file], title, description);
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  // Prefer backend API (works for job_xxx from dashboard upload / generate-model)
  const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`, {
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Job not found");
    }
    throw new Error(`Failed to fetch job status: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    status: data.status ?? "pending",
    progress: typeof data.progress === "number" ? data.progress : 0,
    message: data.errorMessage ?? "",
    title: data.title,
    outputUrls: data.outputUrl ? { usdz: data.outputUrl } : data.outputUrls,
  };
}

export async function downloadJob(jobId: string): Promise<Blob> {
  if (!SWIFT_API_URL) throw new Error("NEXT_PUBLIC_SWIFT_API_URL is not configured");
  const response = await fetch(`${SWIFT_API_URL}/jobs/${jobId}/download`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to download job: ${response.statusText}`);
  }
  return response.blob();
}
