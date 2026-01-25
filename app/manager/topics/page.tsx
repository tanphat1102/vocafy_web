"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { topicService, type Topic } from "@/services";

type DialogMode = "create" | "edit" | "view" | null;

export default function ManagerTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    total_days: 7,
  });

  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await topicService.list({ page, size: 10 });
      setTopics(response.result.content);
      setTotalPages(response.result.total_pages);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const openCreateDialog = () => {
    setFormData({
      title: "",
      description: "",
      total_days: 7,
    });
    setDialogMode("create");
  };

  const openEditDialog = (topic: Topic) => {
    setSelectedTopic(topic);
    setFormData({
      title: topic.title,
      description: topic.description || "",
      total_days: topic.total_days,
    });
    setDialogMode("edit");
  };

  const openViewDialog = (topic: Topic) => {
    setSelectedTopic(topic);
    setDialogMode("view");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedTopic(null);
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === "create") {
        await topicService.create(formData);
      } else if (dialogMode === "edit" && selectedTopic) {
        await topicService.update(selectedTopic.id, formData);
      }
      closeDialog();
      fetchTopics();
    } catch (error) {
      console.error("Failed to save topic:", error);
      alert("Failed to save topic");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;

    try {
      await topicService.delete(id);
      fetchTopics();
    } catch (error) {
      console.error("Failed to delete topic:", error);
      alert("Failed to delete topic");
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Topics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all topics in the system
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={openCreateDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Topic
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Total Days</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.title}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {topic.description || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{topic.total_days} days</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {topic.courses.length} courses
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={topic.is_active ? "default" : "secondary"}
                      className={
                        topic.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : ""
                      }
                    >
                      {topic.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(topic.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openViewDialog(topic)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(topic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(topic.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogMode === "create" || dialogMode === "edit"}
        onOpenChange={closeDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create" : "Edit"} Topic
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Add a new topic to the system."
                : "Update topic information."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter topic title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter topic description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_days">Total Days *</Label>
              <Input
                id="total_days"
                type="number"
                value={formData.total_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_days: parseInt(e.target.value),
                  })
                }
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {dialogMode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={dialogMode === "view"} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Topic Details</DialogTitle>
            <DialogDescription>
              View complete information about this topic.
            </DialogDescription>
          </DialogHeader>
          {selectedTopic && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-500">Title</Label>
                <p className="mt-1 font-medium">{selectedTopic.title}</p>
              </div>
              <div>
                <Label className="text-gray-500">Description</Label>
                <p className="mt-1">
                  {selectedTopic.description || "No description"}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-500">Total Days</Label>
                  <p className="mt-1">
                    <Badge variant="outline">
                      {selectedTopic.total_days} days
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Courses</Label>
                  <p className="mt-1">
                    <Badge variant="secondary">
                      {selectedTopic.courses.length} courses
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <p className="mt-1">
                    <Badge
                      variant={
                        selectedTopic.is_active ? "default" : "secondary"
                      }
                      className={
                        selectedTopic.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {selectedTopic.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Created At</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedTopic.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Updated At</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedTopic.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
