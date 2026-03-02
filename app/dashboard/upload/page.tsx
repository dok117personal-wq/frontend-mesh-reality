"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useMultiImageDropzone } from "@/hooks/use-multi-image-dropzone";
import { Dropzone } from "@/components/upload/dropzone";
import { ImagePreviewGrid } from "@/components/upload/image-preview-grid";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result.split(",")[1];
        resolve(base64 ?? "");
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error);
  });
}

export default function UploadPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preparedCount, setPreparedCount] = useState(0);

  const {
    files,
    removeFile,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useMultiImageDropzone({
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 100
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    if (files.length < 3) {
      toast.error("Photogrammetry needs at least 3 photos from different angles. Add more photos.");
      return;
    }

    const modelTitle = title.trim() || `Model ${new Date().toLocaleDateString()}`;

    try {
      setLoading(true);
      setPreparedCount(0);
      const base64Images: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const base64 = await fileToBase64(files[i]);
        base64Images.push(base64);
        setPreparedCount(i + 1);
      }
      const res = await fetch("/api/generate-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: base64Images,
          title: modelTitle,
          description: description.trim() || undefined,
          priority: 5,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Upload failed: ${res.status}`);
      }
      const data = await res.json();
      if (!data?.jobId) {
        console.error("Generate response missing jobId:", data);
        toast.error("Server did not return a job ID. Please try again.");
        return;
      }
      toast.success("Upload started. Building 3D model…");
      router.push(`/preview/${data.jobId}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Generate 3D Model</h1>
          <p className="text-muted-foreground mt-2">
            Upload 3+ photos from different angles, then click Generate 3D Model to build your model
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            <div className="grid gap-8">
              {/* Model Details Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Model Details</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title (optional)</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                      placeholder="Optional: e.g. My 3D Model"
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                      placeholder="Enter a description for your model"
                      disabled={loading}
                      rows={4}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
                <Dropzone
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  isDragActive={isDragActive}
                  isDragAccept={isDragAccept}
                  isDragReject={isDragReject}
                  fileCount={files.length}
                  className={loading ? "opacity-50 cursor-not-allowed" : ""}
                />
                
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Supported formats: JPG, JPEG, PNG, HEIF, HEIC, WebP, GIF, PPM. At least 3 photos (20+ recommended) from different angles.</p>
                  <p>Maximum file size: 100MB per image</p>
                </div>
              </div>

              {/* Image Preview Grid */}
              {files.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Selected Images ({files.length})</h3>
                    <div className="text-sm text-muted-foreground">
                      {files.length < 30 ? (
                        <span className="text-amber-500">
                          For best results, upload at least 30 images
                        </span>
                      ) : (
                        <span className="text-green-500">
                          ✓ Good number of images
                        </span>
                      )}
                    </div>
                  </div>
                  <ImagePreviewGrid 
                    images={files} 
                    onRemove={loading ? undefined : removeFile} 
                  />
                </div>
              )}

              {/* Generate 3D Model Button */}
              <div className="mt-4 space-y-2">
                <Button 
                  type="submit" 
                  disabled={loading || files.length < 3}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Building 3D model…
                    </>
                  ) : (
                    'Generate 3D Model'
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {files.length < 3
                    ? 'Add at least 3 photos to enable generation.'
                    : 'Your photos will be uploaded and we’ll build your 3D model. You’ll be taken to the preview page.'}
                </p>
                {loading && files.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Preparing images to send… {preparedCount}/{files.length}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
