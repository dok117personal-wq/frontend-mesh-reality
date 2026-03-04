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

/** Safe uppercase for display; never throws. Use instead of .toUpperCase() on values that might not be strings. */
export function safeUpper(x: unknown): string {
  if (x == null) return "";
  if (typeof x === "string") return x.toUpperCase();
  return String(x).toUpperCase();
}

/** Supported 3D export formats (fallback when API fails). */
export const SUPPORTED_EXPORT_FORMATS = ["usdz", "obj", "stl", "glb"] as const;

export type ExportFormatItem = {
  code: string;
  displayName: string | null;
  canCreate: boolean;
  sortOrder: number;
};

function normalizeFormatItem(raw: unknown): ExportFormatItem {
  if (typeof raw === "string") {
    return {
      code: raw,
      displayName: safeUpper(raw),
      canCreate: ["obj", "stl"].includes(raw.toLowerCase()),
      sortOrder: 0,
    };
  }
  if (raw && typeof raw === "object" && "code" in raw) {
    const o = raw as Record<string, unknown>;
    const code = typeof o.code === "string" ? o.code : String(o.code ?? "");
    return {
      code,
      displayName: typeof o.displayName === "string" ? o.displayName : (o.display_name != null ? String(o.display_name) : null) ?? safeUpper(code),
      canCreate: Boolean(o.canCreate ?? o.can_convert_from_usdz),
      sortOrder: typeof o.sortOrder === "number" ? o.sortOrder : Number(o.sort_order ?? 0),
    };
  }
  return { code: "", displayName: null, canCreate: false, sortOrder: 0 };
}

export async function getSupportedFormats(): Promise<ExportFormatItem[]> {
  try {
    const data = await backendFetch<{ formats: unknown[] }>("/api/models/formats");
    if (!Array.isArray(data?.formats)) return [];
    return data.formats.map(normalizeFormatItem).filter((f) => f.code.length > 0);
  } catch {
    return SUPPORTED_EXPORT_FORMATS.map((code, i) => ({
      code,
      displayName: safeUpper(code),
      canCreate: ["obj", "stl"].includes(code),
      sortOrder: i,
    }));
  }
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

/** Revoke restricted share for one email. Owner only. */
export async function revokeModelShare(modelId: string, email: string): Promise<void> {
  await backendFetch(`/api/models/${modelId}/shares/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

/** Recipient: remove shared model from "Shared with you" list (dismiss). Does not delete the model. */
export async function dismissSharedModel(modelId: string): Promise<void> {
  await backendFetch("/api/models/shared/dismiss", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId }),
  });
}

/** Request export to a format. Returns { url, status: 'available' | 'generated' }. May trigger conversion. */
export async function requestExport(
  modelId: string,
  format: string
): Promise<{ url: string; status: "available" | "generated" }> {
  return backendFetch(`/api/models/${modelId}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ format: format.toLowerCase() }),
  });
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
