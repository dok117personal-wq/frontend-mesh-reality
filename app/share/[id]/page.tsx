"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublicModel, downloadPublicModel, Model, SUPPORTED_EXPORT_FORMATS } from "@/lib/services/model-service";
import ModelViewer from "@/components/tools/shared/model-viewer";
import { Download, Loader2, Box, ArrowLeft } from "lucide-react";

export default function ShareModelPage() {
  const params = useParams();
  const id = params?.id as string;
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicModel(id);
        if (!cancelled) setModel(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load model");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDownload = async (format: string) => {
    if (!id) return;
    try {
      setDownloading(format);
      const blob = await downloadPublicModel(id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${model?.title || "model"}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setDownloading(null);
    }
  };

  const availableFormats = model?.outputUrls
    ? Object.keys(model.outputUrls).filter((k) => typeof model.outputUrls![k] === "string")
    : [];
  const hasFormat = (fmt: string) => availableFormats.includes(fmt);
  const glbUrl = model?.outputUrls?.glb as string | undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-background">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">Model not found</h1>
          <p className="text-muted-foreground text-sm mb-4">
            {error || "This model is not shared or the link is invalid."}
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-4 py-3 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Mesh Reality
          </Link>
        </Button>
      </header>
      <main className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{model.title || "Shared model"}</h1>
          {model.description && (
            <p className="text-muted-foreground mt-1">{model.description}</p>
          )}
        </div>

        <Card className="overflow-hidden mb-6">
          <div className="aspect-square bg-muted relative min-h-[280px]">
            {glbUrl ? (
              <ModelViewer modelUrl={glbUrl} className="w-full h-full absolute inset-0" />
            ) : model.previewUrl ? (
              <img
                src={model.previewUrl}
                alt={model.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Box className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-3">Download</h2>
          <p className="text-sm text-muted-foreground mb-4">
            All supported formats. Download any format that has been generated for this model.
          </p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_EXPORT_FORMATS.map((fmt) => {
              const available = hasFormat(fmt);
              return (
                <Button
                  key={fmt}
                  variant="outline"
                  size="sm"
                  onClick={() => available && handleDownload(fmt)}
                  disabled={downloading !== null || !available}
                  title={available ? `Download ${fmt.toUpperCase()}` : "Not generated for this model"}
                >
                  {downloading === fmt ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {fmt.toUpperCase()}
                  {!available && (
                    <span className="ml-1 text-xs text-muted-foreground">(n/a)</span>
                  )}
                </Button>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
