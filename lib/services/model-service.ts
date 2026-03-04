import { backendFetch, API_URL, backendFetchHeaders } from "@/lib/api-client";

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
  /** True when this model appears in the list because it was shared with the current user (not owned by them). */
  sharedWithMe?: boolean;
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
    headers: { ...backendFetchHeaders() },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message || response.statusText);
  }
}

/** Download model (authenticated). Optional format: usdz, obj, stl, glb, etc. Default usdz. */
export async function downloadModel(
  modelId: string,
  format?: string
): Promise<Blob> {
  const url = new URL(`${API_URL}/api/models/${modelId}/download`);
  if (format) url.searchParams.set("format", format);
  const response = await fetch(url.toString(), {
    credentials: "include",
    headers: { ...backendFetchHeaders() },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download model: ${response.status} ${errorText}`);
  }
  return response.blob();
}

export type ShareResult =
  | { shareUrl: string; isPublic: true }
  | { shareUrls: Array<{ email: string; shareUrl: string }>; isPublic: false };

export async function shareModel(
  modelId: string,
  options: { type: "public" | "restricted"; emails?: string[] }
): Promise<ShareResult> {
  const data = await backendFetch<ShareResult>(`/api/models/${modelId}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: options.type,
      emails: options.type === "restricted" ? options.emails ?? [] : undefined,
    }),
  });
  return data!;
}

/** Get model by restricted share token (auth required; link was shared with current user's email). */
export async function getModelByShareToken(token: string): Promise<Model> {
  const data = await backendFetch<Model>(`/api/models/shared/s/${encodeURIComponent(token)}`);
  return data!;
}

/** List people this model is shared with (restricted shares). Owner only. */
export async function getModelShares(modelId: string): Promise<
  Array<{ email: string; shareUrl: string; createdAt: string }>
> {
  const data = await backendFetch<{ shares: Array<{ email: string; shareUrl: string; createdAt: string }> }>(
    `/api/models/${modelId}/shares`
  );
  return data?.shares ?? [];
}

/** Download model via restricted share token (auth required). */
export async function downloadByShareToken(
  token: string,
  format?: string
): Promise<Blob> {
  const url = new URL(`${API_URL}/api/models/shared/s/${encodeURIComponent(token)}/download`);
  if (format) url.searchParams.set("format", format);
  const response = await fetch(url.toString(), {
    credentials: "include",
    headers: { ...backendFetchHeaders() },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download: ${response.status} ${errorText}`);
  }
  return response.blob();
}

/** Public: get shared model by id. Works with or without auth (no credentials sent). */
export async function getPublicModel(modelId: string): Promise<Model> {
  const url = `${API_URL}/api/models/public/${modelId}`;
  const response = await fetch(url, {
    credentials: "omit",
    headers: { ...backendFetchHeaders() },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg = (body as { error?: { message?: string } }).error?.message || response.statusText || "Failed to load model";
    throw new Error(msg);
  }
  const body = await response.json();
  const data = (body as { data?: Model }).data;
  if (!data) throw new Error("Invalid response");
  return data;
}

/** Public: download shared model by format. Works with or without auth (no credentials sent). */
export async function downloadPublicModel(
  modelId: string,
  format?: string
): Promise<Blob> {
  const url = new URL(`${API_URL}/api/models/public/${modelId}/download`);
  if (format) url.searchParams.set("format", format);
  const response = await fetch(url.toString(), {
    credentials: "omit",
    headers: { ...backendFetchHeaders() },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to download: ${response.status} ${errorText}`);
  }
  return response.blob();
}

export interface CreateModelGenerationJobParams {
  title?: string;
  description?: string;
  generationType: "text" | "image" | "images";
  textPrompt?: string;
  imageData?: string;
  imageDataArray?: string[];
  /** R2 image URLs (from POST /api/models/upload-images). When set, Swift downloads from these instead of receiving multipart. */
  imageUrls?: string[];
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
