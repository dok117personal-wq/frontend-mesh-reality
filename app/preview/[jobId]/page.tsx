import { Metadata } from "next";
import { getJobStatus } from "@/lib/services/upload-service";
import PreviewClient from "./preview-client";

const INVALID_JOB_IDS = ["undefined", "null", ""];

// This is a placeholder function - implement actual data fetching
async function getModelData(jobId: string) {
  if (!jobId || INVALID_JOB_IDS.includes(jobId)) {
    return { name: "Invalid job", description: "Invalid or missing job ID.", previewImageUrl: "/placeholder.svg" };
  }
  try {
    // Try to get job status for metadata
    const status = await getJobStatus(jobId);
    return {
      name: status.title || `Model ${jobId}`,
      description: status.message || "A 3D model created with Mesh Reality",
      previewImageUrl: `/preview-${jobId}.jpg`, // This should be dynamically generated or use a placeholder
    };
  } catch (error) {
    // Fallback data if we can't fetch
    return {
      name: `Model ${jobId}`,
      description: "A 3D model created with Mesh Reality",
      previewImageUrl: `/placeholder.svg`, // Use a placeholder image
    };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ jobId: string }> }): Promise<Metadata> {
  const { jobId } = await params;
  const modelData = await getModelData(jobId);
  
  return {
    title: `${modelData.name} - 3D Model Preview`,
    description: `View the ${modelData.name} 3D model created with Mesh Reality's AI technology. ${modelData.description}`,
    openGraph: {
      title: `${modelData.name} - 3D Model by Mesh Reality`,
      description: modelData.description,
      images: [{ url: modelData.previewImageUrl }],
    },
    robots: {
      index: false,
      follow: false,
    }
  };
}

export default async function PreviewPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return <PreviewClient jobId={jobId} />;
}
