"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, MoreVertical, Download, Share2, Trash2, Loader2, UserMinus, CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
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
import {
  Model,
  deleteModel,
  dismissSharedModel,
  downloadModel,
  getSupportedFormats,
  getUserModels,
  requestExport,
} from "@/lib/services/model-service";
import { ShareDialog } from "@/components/dashboard/share-dialog";
import { toast } from "sonner";

export default function ModelsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareModelId, setShareModelId] = useState<string | null>(null);
  const [shareModelTitle, setShareModelTitle] = useState<string>("");
  const [formats, setFormats] = useState<string[]>([]);
  const [generatingFormat, setGeneratingFormat] = useState<{ modelId: string; format: string } | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    getSupportedFormats().then(setFormats);
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

  const hasFormat = (model: Model, format: string) => {
    const url = (model.outputUrls ?? {})[format];
    return typeof url === "string";
  };

  const displayFormats = formats.length ? formats : ["usdz", "obj", "stl", "glb"];

  const formatStatus = (model: Model, format: string) => {
    if (hasFormat(model, format)) return "ready" as const;
    if (generatingFormat?.modelId === model.id && generatingFormat?.format === format) return "creating" as const;
    return "not_ready" as const;
  };

  const canCreateFormat = (format: string) => ["obj", "stl"].includes(format.toLowerCase());

  const handleGenerateFormat = async (model: Model, format: string) => {
    setGeneratingFormat({ modelId: model.id, format });
    try {
      await requestExport(model.id, format);
      await loadModels();
      toast.success(`${format.toUpperCase()} ready. You can download it now.`);
    } catch (err) {
      console.error("Export failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to generate format");
    } finally {
      setGeneratingFormat(null);
    }
  };

  const handleShare = (model: Model) => {
    setShareModelId(model.id);
    setShareModelTitle(model.title || "Model");
    setShareOpen(true);
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

  const handleRemoveShared = async (modelId: string) => {
    try {
      await dismissSharedModel(modelId);
      setModels(models.filter((m) => m.id !== modelId));
      toast.success("Removed from your list");
    } catch (err) {
      console.error("Error removing shared model:", err);
      toast.error("Failed to remove");
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
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{model.title}</h3>
                        {model.sharedWithMe && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Shared with you
                          </span>
                        )}
                      </div>
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
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Download className="mr-2 h-4 w-4" />
                            Export / Download
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            {displayFormats.map((fmt) => {
                              const available = hasFormat(model, fmt);
                              const generating = generatingFormat?.modelId === model.id && generatingFormat?.format === fmt;
                              return (
                                <DropdownMenuItem
                                  key={fmt}
                                  onClick={() =>
                                    available
                                      ? handleDownload(model, fmt)
                                      : handleGenerateFormat(model, fmt)
                                  }
                                  disabled={generating}
                                >
                                  {generating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                  )}
                                  {available ? `Download ${fmt.toUpperCase()}` : `Generate ${fmt.toUpperCase()}`}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        {!model.sharedWithMe && (
                          <DropdownMenuItem onClick={() => handleShare(model)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                        )}
                        {model.sharedWithMe ? (
                          <DropdownMenuItem
                            onClick={() => handleRemoveShared(model.id)}
                            className="text-muted-foreground"
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleDelete(model.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                    {/* Format status board: each format with status and action (only when model is ready) */}
                    {model.status === "completed" && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                          Export formats
                        </h4>
                        <div className="space-y-2">
                          {displayFormats.map((fmt) => {
                            const status = formatStatus(model, fmt);
                            const ready = status === "ready";
                            const creating = status === "creating";
                            const notReady = status === "not_ready";
                            const canCreate = canCreateFormat(fmt);
                            return (
                              <div
                                key={fmt}
                                className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-md bg-muted/50"
                              >
                                <span className="text-sm font-medium">{fmt.toUpperCase()}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  {ready && (
                                    <>
                                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Ready
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => handleDownload(model, fmt)}
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </Button>
                                    </>
                                  )}
                                  {creating && (
                                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500">
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      Creating…
                                    </span>
                                  )}
                                  {notReady && (
                                    <>
                                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <CircleDashed className="h-3.5 w-3.5" />
                                        Not ready
                                      </span>
                                      {canCreate ? (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs"
                                          onClick={() => handleGenerateFormat(model, fmt)}
                                        >
                                          <Sparkles className="h-3 w-3 mr-1" />
                                          Create
                                        </Button>
                                      ) : (
                                        <span className="text-xs text-muted-foreground/70">—</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-4">
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

        <ShareDialog
          modelId={shareModelId ?? ""}
          modelTitle={shareModelTitle}
          open={shareOpen}
          onClose={() => { setShareOpen(false); setShareModelId(null); }}
        />
      </div>
    </div>
  );
}
