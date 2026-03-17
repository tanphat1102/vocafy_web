"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AUTH_STATE_CHANGED_EVENT,
  authService,
  feedbackService,
  type ApiError,
  type Feedback,
} from "@/services";
import { toast } from "sonner";
import {
  Check,
  Filter,
  Loader2,
  MessageSquareReply,
  Plus,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FEEDBACK_ITEMS = 120;

type SortOption = "newest" | "oldest" | "rating_high" | "rating_low";

const cardVisualThemes = [
  "from-sky-400 via-cyan-300 to-indigo-400",
  "from-emerald-400 via-teal-300 to-cyan-400",
  "from-fuchsia-400 via-rose-300 to-orange-300",
  "from-indigo-400 via-violet-300 to-purple-400",
  "from-amber-300 via-orange-300 to-rose-300",
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

function FeedbackCard({ feedback, index }: { feedback: Feedback; index: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={cn(
          "relative h-28 bg-linear-to-br",
          cardVisualThemes[index % cardVisualThemes.length],
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.55),transparent_55%)]" />
        <div className="absolute bottom-2 left-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-xs font-medium text-slate-700">
          <Sparkles className="h-3 w-3" />
          My Feedback
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="line-clamp-1 text-sm font-semibold text-foreground">
              {feedback.title || "Untitled feedback"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(feedback.created_at) || "No date"}
            </p>
          </div>
          {renderStars(feedback.rating)}
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {feedback.content || "No content"}
        </p>

        <div className="flex items-center justify-between gap-2">
          {feedback.admin_reply ? (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300">
              Replied
            </Badge>
          ) : (
            <Badge variant="secondary">Pending</Badge>
          )}
          <Badge variant="outline">ID #{feedback.id}</Badge>
        </div>

        {feedback.admin_reply ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
            <div className="mb-1 inline-flex items-center gap-1 font-medium">
              <MessageSquareReply className="h-3.5 w-3.5" />
              Admin
            </div>
            <p className="line-clamp-2">{feedback.admin_reply}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function MyFeedbackPage() {
  const [myFeedbacks, setMyFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<
    Array<"replied" | "pending">
  >([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const syncAuthState = useCallback(() => {
    setIsSignedIn(Boolean(authService.getAccessToken()));
  }, []);

  const fetchMyFeedbacks = useCallback(async () => {
    if (!authService.getAccessToken()) {
      setMyFeedbacks([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await feedbackService.listMine({
        page: 0,
        size: MAX_FEEDBACK_ITEMS,
      });
      setMyFeedbacks(response.result.content || []);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        setError("Session expired. Please sign in with Google again.");
      } else {
        console.error("Failed to fetch my feedback:", error);
        setError("Cannot load your feedback right now.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncAuthState();

    const handleAuthStateChanged = () => {
      syncAuthState();
    };

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChanged);
    return () => {
      window.removeEventListener(
        AUTH_STATE_CHANGED_EVENT,
        handleAuthStateChanged,
      );
    };
  }, [syncAuthState]);

  useEffect(() => {
    fetchMyFeedbacks();
  }, [fetchMyFeedbacks, isSignedIn]);

  const filteredFeedbacks = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const filtered = myFeedbacks.filter((feedback) => {
      const text = `${feedback.title || ""} ${feedback.content || ""}`.toLowerCase();
      const matchesSearch = normalizedSearch.length === 0 || text.includes(normalizedSearch);

      const matchesRating =
        selectedRatings.length === 0 || selectedRatings.includes(feedback.rating);

      const status = feedback.admin_reply ? "replied" : "pending";
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(status);

      return matchesSearch && matchesRating && matchesStatus;
    });

    const sorted = filtered.slice();
    sorted.sort((a, b) => {
      if (sortBy === "rating_high") return b.rating - a.rating;
      if (sortBy === "rating_low") return a.rating - b.rating;

      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;

      return sortBy === "oldest" ? aTime - bTime : bTime - aTime;
    });

    return sorted;
  }, [myFeedbacks, searchText, selectedRatings, selectedStatuses, sortBy]);

  const handleGoogleLogin = async () => {
    try {
      setIsAuthLoading(true);
      await authService.signInWithGoogleAndSync();
      toast.success("Signed in with Google.");
      syncAuthState();
      fetchMyFeedbacks();
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!authService.getAccessToken()) {
      toast.error("Please sign in with Google before posting feedback.");
      return;
    }

    if (!title.trim() && !content.trim()) {
      toast.error("Please enter feedback title or content.");
      return;
    }

    try {
      setIsSubmitting(true);

      await feedbackService.create({
        rating,
        title: title.trim() || undefined,
        content: content.trim() || undefined,
      });

      toast.success("Your feedback has been posted.");
      setTitle("");
      setContent("");
      setRating(5);
      setIsCreateDialogOpen(false);
      fetchMyFeedbacks();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 401) {
        toast.error("Session expired. Please sign in with Google again.");
        return;
      }

      console.error("Failed to submit feedback:", error);
      toast.error(apiError.message || "Cannot submit feedback right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRating = (value: number) => {
    setSelectedRatings((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const toggleStatus = (value: "replied" | "pending") => {
    setSelectedStatuses((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedRatings([]);
    setSelectedStatuses([]);
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-linear-to-r from-primary/10 via-background to-background py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" />
            My Feedback Dashboard
          </Badge>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Manage Your Feedback
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Filter, review, and submit new feedback using the catalog layout.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 sm:py-10">
        {!isSignedIn ? (
          <Card className="border-border/70 bg-card/95 shadow-sm">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
              <p className="text-sm text-muted-foreground">
                Please sign in with Google to access your personal feedback.
              </p>
              <Button onClick={handleGoogleLogin} disabled={isAuthLoading}>
                {isAuthLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-4 rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-22 lg:h-fit">
              <div className="flex items-center gap-2 text-foreground">
                <Filter className="h-4 w-4 text-primary" />
                <p className="font-semibold">Search & Filters</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Search</p>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search title/content"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Rating</p>
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((value) => {
                    const checked = selectedRatings.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg border border-border px-2.5 py-2 text-left text-sm hover:bg-muted/50"
                        onClick={() => toggleRating(value)}
                      >
                        <span className="text-foreground">{value} stars</span>
                        {checked ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="h-4 w-4 rounded border border-border" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Reply Status</p>
                <div className="space-y-1.5">
                  {[
                    { key: "replied", label: "Replied" },
                    { key: "pending", label: "Pending" },
                  ].map((item) => {
                    const key = item.key as "replied" | "pending";
                    const checked = selectedStatuses.includes(key);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg border border-border px-2.5 py-2 text-left text-sm hover:bg-muted/50"
                        onClick={() => toggleStatus(key)}
                      >
                        <span className="text-foreground">{item.label}</span>
                        {checked ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="h-4 w-4 rounded border border-border" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={clearFilters}>
                Clear filters
              </Button>
            </aside>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  We found{" "}
                  <span className="font-semibold text-primary">
                    {filteredFeedbacks.length}
                  </span>{" "}
                  feedback entries for you
                </p>

                <div className="flex items-center gap-2">
                  <select
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="rating_high">Rating: High to Low</option>
                    <option value="rating_low">Rating: Low to High</option>
                  </select>

                  <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Feedback
                  </Button>
                </div>
              </div>

              {error ? (
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="p-5 text-sm text-destructive">
                    {error}
                  </CardContent>
                </Card>
              ) : null}

              {isLoading ? (
                <div className="flex items-center justify-center py-14">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
              ) : filteredFeedbacks.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No feedback matched your filters.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredFeedbacks.map((feedback, index) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Feedback</DialogTitle>
            <DialogDescription>
              Your feedback helps improve the whole app experience.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Rating</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const star = index + 1;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="rounded-md p-1 transition-transform hover:scale-110"
                      aria-label={`Set rating ${star}`}
                    >
                      <Star
                        className={cn(
                          "h-6 w-6",
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/35",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Feedback title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <Textarea
                placeholder="Share your experience..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={5}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitFeedback} disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Feedback"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
