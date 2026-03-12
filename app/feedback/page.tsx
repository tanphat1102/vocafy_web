"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { feedbackService, type ApiError, type Feedback } from "@/services";
import {
  Loader2,
  MessageSquareReply,
  Quote,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FEEDBACK_ITEMS = 120;

const feedbackThemes = [
  {
    border: "border-orange-400/80 dark:border-orange-300/60",
    badge: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
    subtle: "text-orange-600 dark:text-orange-300",
  },
  {
    border: "border-rose-400/80 dark:border-rose-300/60",
    badge: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
    subtle: "text-rose-600 dark:text-rose-300",
  },
  {
    border: "border-fuchsia-400/80 dark:border-fuchsia-300/60",
    badge: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300",
    subtle: "text-fuchsia-600 dark:text-fuchsia-300",
  },
];

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/35",
          )}
        />
      ))}
    </div>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "";

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "";
  }
}

function FeedbackShowcaseCard({
  feedback,
  index,
}: {
  feedback: Feedback;
  index: number;
}) {
  const theme = feedbackThemes[index % feedbackThemes.length];

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 bg-card p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md",
        theme.border,
      )}
    >
      <div
        className={cn(
          "absolute -top-3 left-4 flex h-7 w-7 items-center justify-center rounded-full",
          theme.badge,
        )}
      >
        <Quote className="h-4 w-4" />
      </div>

      <div className="flex items-start justify-between gap-3 pt-2">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full",
              theme.badge,
            )}
          >
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {feedback.user_display_name || feedback.user_email || "Anonymous"}
            </p>
            <p className={cn("text-xs", theme.subtle)}>Vocafy learner</p>
          </div>
        </div>
        {renderStars(feedback.rating)}
      </div>

      <div className="mt-3 rounded-xl bg-muted/40 p-3">
        <p className="line-clamp-1 text-sm font-medium text-foreground">
          {feedback.title || "Untitled feedback"}
        </p>
        <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
          {feedback.content || "No content"}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {formatDate(feedback.created_at)}
        </span>
        {feedback.admin_reply ? (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Admin replied
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Awaiting reply</span>
        )}
      </div>

      {feedback.admin_reply ? (
        <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
          <div className="mb-1 inline-flex items-center gap-1 font-medium">
            <MessageSquareReply className="h-3.5 w-3.5" />
            Admin
          </div>
          <p className="line-clamp-2">{feedback.admin_reply}</p>
        </div>
      ) : null}

      <div
        className={cn(
          "absolute -bottom-3 right-4 flex h-7 w-7 items-center justify-center rounded-full",
          theme.badge,
        )}
      >
        <Quote className="h-4 w-4" />
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const [allFeedbacks, setAllFeedbacks] = useState<Feedback[]>([]);
  const [isAllLoading, setIsAllLoading] = useState(true);
  const [allFeedbackError, setAllFeedbackError] = useState<string | null>(null);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  const fetchAllFeedbacks = useCallback(async () => {
    try {
      setIsAllLoading(true);
      setAllFeedbackError(null);

      const response = await feedbackService.listAll({
        page: 0,
        size: MAX_FEEDBACK_ITEMS,
      });
      setAllFeedbacks(response.result.content || []);
      setCarouselStartIndex(0);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setAllFeedbacks([]);
        setAllFeedbackError("Sign in with Google to load app feedback feed.");
        return;
      }

      console.error("Failed to fetch app feedbacks:", error);
      setAllFeedbackError("Cannot load app feedbacks right now.");
    } finally {
      setIsAllLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFeedbacks();
  }, [fetchAllFeedbacks]);

  useEffect(() => {
    if (allFeedbacks.length <= 3) return;

    const interval = window.setInterval(() => {
      setCarouselStartIndex((current) => (current + 1) % allFeedbacks.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [allFeedbacks.length]);

  const averageRating = useMemo(() => {
    if (allFeedbacks.length === 0) return 0;

    const total = allFeedbacks.reduce((sum, item) => sum + item.rating, 0);
    return total / allFeedbacks.length;
  }, [allFeedbacks]);

  const userCount = useMemo(() => {
    const uniqueUserIds = new Set(
      allFeedbacks
        .map((item) => item.user_id)
        .filter((id): id is string => typeof id === "string" && id.length > 0),
    );

    return uniqueUserIds.size;
  }, [allFeedbacks]);

  const visibleFeedbacks = useMemo(() => {
    const total = allFeedbacks.length;
    if (total === 0) return [] as Array<{ feedback: Feedback; index: number }>;

    if (total <= 3) {
      return allFeedbacks.map((feedback, index) => ({ feedback, index }));
    }

    return Array.from({ length: 3 }).map((_, offset) => {
      const index = (carouselStartIndex + offset) % total;
      return {
        feedback: allFeedbacks[index],
        index,
      };
    });
  }, [allFeedbacks, carouselStartIndex]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/60 bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 py-18 text-white">
        <div className="pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full bg-cyan-500/35 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-8 h-44 w-44 rounded-full bg-fuchsia-500/35 blur-3xl" />
        <div className="container relative mx-auto px-4">
          <FadeInOnScroll className="mx-auto max-w-4xl space-y-4 text-center">
            <Badge className="bg-white/15 text-white hover:bg-white/15">
              <Sparkles className="mr-2 h-4 w-4" />
              Feedback Hub
            </Badge>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Community Feedback
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-indigo-100 sm:text-base md:text-lg">
              See what users say about Vocafy and explore feedback highlights.
            </p>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-12 md:py-14">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Tabs defaultValue="all" className="w-auto">
            <TabsList className="h-11 rounded-xl p-1">
              <TabsTrigger value="all" className="px-4">
                App Feedback
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="inline-flex items-center gap-2 rounded-md bg-blue-900 px-3 py-1.5 text-sm text-white">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="whitespace-nowrap">
              {averageRating.toFixed(1)} rating • {userCount.toLocaleString()}+ users
            </span>
          </div>
        </div>

        {allFeedbackError ? (
          <Card className="mb-4 border-destructive/30 bg-destructive/5">
            <CardContent className="p-5 text-sm text-destructive">
              {allFeedbackError}
            </CardContent>
          </Card>
        ) : null}

        {isAllLoading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : allFeedbacks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No feedback data available.
            </CardContent>
          </Card>
        ) : (
          <>
            <div key={carouselStartIndex} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleFeedbacks.map((item) => (
                <FeedbackShowcaseCard
                  key={`${item.feedback.id}-${carouselStartIndex}`}
                  feedback={item.feedback}
                  index={item.index}
                />
              ))}
            </div>

            {allFeedbacks.length > 3 ? (
              <div className="mt-4 flex items-center justify-center gap-2">
                {allFeedbacks.map((feedback, index) => {
                  const isActive = index === carouselStartIndex;
                  return (
                    <button
                      key={feedback.id}
                      type="button"
                      className={cn(
                        "h-2 rounded-full transition-all",
                        isActive ? "w-6 bg-primary" : "w-2 bg-muted",
                      )}
                      onClick={() => setCarouselStartIndex(index)}
                      aria-label={`Show feedback position ${index + 1}`}
                    />
                  );
                })}
              </div>
            ) : null}
          </>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Want to manage your own feedback history and submit a new one?
          </p>
          <Link href="/my-feedback" className="mt-3 inline-block">
            <Button>Go to your personal feedback</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
