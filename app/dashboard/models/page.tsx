"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, MoreVertical, Download, Share2, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Model, deleteModel, downloadModel, getUserModels, shareModel } from "@/lib/services/model-service";
import { toast } from "sonner";

export default function ModelsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserModels();
      setModels(data);
    } catch (err) {
      console.error("Error loading models:", err);
      setError("Failed to load models. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (model: Model, format?: string) => {
    try {
      const blob = await downloadModel(model.id, format);
      const ext = format || "usdz";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${model.title || "model"}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Download started (${ext.toUpperCase()})`);
    } catch (err) {
      console.error("Error downloading model:", err);
      toast.error("Failed to download model");
    }
  };

  const availableFormats = (model: Model) => {
    const urls = model.outputUrls ?? {};
    const keys = Object.keys(urls).filter((k) => typeof urls[k] === "string");
    return keys.length ? keys : ["usdz"];
  };

  const handleShare = async (modelId: string) => {
    try {
      const { shareUrl } = await shareModel(modelId);
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
      } catch {
        toast.success("Share link ready", {
          description: shareUrl,
          action: { label: "Copy", onClick: () => navigator.clipboard.writeText(shareUrl) },
        });
      }
    } catch (err) {
      console.error("Error sharing model:", err);
      toast.error("Failed to share model");
    }
  };

  const handleDelete = async (modelId: string) => {
    try {
      await deleteModel(modelId);
      setModels(models.filter(model => model.id !== modelId));
      toast.success("Model deleted successfully");
    } catch (err) {
      console.error("Error deleting model:", err);
      toast.error("Failed to delete model");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">My Models</h1>
              <p className="text-muted-foreground mt-2">Loading your models...</p>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">My Models</h1>
              <p className="text-muted-foreground mt-2">
                View and manage your 3D models
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard/upload")}>
              Upload New Model
            </Button>
          </div>
          <Card className="p-8 text-center">
            <Box className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <h3 className="font-semibold mb-2">Error Loading Models</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadModels}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">My Models</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your 3D models
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/upload")}>
            Upload New Model
          </Button>
        </div>

        {models.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <Card key={model.id} className="overflow-hidden">
                <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
                  {model.previewUrl ? (
                    <img
                      src={model.previewUrl}
                      alt={model.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${model.previewUrl}`);
                        // Replace with placeholder on error
                        e.currentTarget.style.display = 'none';
                        // Show the fallback Box icon
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
                          fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-gray-400" />
                  )}
                  {model.status === "processing" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm">Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold truncate">{model.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {model.fileType.toUpperCase()} • {model.status}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {availableFormats(model).length <= 1 ? (
                          <DropdownMenuItem onClick={() => handleDownload(model, availableFormats(model)[0])}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {availableFormats(model).map((fmt) => (
                                <DropdownMenuItem key={fmt} onClick={() => handleDownload(model, fmt)}>
                                  {fmt.toUpperCase()}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        )}
                        <DropdownMenuItem onClick={() => handleShare(model.id)}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(model.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Uploaded on {new Date(model.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Box className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <h3 className="font-semibold mb-2">No Models Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first 3D model to get started
            </p>
            <Button onClick={() => router.push("/dashboard/upload")}>
              Upload Model
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
