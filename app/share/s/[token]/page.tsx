"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getModelByShareToken, downloadByShareToken, Model, SUPPORTED_EXPORT_FORMATS, safeUpper } from "@/lib/services/model-service";
import ModelViewer from "@/components/tools/shared/model-viewer";
import { Download, Loader2, Box, ArrowLeft, Lock } from "lucide-react";

export default function ShareRestrictedPage() {
  const params = useParams();
  const token = params?.token as string;
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getModelByShareToken(token);
        if (!cancelled) setModel(data);
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Failed to load model";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleDownload = async (format: string) => {
    if (!token) return;
    try {
      setDownloading(format);
      const blob = await downloadByShareToken(token, format);
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
    const needsSignIn = error?.toLowerCase().includes("unauthorized") || error?.toLowerCase().includes("token");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-background">
        <Card className="p-8 max-w-md text-center">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-semibold mb-2">
            {needsSignIn ? "Sign in to view this model" : "Cannot view this model"}
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            {needsSignIn
              ? "This link was shared with you. Sign in with the account it was shared with to view the model."
              : error || "This link is invalid or was not shared with you."}
          </p>
          <div className="flex flex-col gap-2">
            {needsSignIn && (
              <Button asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </div>
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
        <span className="text-xs text-muted-foreground">Shared with you</span>
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
              const code = typeof fmt === "string" ? fmt : String((fmt as { code?: unknown })?.code ?? "");
              const available = hasFormat(code);
              const label = safeUpper(code || fmt);
              return (
                <Button
                  key={code || String(fmt)}
                  variant="outline"
                  size="sm"
                  onClick={() => available && handleDownload(code)}
                  disabled={downloading !== null || !available}
                  title={available ? `Download ${label}` : "Not generated for this model"}
                >
                  {downloading === code ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {label}
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
