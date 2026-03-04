"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Loader2, X, Link2, UserPlus } from "lucide-react";
import { shareModel, type ShareResult } from "@/lib/services/model-service";
import { toast } from "sonner";

type ShareType = "public" | "restricted";

export function ShareDialog({
  modelId,
  modelTitle,
  open,
  onClose,
}: {
  modelId: string;
  modelTitle: string;
  open: boolean;
  onClose: () => void;
}) {
  const [shareType, setShareType] = useState<ShareType>("public");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShareResult | null>(null);

  const handleAddEmail = () => {
    const e = emailInput.trim().toLowerCase();
    if (!e) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error("Enter a valid email");
      return;
    }
    if (emails.includes(e)) return;
    setEmails([...emails, e]);
    setEmailInput("");
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((x) => x !== email));
  };

  const handleCreateLinks = async () => {
    if (shareType === "restricted" && emails.length === 0) {
      toast.error("Add at least one email for restricted sharing");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await shareModel(modelId, {
        type: shareType,
        emails: shareType === "restricted" ? emails : undefined,
      });
      setResult(res);
      if (res.isPublic && res.shareUrl) {
        try {
          await navigator.clipboard.writeText(res.shareUrl);
          toast.success("Public link copied to clipboard");
        } catch {
          toast.success("Public link created");
        }
      } else if (!res.isPublic && res.shareUrls?.length) {
        toast.success(`Created ${res.shareUrls.length} link(s) for the people you added`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create share links");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <Card
        className="w-full max-w-md p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share &quot;{modelTitle || "Model"}&quot;
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Who can access?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shareType"
                  checked={shareType === "public"}
                  onChange={() => { setShareType("public"); setResult(null); }}
                  className="rounded-full"
                />
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Anyone with the link</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shareType"
                  checked={shareType === "restricted"}
                  onChange={() => { setShareType("restricted"); setResult(null); }}
                  className="rounded-full"
                />
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Only people you add</span>
              </label>
            </div>
          </div>

          {shareType === "restricted" && (
            <div className="space-y-2">
              <Label className="text-sm">Add people by email</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddEmail())}
                />
                <Button type="button" variant="secondary" onClick={handleAddEmail}>
                  Add
                </Button>
              </div>
              {emails.length > 0 && (
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  {emails.map((e) => (
                    <li key={e} className="flex items-center justify-between gap-2">
                      <span>{e}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveEmail(e)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleCreateLinks}
            disabled={loading || (shareType === "restricted" && emails.length === 0)}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : shareType === "public" ? (
              "Get link"
            ) : (
              "Create links for added people"
            )}
          </Button>

          {result && (
            <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
              {result.isPublic && result.shareUrl && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm truncate flex-1">{result.shareUrl}</span>
                  <Button size="sm" variant="outline" onClick={() => copyUrl(result.shareUrl!)}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
              {!result.isPublic && result.shareUrls?.map(({ email, shareUrl }) => (
                <div key={email} className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">{email}</span>
                  <div className="flex items-center gap-2">
                    <Input readOnly value={shareUrl} className="font-mono text-xs" />
                    <Button size="sm" variant="outline" onClick={() => copyUrl(shareUrl)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
