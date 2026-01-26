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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { syllabusService, type Syllabus } from "@/services";

type DialogMode = "create" | "edit" | "view" | null;

export default function AdminSyllabusesPage() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language_set: "EN-VI",
    total_days: 30,
    visibility: "PUBLIC" as "PUBLIC" | "PRIVATE",
    source_type: "SYSTEM" as "SYSTEM" | "USER",
  });

  const fetchSyllabuses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await syllabusService.list({ page, size: 10 });
      setSyllabuses(response.result.content);
      setTotalPages(response.result.total_pages);
    } catch (error) {
      console.error("Failed to fetch syllabuses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSyllabuses();
  }, [fetchSyllabuses]);

  const openCreateDialog = () => {
    setFormData({
      title: "",
      description: "",
      language_set: "EN-VI",
      total_days: 30,
      visibility: "PUBLIC",
      source_type: "SYSTEM",
    });
    setDialogMode("create");
  };

  const openEditDialog = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus);
    setFormData({
      title: syllabus.title,
      description: syllabus.description || "",
      language_set: syllabus.language_set,
      total_days: syllabus.total_days,
      visibility: syllabus.visibility as "PUBLIC" | "PRIVATE",
      source_type: syllabus.source_type as "SYSTEM" | "USER",
    });
    setDialogMode("edit");
  };

  const openViewDialog = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus);
    setDialogMode("view");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedSyllabus(null);
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === "create") {
        await syllabusService.create(formData);
      } else if (dialogMode === "edit" && selectedSyllabus) {
        await syllabusService.update(selectedSyllabus.id, formData);
      }
      closeDialog();
      fetchSyllabuses();
    } catch (error) {
      console.error("Failed to save syllabus:", error);
      alert("Failed to save syllabus");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this syllabus?")) return;

    try {
      await syllabusService.delete(id);
      fetchSyllabuses();
    } catch (error) {
      console.error("Failed to delete syllabus:", error);
      alert("Failed to delete syllabus");
    }
  };

  const filteredSyllabuses = syllabuses.filter((syllabus) =>
    syllabus.title.toLowerCase().includes(searchTerm.toLowerCase()),
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Syllabuses</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all syllabuses in the system
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Create Syllabus
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search syllabuses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Language Set</TableHead>
                <TableHead>Total Days</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSyllabuses.map((syllabus) => (
                <TableRow key={syllabus.id}>
                  <TableCell className="font-medium">
                    {syllabus.title}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {syllabus.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{syllabus.language_set}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {syllabus.total_days} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        syllabus.visibility === "PUBLIC"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        syllabus.visibility === "PUBLIC"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {syllabus.visibility}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={syllabus.active ? "default" : "secondary"}
                      className={
                        syllabus.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {syllabus.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(syllabus.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openViewDialog(syllabus)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(syllabus)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(syllabus.id)}
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
        <DialogContent className="max-w-2xl border-2 border-primary/30 shadow-lg shadow-primary/10">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create" : "Edit"} Syllabus
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Add a new syllabus to the system."
                : "Update syllabus information."}
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
                placeholder="Enter syllabus title"
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
                placeholder="Enter syllabus description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language_set">Language Set *</Label>
                <Select
                  value={formData.language_set}
                  onValueChange={(value) =>
                    setFormData({ ...formData, language_set: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EN-VI">EN-VI</SelectItem>
                    <SelectItem value="VI-EN">VI-EN</SelectItem>
                    <SelectItem value="EN-JP">EN-JP</SelectItem>
                    <SelectItem value="JP-EN">JP-EN</SelectItem>
                  </SelectContent>
                </Select>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility *</Label>
                <Select
                  value={formData.visibility}
                  onValueChange={(value: "PUBLIC" | "PRIVATE") =>
                    setFormData({ ...formData, visibility: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_type">Source Type *</Label>
                <Select
                  value={formData.source_type}
                  onValueChange={(value: "SYSTEM" | "USER") =>
                    setFormData({ ...formData, source_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYSTEM">System</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
        <DialogContent className="max-w-2xl border-2 border-primary/30 shadow-lg shadow-primary/10">
          <DialogHeader>
            <DialogTitle>Syllabus Details</DialogTitle>
            <DialogDescription>
              View complete information about this syllabus.
            </DialogDescription>
          </DialogHeader>
          {selectedSyllabus && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Title</Label>
                  <p className="mt-1 font-medium">{selectedSyllabus.title}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Language Set</Label>
                  <p className="mt-1">
                    <Badge variant="outline">
                      {selectedSyllabus.language_set}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Description</Label>
                <p className="mt-1">
                  {selectedSyllabus.description || "No description"}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-500">Total Days</Label>
                  <p className="mt-1">
                    <Badge variant="secondary">
                      {selectedSyllabus.total_days} days
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Visibility</Label>
                  <p className="mt-1">
                    <Badge
                      variant={
                        selectedSyllabus.visibility === "PUBLIC"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        selectedSyllabus.visibility === "PUBLIC"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {selectedSyllabus.visibility}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <p className="mt-1">
                    <Badge
                      variant={
                        selectedSyllabus.active ? "default" : "secondary"
                      }
                      className={
                        selectedSyllabus.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {selectedSyllabus.active ? "Active" : "Inactive"}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Source Type</Label>
                  <p className="mt-1">
                    <Badge variant="outline">
                      {selectedSyllabus.source_type}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Topics</Label>
                  <p className="mt-1">
                    <Badge variant="secondary">
                      {selectedSyllabus.topics?.length || 0} topics
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Created At</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedSyllabus.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Updated At</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedSyllabus.updated_at).toLocaleString()}
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
