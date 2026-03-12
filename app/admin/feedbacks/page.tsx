"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquareReply, Star } from "lucide-react";
import { feedbackService, type Feedback } from "@/services";

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchFeedbacks = useCallback(async (): Promise<Feedback[]> => {
    try {
      setIsLoading(true);
      const response = await feedbackService.listAdmin({ page, size: 10 });
      setFeedbacks(response.result.content);
      setTotalPages(response.result.total_pages);
      return response.result.content;
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleOpenReplyDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setReplyMessage("");
    setReplyDialogOpen(true);
  };

  const handleReply = async () => {
    if (!selectedFeedback) return;
    if (selectedFeedback.admin_reply) return;

    const normalizedReply = replyMessage.trim();
    if (!normalizedReply) {
      alert("Please enter a reply message.");
      return;
    }

    try {
      setIsSubmittingReply(true);
      await feedbackService.replyFeedback(selectedFeedback.id, normalizedReply);
      const updatedList = await fetchFeedbacks();
      const updatedFeedback = updatedList.find(
        (feedback) => feedback.id === selectedFeedback.id,
      );
      if (updatedFeedback) {
        setSelectedFeedback(updatedFeedback);
      }
      setReplyMessage("");
    } catch (error) {
      console.error("Failed to reply feedback:", error);
      alert("Failed to send reply.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const normalizedSearch = searchTerm.toLowerCase();
    const displayName = (feedback.user_display_name || "").toLowerCase();
    const title = (feedback.title || "").toLowerCase();
    const content = (feedback.content || "").toLowerCase();

    return (
      displayName.includes(normalizedSearch) ||
      feedback.user_email.toLowerCase().includes(normalizedSearch) ||
      title.includes(normalizedSearch) ||
      content.includes(normalizedSearch)
    );
  });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40"
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Feedbacks</h1>
        <p className="mt-2 text-muted-foreground">
          Manage user feedback and send one-time admin replies
        </p>
      </div>

      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, title or content..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedbacks.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {feedback.user_display_name || "Anonymous user"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {feedback.user_email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{renderStars(feedback.rating)}</TableCell>
                  <TableCell className="font-medium">
                    {feedback.title || "Untitled feedback"}
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {feedback.content || "No content"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={feedback.admin_reply ? "default" : "secondary"}
                      className={
                        feedback.admin_reply
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {feedback.admin_reply ? "Replied" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {feedback.created_at
                      ? new Date(feedback.created_at).toLocaleString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReplyDialog(feedback)}
                    >
                      <MessageSquareReply className="mr-2 h-4 w-4" />
                      {feedback.admin_reply ? "View Reply" : "Reply"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={page === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Conversation</DialogTitle>
            <DialogDescription>
              {selectedFeedback?.user_display_name || "Anonymous user"} (
              {selectedFeedback?.user_email})
            </DialogDescription>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-4">
              <div className="max-h-[360px] space-y-4 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm shadow-sm">
                    <p className="mb-1 font-semibold text-foreground">
                      {selectedFeedback.title || "Untitled feedback"}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedFeedback.content || "No content"}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {selectedFeedback.created_at
                        ? new Date(selectedFeedback.created_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {selectedFeedback.admin_reply && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm">
                      <p>{selectedFeedback.admin_reply}</p>
                      {selectedFeedback.replied_at && (
                        <p className="mt-2 text-xs text-primary-foreground/80">
                          {new Date(selectedFeedback.replied_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedFeedback.admin_reply ? (
                <p className="text-sm text-muted-foreground">
                  This feedback is already replied. Backend allows only one reply.
                </p>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Write your reply..."
                    value={replyMessage}
                    onChange={(event) => setReplyMessage(event.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleReply} disabled={isSubmittingReply}>
                      {isSubmittingReply ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
