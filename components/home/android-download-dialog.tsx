"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  ExternalLink,
  LoaderCircle,
  Play,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AndroidDownloadOption = {
  id: string;
  label: string;
  description: string;
  href: string;
  buttonLabel: string;
  badge: string;
  download?: boolean;
  external?: boolean;
};

type AndroidDownloadConfig = {
  title: string;
  description: string;
  options: AndroidDownloadOption[];
};

const optionStyles: Record<
  string,
  {
    wrapper: string;
    badge: string;
    icon: typeof ArrowDownToLine;
  }
> = {
  "direct-download": {
    wrapper:
      "border-emerald-200/80 bg-linear-to-br from-emerald-50 via-white to-teal-50 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-slate-950 dark:to-teal-950/40",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200",
    icon: ArrowDownToLine,
  },
  apkpure: {
    wrapper:
      "border-sky-200/80 bg-linear-to-br from-sky-50 via-white to-indigo-50 dark:border-sky-900/60 dark:from-sky-950/40 dark:via-slate-950 dark:to-indigo-950/40",
    badge:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-200",
    icon: ExternalLink,
  },
  "google-play": {
    wrapper:
      "border-violet-200/80 bg-linear-to-br from-violet-50 via-white to-fuchsia-50 dark:border-violet-900/60 dark:from-violet-950/40 dark:via-slate-950 dark:to-fuchsia-950/40",
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-200",
    icon: Play,
  },
};

export function AndroidDownloadDialog() {
  const [config, setConfig] = useState<AndroidDownloadConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      try {
        const response = await fetch("/android-download-config.json");
        if (!response.ok) {
          throw new Error("Failed to load Android download config");
        }

        const data = (await response.json()) as AndroidDownloadConfig;
        if (mounted) {
          setConfig(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  const options = config?.options ?? [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-full bg-gray-900 px-6 text-base text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
          <Smartphone className="mr-2 h-5 w-5" />
          Download for Android
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-hidden border border-purple-200/80 bg-white p-0 shadow-2xl dark:border-purple-900/60 dark:bg-slate-950 sm:max-w-3xl">
        <div className="relative bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/40 dark:via-slate-950 dark:to-rose-950/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.14),transparent_28%)]" />
          <div className="relative space-y-6 p-6 sm:p-8">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {config?.title ?? "Android download"}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {config?.description ??
                      "Choose the download method that works best for you."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-3">
              {isLoading ? (
                <div className="col-span-full flex min-h-48 items-center justify-center rounded-3xl border border-purple-200/70 bg-white/70 dark:border-white/10 dark:bg-white/5">
                  <LoaderCircle className="mr-3 h-5 w-5 animate-spin text-purple-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-200">
                    Loading download options...
                  </span>
                </div>
              ) : (
                options.map((option) => {
                  const style = optionStyles[option.id] ?? optionStyles.apkpure;
                  const Icon = style.icon;
                  const isDisabled = !option.href;

                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "group flex h-full flex-col rounded-3xl border p-5 shadow-lg transition-transform duration-300 hover:-translate-y-1",
                        style.wrapper,
                        isDisabled &&
                          "opacity-80 hover:translate-y-0 dark:opacity-70"
                      )}
                    >
                      <div className="mb-5 flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-slate-900 shadow-sm dark:bg-white/10 dark:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            style.badge
                          )}
                        >
                          {option.badge}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {option.label}
                        </h3>
                        <p className="min-h-16 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {option.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-5">
                        {isDisabled ? (
                          <Button
                            disabled
                            className="h-11 w-full rounded-2xl bg-slate-300 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            {option.buttonLabel}
                          </Button>
                        ) : (
                          <Button
                            asChild
                            className="h-11 w-full rounded-2xl bg-linear-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600"
                          >
                            <a
                              href={option.href}
                              {...(option.download ? { download: true } : {})}
                              {...(option.external
                                ? {
                                    target: "_blank",
                                    rel: "noreferrer",
                                  }
                                : {})}
                            >
                              {option.buttonLabel}
                              {option.external ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownToLine className="h-4 w-4" />
                              )}
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-purple-200/70 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-purple-500 dark:text-emerald-300" />
              Direct download provides the AAB file. If you need an APK for
              installation, use the APKPure option.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
