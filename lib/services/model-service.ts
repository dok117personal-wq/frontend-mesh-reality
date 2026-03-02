import { backendFetch, API_URL } from "@/lib/api-client";

export interface Model {
  id: string;
  userId: string;
  user: {
    id: string;
    displayName?: string;
    photoUrl?: string;
  };
  title: string;
  description?: string;
  filePath: string;
  fileType: string;
  previewUrl?: string;
  outputUrls?: Record<string, string>;
  status: "processing" | "completed" | "failed";
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  jobs?: Array<{
    id: string;
    status: string;
    errorMessage: string | null;
    outputFormats: unknown;
    outputUrls: unknown;
    outputUrl?: string;
    createdAt: string | null;
    updatedAt: string | null;
    modelId: string | null;
  }>;
}

export async function getUserModels(): Promise<Model[]> {
  const data = await backendFetch<{ models: Model[]; total: number }>("/api/models");
  return data?.models ?? [];
}

export async function deleteModel(modelId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/models/${modelId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || response.statusText);
  }
}

export async function downloadModel(modelId: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/models/${modelId}/download`, {
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download model: ${response.status} ${errorText}`);
  }
  return response.blob();
}

export async function shareModel(modelId: string): Promise<{ shareUrl: string }> {
  const response = await fetch(`${API_URL}/api/models/${modelId}/share`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to share model: ${response.status} ${errorText}`);
  }
  return response.json();
}

export interface CreateModelGenerationJobParams {
  title?: string;
  description?: string;
  generationType: "text" | "image" | "images";
  textPrompt?: string;
  imageData?: string;
  imageDataArray?: string[];
  options?: {
    texture?: boolean;
    priority?: number;
    [key: string]: unknown;
  };
}

export interface JobResponse {
  jobId: string;
  modelId: string;
  status: string;
}

export async function createModelGenerationJob(
  params: CreateModelGenerationJobParams
): Promise<JobResponse> {
  const data = await backendFetch<{ jobId: string; status: string }>(
    "/api/models/generate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }
  );
  return {
    jobId: data!.jobId,
    status: data!.status,
    modelId: (data as { modelId?: string }).modelId ?? "",
  };
}

export async function getJobStatus(
  jobId: string
): Promise<{
  id: string;
  status: string;
  progress: number;
  errorMessage?: string | null;
  modelId: string | null;
  outputUrl?: string;
  previewUrl?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}> {
  const data = await backendFetch<{
    id: string;
    status: string;
    progress: number;
    errorMessage?: string | null;
    modelId: string | null;
    outputUrl?: string;
    previewUrl?: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  }>(`/api/models/jobs/${jobId}`);
  return data!;
}
