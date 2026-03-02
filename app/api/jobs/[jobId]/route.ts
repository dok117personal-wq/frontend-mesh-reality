import { NextRequest, NextResponse } from 'next/server';
import { getBackendSession, serverBackendFetch } from "@/lib/backend-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    if (!jobId || jobId === "undefined" || jobId === "null") {
      return NextResponse.json({ error: "Invalid or missing job ID" }, { status: 400 });
    }
    const cookie = request.headers.get("cookie");
    const user = await getBackendSession(cookie);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobStatus = await serverBackendFetch<{
      id: string;
      status: string;
      progress: number;
      errorMessage?: string | null;
      modelId: string | null;
      outputUrl?: string;
      previewUrl?: string | null;
      createdAt: string | null;
      updatedAt: string | null;
    }>(`/api/models/jobs/${jobId}`, { method: "GET" }, cookie);

    return NextResponse.json(jobStatus);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get job status";
    const isNotFound = message.toLowerCase().includes("job not found") || message.toLowerCase().includes("not found");
    console.error("Error in jobs API route:", error);
    return NextResponse.json(
      { error: message },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
