"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  LogOut,
  Activity,
  Clock,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import {
  userService,
  subscriptionService,
  type User as UserType,
  type Subscription,
} from "@/services";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    avatar_url: "",
    locale: "",
    timezone: "",
  });

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((authUser) => {
      if (!authUser) {
        router.push("/login");
        return;
      }
      fetchUserProfile();
    });

    return unsubscribe;
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const [profileResponse, subscriptionData] = await Promise.all([
        userService.getProfile(),
        subscriptionService.getMySubscription().catch(() => null),
      ]);

      if (profileResponse.success) {
        setUser(profileResponse.result);
        setFormData({
          display_name: profileResponse.result.profile?.display_name || "",
          avatar_url: profileResponse.result.profile?.avatar_url || "",
          locale: profileResponse.result.profile?.locale || "",
          timezone: profileResponse.result.profile?.timezone || "",
        });
      }

      if (subscriptionData) {
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const response = await userService.updateProfile({
        display_name: formData.display_name || undefined,
        avatar_url: formData.avatar_url || undefined,
        locale: formData.locale || undefined,
        timezone: formData.timezone || undefined,
      });

      if (response.success) {
        setUser(response.result);
        setEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-32 rounded-lg bg-muted"></div>
            <div className="h-10 rounded bg-muted"></div>
            <div className="h-64 rounded-lg bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="mx-auto max-w-2xl">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Failed to load profile. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">
                View and manage your personal information
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.profile?.avatar_url ? (
                    <div className="relative h-16 w-16">
                      <Image
                        src={user.profile.avatar_url}
                        alt="Profile avatar"
                        width={64}
                        height={64}
                        className="h-full w-full rounded-full object-cover border-2 border-primary/20"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent">
                      <User className="h-8 w-8 text-primary-foreground" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-2xl">
                      {user.profile?.display_name || user.email}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your personal information
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          placeholder="Your name"
                          value={formData.display_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              display_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <CloudinaryUpload
                        currentImage={formData.avatar_url}
                        onUploadSuccess={(url) =>
                          setFormData({
                            ...formData,
                            avatar_url: url,
                          })
                        }
                        onUploadError={(error) => {
                          console.error("Upload error:", error);
                          // You can add toast notification here
                        }}
                      />
                      <div className="space-y-2">
                        <Label htmlFor="locale">Language</Label>
                        <Input
                          id="locale"
                          placeholder="en, vi, etc."
                          value={formData.locale}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              locale: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                          id="timezone"
                          placeholder="UTC, Asia/Ho_Chi_Minh, etc."
                          value={formData.timezone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              timezone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        className="w-full gap-2"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>

          {/* Subscription Information */}
          {subscription && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Subscription Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Plan
                    </p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          subscription.plan === "FREE" ? "outline" : "default"
                        }
                        className={
                          subscription.plan === "PREMIUM"
                            ? "bg-linear-to-r from-amber-500 to-orange-500"
                            : subscription.plan === "PREMIUM_PLUS"
                              ? "bg-linear-to-r from-purple-500 to-pink-500"
                              : ""
                        }
                      >
                        {subscription.plan}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Valid Until
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">
                        {new Date(subscription.end_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">
                        {new Date(subscription.start_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">
                        {new Date(subscription.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">{user.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Role
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "default"
                          : user.role === "MANAGER"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Status
                  </p>
                  <div className="mt-1">
                    <Badge
                      variant={
                        user.status === "ACTIVE"
                          ? "default"
                          : user.status === "INACTIVE"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Created
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Display Name
                  </p>
                  <p className="mt-1 text-foreground">
                    {user.profile?.display_name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Language
                  </p>
                  <p className="mt-1 text-foreground">
                    {user.profile?.locale || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Timezone
                  </p>
                  <p className="mt-1 text-foreground">
                    {user.profile?.timezone || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Active
                  </p>
                  <p className="mt-1 text-foreground">
                    {user.last_active_at
                      ? new Date(user.last_active_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Login
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-foreground">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString() +
                          " " +
                          new Date(user.last_login_at).toLocaleTimeString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
