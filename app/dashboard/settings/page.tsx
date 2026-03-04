"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  Bell,
  Moon,
  LogOut,
  Trash2,
  User,
  Shield,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const getUserDisplayInfo = () => {
    return {
      name: user?.displayName || user?.email || 'User',
      subtitle: user?.email ?? '',
      photoUrl: user?.photoUrl
    };
  };

  const userInfo = getUserDisplayInfo();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // TODO: Implement account deletion
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.error("Account deletion not implemented yet");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Section */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>
            <div className="flex items-center gap-4">
              {userInfo.photoUrl ? (
                <img
                  src={userInfo.photoUrl}
                  alt={userInfo.name}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
              )}
              <div>
                <p className="font-medium">{userInfo.name}</p>
                <p className="text-sm text-muted-foreground">{userInfo.subtitle}</p>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Bell className="w-6 h-6 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold">Preferences</h2>
            </div>
            <div className="space-y-6">
              {user?.email && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your models
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="w-6 h-6 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold">Security</h2>
            </div>
            <div className="space-y-6">
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
              <div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
