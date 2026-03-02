import { NextRequest, NextResponse } from 'next/server';
import { getBackendSession, serverBackendFetch } from "@/lib/backend-server";
import type { CreateModelGenerationJobParams } from '@/lib/services/model-service';

/** GET is not supported; only POST from the dashboard upload or photogrammetry page reaches backend → Swift. */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with images to generate a 3D model (e.g. from Dashboard Upload or Photogrammetry).' },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie");
    const user = await getBackendSession(cookie);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    let generationType: 'text' | 'image' | 'images';
    if (body.text) {
      generationType = 'text';
    } else if (body.images && Array.isArray(body.images)) {
      generationType = 'images';
    } else {
      generationType = 'image';
    }

    const params: CreateModelGenerationJobParams = {
      title: body.title,
      description: body.description,
      generationType,
      textPrompt: body.text,
      imageData: body.image,
      imageDataArray: body.images,
      options: {
        texture: body.texture || false,
        priority: body.priority || 5,
      }
    };

    // Backend may wait on Swift for several minutes; allow 15 min so the workflow completes
    const GENERATE_TIMEOUT_MS = 15 * 60 * 1000;
    const jobData = await serverBackendFetch<{ jobId: string; status: string; modelId?: string }>(
      "/api/models/generate",
      { method: "POST", body: params },
      cookie,
      GENERATE_TIMEOUT_MS
    );

    return NextResponse.json({
      jobId: jobData.jobId,
      status: jobData.status,
      modelId: jobData.modelId ?? "",
    });
  } catch (error) {
    const status = (error as Error & { status?: number }).status;
    let message = error instanceof Error ? error.message : 'Failed to generate model';
    if (status === 401) {
      message = 'Session expired or not set. Please sign in again from the sign-in page, then try generating again.';
    }
    console.error('Error in generate-model API route:', status ?? 500, message, error);
    return NextResponse.json(
      { error: message },
      { status: typeof status === 'number' && status >= 400 && status < 600 ? status : 500 }
    );
  }
}
