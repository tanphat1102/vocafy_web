"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import {
  premiumPackageService,
  type PremiumPackage,
} from "@/services/premiumPackageService";

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

export default function PlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<
    "monthly" | "annual" | "lifetime"
  >("monthly");
  const [packages, setPackages] = useState<PremiumPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await premiumPackageService.list({ size: 100 });
        if (response.success && response.result.content) {
          setPackages(response.result.content);
        }
      } catch (error) {
        console.error("Failed to fetch premium packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Learn without limits
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join 370,000 learners committed to PRO
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  billingPeriod === "annual"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                Annual
              </button>
              <button
                onClick={() => setBillingPeriod("lifetime")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
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
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <Card className="border-2 border-border bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Get started with the basics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-4xl font-bold text-foreground">Free</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Forever free
                  </p>
                </div>

                <Button className="w-full" variant="outline">
                  Get Started
                </Button>

                <div className="space-y-3">
                  {DEFAULT_FEATURES.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
                  <CardTitle className="text-2xl">Pro</CardTitle>
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
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-2xl">{pkg.name}</CardTitle>
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
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-4xl font-bold text-foreground">
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

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Subscribe now
                    </Button>

                    <div className="space-y-3">
                      {DEFAULT_FEATURES.map((feature, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
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
                  <CardTitle className="text-2xl">Pro</CardTitle>
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
        </div>
      </div>
    </div>
  );
}
