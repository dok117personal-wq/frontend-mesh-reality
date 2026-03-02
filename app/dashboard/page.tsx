"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Box, Upload, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Model, getUserModels } from "@/lib/services/model-service";
import { toast } from "sonner";

export default function DashboardPage() {
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
      setError("Failed to load models");
      toast.error("Failed to load models. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-bold">Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!</h1>
            <p className="text-muted-foreground mt-2">Loading your dashboard...</p>
          </div>
          <div className="flex items-center justify-center min-h-[200px]">
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
          <div>
            <h1 className="text-4xl font-bold">Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!</h1>
            <p className="text-muted-foreground mt-2">
              There was an error loading your dashboard
            </p>
          </div>
          <Card className="p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadModels}>Try Again</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}!</h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s an overview of your 3D models and recent activity
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-sky-100 dark:bg-sky-900 rounded-lg">
                  <Box className="w-8 h-8 text-sky-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{models.length}</h2>
                  <p className="text-muted-foreground">Total Models</p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/models")}
                variant="outline"
              >
                View All Models
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-violet-100 dark:bg-violet-900 rounded-lg">
                  <Upload className="w-8 h-8 text-violet-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Upload</h2>
                  <p className="text-muted-foreground">Add a new model</p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/upload")}
                variant="outline"
              >
                Upload Model
              </Button>
            </div>
          </Card>

          {/* Always show user card, with fallback for phone-only users */}
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Profile"}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {user?.displayName || user?.phoneNumber?.replace('+1', '') || 'User'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || user?.phoneNumber?.replace('+1', '')}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/dashboard/settings")}
                variant="outline"
              >
                Manage Account
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {models.length > 0 ? (
              <div className="space-y-4">
                {models.slice(0, 5).map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                        {model.previewUrl ? (
                          <img
                            src={model.previewUrl}
                            alt={model.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Box className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{model.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {model.status} • {new Date(model.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/models")}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No recent activity to show
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
