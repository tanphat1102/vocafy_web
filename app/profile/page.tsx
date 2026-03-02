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
  Sparkles,
  QrCode,
  RefreshCw,
  Copy,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CloudinaryUpload } from "@/components/ui/cloudinary-upload";
import { toast } from "react-toastify";
import {
  userService,
  subscriptionService,
  premiumPackageService,
  type User as UserType,
  type Subscription,
  type PremiumPackage,
  type PaymentUrlResponse,
} from "@/services";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface ParsedPaymentInfo {
  bank: string;
  accountNumber: string;
  amount: string;
  transferContent: string;
}

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
  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null,
  );
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentUrlResponse | null>(
    null,
  );
  const [paymentError, setPaymentError] = useState("");
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [isCheckingTransaction, setIsCheckingTransaction] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((authUser) => {
      if (!authUser) {
        router.push("/login");
        return;
      }
      fetchUserProfile();
      fetchPaymentPackages();
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

  const fetchPaymentPackages = async () => {
    try {
      setPackagesLoading(true);
      setPaymentError("");

      const response = await premiumPackageService
        .listActivePackages({ page: 0, size: 10 })
        .catch(() => premiumPackageService.list({ page: 0, size: 10 }));

      if (!response.success) return;

      const nextPackages = response.result.content.filter((pkg) => pkg.active);
      setPackages(nextPackages);
      setSelectedPackageId((previousId) => {
        if (previousId && nextPackages.some((pkg) => pkg.id === previousId)) {
          return previousId;
        }
        return nextPackages[0]?.id ?? null;
      });
    } catch (error) {
      console.error("Failed to fetch payment packages:", error);
      setPaymentError("Cannot load upgrade packages right now.");
    } finally {
      setPackagesLoading(false);
    }
  };

  const parsePaymentUrlInfo = (
    payment: PaymentUrlResponse | null,
  ): ParsedPaymentInfo | null => {
    if (!payment?.url) return null;

    try {
      const qrUrl = new URL(payment.url);
      return {
        bank: qrUrl.searchParams.get("bank") || "",
        accountNumber: qrUrl.searchParams.get("acc") || "",
        amount:
          qrUrl.searchParams.get("amount") ||
          String(payment.amount ? Number(payment.amount) : ""),
        transferContent:
          qrUrl.searchParams.get("des") || payment.ref1 || "",
      };
    } catch {
      return {
        bank: "",
        accountNumber: "",
        amount: String(payment.amount ? Number(payment.amount) : ""),
        transferContent: payment.ref1 || "",
      };
    }
  };

  const handleCreatePayment = async () => {
    if (!selectedPackageId) {
      setPaymentError("Please select a package before payment.");
      return;
    }

    try {
      setIsGeneratingPayment(true);
      setPaymentError("");
      const response = await premiumPackageService.generatePaymentUrl(
        selectedPackageId,
      );

      if (response.success && response.result?.url) {
        setPaymentDetails(response.result);
        setPaymentDialogOpen(true);
        return;
      }

      setPaymentError(response.message || "Could not generate payment QR.");
    } catch (error) {
      console.error("Failed to create payment:", error);
      setPaymentError("Could not generate payment QR. Please try again.");
    } finally {
      setIsGeneratingPayment(false);
    }
  };

  const handleCopy = async (value: string, field: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleCheckTransaction = async () => {
    if (!paymentDetails) return;

    try {
      setIsCheckingTransaction(true);
      setPaymentError("");
      const response = await premiumPackageService.checkTransaction();

      if (premiumPackageService.isTransactionSuccessful(response)) {
        toast.success("Payment successful. The page will reload shortly.", {
          autoClose: 1800,
          onClose: () => window.location.reload(),
        });
        return;
      }

      if (premiumPackageService.isTransactionPending(response)) {
        const pendingMessage =
          response.message ||
          "Transaction is being processed. Please check again shortly.";
        setPaymentError(pendingMessage);
        toast.info(pendingMessage);
        return;
      }

      setPaymentError(
        response.message ||
          "Transaction is not successful yet. Please verify and try again.",
      );
    } catch (error) {
      console.error("Failed to check transaction:", error);
      setPaymentError("Cannot verify transaction right now. Please try again.");
    } finally {
      setIsCheckingTransaction(false);
    }
  };

  const paymentInfo = parsePaymentUrlInfo(paymentDetails);

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

          {/* Upgrade / Payment */}
          <Card className="relative overflow-hidden border-primary/30 bg-linear-to-br from-primary/10 via-background to-cyan-500/10 shadow-xl">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Get Plus
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Upgrade your account and pay by QR in seconds.
              </p>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {packagesLoading ? (
                  <>
                    <div className="h-24 animate-pulse rounded-xl bg-muted" />
                    <div className="h-24 animate-pulse rounded-xl bg-muted" />
                  </>
                ) : packages.length > 0 ? (
                  packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border bg-background/80 hover:border-primary/50 hover:-translate-y-0.5"
                        }`}
                        type="button"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <p className="font-semibold text-foreground">{pkg.name}</p>
                          {isSelected && (
                            <Badge className="bg-primary text-primary-foreground">
                              Selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pkg.description || "Premium package"}
                        </p>
                        <p className="mt-3 text-lg font-bold text-foreground">
                          {Math.round(pkg.price).toLocaleString("en-US")} VND
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Valid for {pkg.duration_days} days
                        </p>
                      </button>
                    );
                  })
                ) : (
                  <div className="sm:col-span-2 rounded-xl border border-amber-300/40 bg-amber-50/60 p-4 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    There are currently no payment packages. Please contact
                    support for assistance.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleCreatePayment}
                  className="gap-2 bg-linear-to-r from-primary to-cyan-500 px-6 text-white shadow-lg transition-transform hover:scale-[1.02]"
                  disabled={
                    packagesLoading || !selectedPackageId || isGeneratingPayment
                  }
                >
                  <QrCode className="h-4 w-4" />
                  {isGeneratingPayment ? "Generating QR..." : "Get Plus"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  After generating QR, transfer with exact amount and content.
                </p>
              </div>

              {paymentError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {paymentError}
                </p>
              )}
            </CardContent>
          </Card>

          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl">
              <div className="grid gap-0 md:grid-cols-[320px_1fr]">
                <div className="bg-linear-to-b from-primary/15 via-background to-cyan-500/10 p-6">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <QrCode className="h-4 w-4" />
                    QR Payment
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-xl">
                    {paymentDetails?.url ? (
                      <Image
                        src={paymentDetails.url}
                        alt="Payment QR code"
                        width={320}
                        height={320}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                        No QR available
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => {
                      if (paymentDetails?.url) {
                        window.open(
                          paymentDetails.url,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }
                    }}
                  >
                    Open QR in new tab
                  </Button>
                </div>

                <div className="space-y-5 p-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Payment instructions
                    </DialogTitle>
                    <DialogDescription>
                      Use the exact details below so the system can verify your
                      payment.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-3">
                    <div className="rounded-lg border border-border bg-background p-3">
                      <Label>Bank</Label>
                      <p className="mt-1 font-semibold text-foreground">
                        {paymentInfo?.bank || "TPBANK"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Label>Account number</Label>
                          <p className="mt-1 font-semibold text-foreground">
                            {paymentInfo?.accountNumber || "07701221901"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            handleCopy(
                              paymentInfo?.accountNumber || "07701221901",
                              "account",
                            )
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copiedField === "account" ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Label>Amount (VND)</Label>
                          <p className="mt-1 font-semibold text-foreground">
                            {Number(
                              paymentInfo?.amount || paymentDetails?.amount || 0,
                            ).toLocaleString("en-US")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            handleCopy(
                              String(
                                paymentInfo?.amount || paymentDetails?.amount || 0,
                              ),
                              "amount",
                            )
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copiedField === "amount" ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Label>Transfer content</Label>
                          <p className="mt-1 font-semibold text-foreground">
                            {paymentInfo?.transferContent || paymentDetails?.ref1}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            handleCopy(
                              paymentInfo?.transferContent ||
                                paymentDetails?.ref1 ||
                                "",
                              "content",
                            )
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                          {copiedField === "content" ? "Copied" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-300/40 bg-amber-50/70 p-4 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                    <p className="mb-2 font-semibold">Important notes:</p>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Please transfer the exact displayed amount.</li>
                      <li>Please use the exact transfer content for matching.</li>
                      <li>
                        After transferring, click &#34;Check transaction&#34;.
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={handleCheckTransaction}
                      disabled={isCheckingTransaction}
                      className="gap-2"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${isCheckingTransaction ? "animate-spin" : ""}`}
                      />
                      {isCheckingTransaction
                        ? "Checking..."
                        : "Check transaction"}
                    </Button>
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Ref: {paymentDetails?.ref1 || "N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
