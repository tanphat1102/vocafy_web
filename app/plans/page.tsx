"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, LogIn, QrCode, RefreshCw, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { toast } from "sonner";
import {
  premiumPackageService,
  type PaymentUrlResponse,
  type PremiumPackage,
} from "@/services/premiumPackageService";
import { authService } from "@/services/authService";
import {
  subscriptionService,
  type Subscription,
} from "@/services/subscriptionService";
import type { ApiError } from "@/services";
import Image from "next/image";

const DEFAULT_FEATURES = [
  "All languages, always",
  "Lessons to get you speaking",
  "Targeted Word Lists to fit your goals",
  "Extra Word Lists",
  "Ad free",
  "All native speaker videos",
  "Unlimited pronunciation practice",
  "Unlimited sentence building practice",
  "Unlimited AI conversations",
  "Grammar lessons",
  "Verb conjugation drills",
  "Extra role-play sessions",
  "Cultural & language tips",
];

interface ParsedPaymentInfo {
  bank: string;
  accountNumber: string;
  amount: string;
  transferContent: string;
}

export default function PlansPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<
    "monthly" | "annual" | "lifetime"
  >("monthly");
  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PremiumPackage | null>(
    null,
  );
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentUrlResponse | null>(null);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [isCheckingTransaction, setIsCheckingTransaction] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await premiumPackageService
          .listActivePackages({ size: 100 })
          .catch(() => premiumPackageService.list({ size: 100 }));
        if (response.success && response.result.content) {
          setPackages(response.result.content);
        }

        // Fetch user subscription if logged in
        if (authService.getAccessToken()) {
          try {
            const subscriptionData =
              await subscriptionService.getMySubscription();
            setSubscription(subscriptionData);
          } catch {
            // User might not have a subscription yet
            console.log("No subscription found");
          }
        }
      } catch (error) {
        console.error("Failed to fetch premium packages:", error);
        toast.error("Failed to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        transferContent: qrUrl.searchParams.get("des") || payment.ref1 || "",
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

  const handleSubscribe = async (pkg: PremiumPackage) => {
    setSelectedPackage(pkg);

    if (!authService.getAccessToken()) {
      setLoginDialogOpen(true);
      return;
    }

    try {
      setIsGeneratingPayment(true);
      const response = await premiumPackageService.generatePaymentUrl(pkg.id);

      if (response.success && response.result?.url) {
        setPaymentDetails(response.result);
        setPaymentDialogOpen(true);
        return;
      }

      const message = response.message || "Could not generate payment QR.";
      toast.error(message);
    } catch (error) {
      console.error("Failed to generate payment URL:", error);
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setLoginDialogOpen(true);
        return;
      }

      const errorMessage =
        apiError.message || "Could not generate payment QR. Please try again.";
      toast.error(errorMessage);
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
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Copy failed");
    }
  };

  const handleCheckTransaction = async () => {
    if (!paymentDetails) return;

    try {
      setIsCheckingTransaction(true);
      const response = await premiumPackageService.checkTransaction();

      const isSuccessful =
        premiumPackageService.isTransactionSuccessful(response);

      if (isSuccessful) {
        toast.success(
          "Subscription activated successfully. The page will reload shortly.",
        );
        setTimeout(() => {
          window.location.reload();
        }, 1800);
        return;
      }

      if (premiumPackageService.isTransactionPending(response)) {
        const pendingMessage =
          response.message ||
          "Transaction is being processed. Please check again shortly.";
        toast.warning(pendingMessage);
        return;
      }

      const message =
        response.message ||
        "Transaction is not successful yet. Please verify and try again.";
      toast.error(message);
    } catch (error) {
      console.error("Failed to check transaction:", error);
      toast.error("Cannot verify transaction now. Please try again.");
    } finally {
      setIsCheckingTransaction(false);
    }
  };

  const paymentInfo = parsePaymentUrlInfo(paymentDetails);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Learn without limits
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
              Join 370,000 learners committed to PRO
            </p>

            {/* Billing Toggle */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-all ${
                  billingPeriod === "annual"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Annual
              </button>
              <button
                onClick={() => setBillingPeriod("lifetime")}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-all ${
                  billingPeriod === "lifetime"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Lifetime
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {/* Free Plan */}
            <Card className="border-2 border-border bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Free</CardTitle>
                <CardDescription>Get started with the basics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">
                    Free
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Forever free
                  </p>
                </div>

                <Button className="w-full" variant="outline">
                  Get Started
                </Button>

                <div className="space-y-2 sm:space-y-3">
                  {DEFAULT_FEATURES.slice(0, 3).map((feature, index) => (
                    <div
                      key={index}
                      className="flex gap-2 sm:gap-3 items-start"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pro Plans from API */}
            {loading ? (
              <Card className="border-2 border-border bg-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Loading pricing plans...
                  </p>
                </CardContent>
              </Card>
            ) : packages.length > 0 ? (
              packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`border-2 overflow-hidden transition-all ${
                    pkg.active
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                      : "border-border bg-card"
                  }`}
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
                      <div>
                        <CardTitle className="text-xl sm:text-2xl">
                          {pkg.name}
                        </CardTitle>
                        <CardDescription>
                          {pkg.description || "Premium features"}
                        </CardDescription>
                      </div>
                      {pkg.active && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <p className="text-3xl sm:text-4xl font-bold text-foreground">
                        {billingPeriod === "monthly" && (
                          <>
                            ₫{Math.round(pkg.price).toLocaleString()}
                            <span className="text-lg text-muted-foreground">
                              /month
                            </span>
                          </>
                        )}
                        {billingPeriod === "annual" && (
                          <>
                            ₫{Math.round(pkg.price * 12 * 0.7).toLocaleString()}
                            <span className="text-lg text-muted-foreground">
                              /year
                            </span>
                          </>
                        )}
                        {billingPeriod === "lifetime" && (
                          <>
                            ₫
                            {Math.round(
                              ((pkg.price * 365) / 30) * 0.6,
                            ).toLocaleString()}
                          </>
                        )}
                      </p>
                      {billingPeriod === "annual" && (
                        <div className="mt-2">
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            30% off 1st year
                          </Badge>
                        </div>
                      )}
                      {billingPeriod === "lifetime" && (
                        <div className="mt-2">
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            40% off price
                          </Badge>
                        </div>
                      )}
                    </div>

                    {subscription && subscription.plan !== "FREE" ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled
                      >
                        Already Subscribed
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => handleSubscribe(pkg)}
                        disabled={
                          isGeneratingPayment && selectedPackage?.id === pkg.id
                        }
                      >
                        {isGeneratingPayment && selectedPackage?.id === pkg.id
                          ? "Generating QR..."
                          : "Get Subscription"}
                      </Button>
                    )}

                    <div className="space-y-2 sm:space-y-3">
                      {DEFAULT_FEATURES.map((feature, index) => (
                        <div
                          key={index}
                          className="flex gap-2 sm:gap-3 items-start"
                        >
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-2 border-border bg-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No premium packages available at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Features Comparison Table */}
          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <CardTitle>Features Comparison</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">
                      Free
                    </th>
                    {packages.map((pkg) => (
                      <th
                        key={pkg.id}
                        className="text-center py-3 px-4 font-semibold text-primary"
                      >
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEFAULT_FEATURES.map((feature, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-3 px-4 text-sm text-foreground">
                        {feature}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {index < 3 && (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        )}
                      </td>
                      {packages.map((pkg) => (
                        <td
                          key={`${pkg.id}-${index}`}
                          className="py-3 px-4 text-center"
                        >
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <p className="text-center text-sm text-muted-foreground mt-12">
            *PRO features are available in most supported languages.
          </p>

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
                      <div className="flex h-65 items-center justify-center text-sm text-muted-foreground">
                        No QR available
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Subscription Payment
                    </DialogTitle>
                    <DialogDescription>
                      Please transfer with exact amount and content below.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-3">
                    <div className="rounded-lg border border-border bg-background p-3">
                      <Label>Package</Label>
                      <p className="mt-1 font-semibold text-foreground">
                        {selectedPackage?.name || "Premium"}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background p-3">
                      <Label>Bank</Label>
                      <p className="mt-1 font-semibold text-foreground">
                        {paymentInfo?.bank || "TPBANK"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Label>Account Number</Label>
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
                              paymentInfo?.amount ||
                                paymentDetails?.amount ||
                                0,
                            ).toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            handleCopy(
                              String(
                                paymentInfo?.amount ||
                                  paymentDetails?.amount ||
                                  0,
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
                          <Label>Transfer Content</Label>
                          <p className="mt-1 font-semibold text-foreground">
                            {paymentInfo?.transferContent ||
                              paymentDetails?.ref1}
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
                      <li>Please transfer exact amount.</li>
                      <li>Please use exact transfer content.</li>
                      <li>Click check transaction after payment.</li>
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
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-primary" />
                  Sign in required
                </DialogTitle>
                <DialogDescription>
                  You need to sign in before creating subscription payment.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setLoginDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setLoginDialogOpen(false);
                    router.push("/login?redirect=/plans");
                  }}
                >
                  Go to Login
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
