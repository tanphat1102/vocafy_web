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
import { Plus, Edit, Trash2, Search, Eye, Volume2 } from "lucide-react";
import { vocabularyService, type Vocabulary } from "@/services";
import { toast } from "sonner";

type DialogMode = "create" | "edit" | "view" | null;

export default function ManagerVocabulariesPage() {
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedVocabulary, setSelectedVocabulary] =
    useState<Vocabulary | null>(null);
  const [formData, setFormData] = useState({
    term_text: "",
    term_language: "en",
    meaning_text: "",
    meaning_language: "vi",
    example_sentence: "",
    part_of_speech: "NOUN",
    note: "",
    course_id: 1,
    sort_order: 1,
  });

  const fetchVocabularies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await vocabularyService.list({ page, size: 10 });
      setVocabularies(response.result.content);
      setTotalPages(response.result.total_pages);
    } catch (err) {
      console.error("Failed to fetch vocabularies:", err);
      toast.error((err as Error).message || "Failed to load vocabularies");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVocabularies();
  }, [fetchVocabularies]);

  const openCreateDialog = () => {
    setFormData({
      term_text: "",
      term_language: "en",
      meaning_text: "",
      meaning_language: "vi",
      example_sentence: "",
      part_of_speech: "NOUN",
      note: "",
      course_id: 1,
      sort_order: 1,
    });
    setDialogMode("create");
  };

  const openEditDialog = (vocab: Vocabulary) => {
    setSelectedVocabulary(vocab);
    setFormData({
      term_text: vocab.terms[0]?.text_value || "",
      term_language: vocab.terms[0]?.language_code || "en",
      meaning_text: vocab.meanings[0]?.meaning_text || "",
      meaning_language: vocab.meanings[0]?.language_code || "vi",
      example_sentence: vocab.meanings[0]?.example_sentence || "",
      part_of_speech: vocab.meanings[0]?.part_of_speech || "NOUN",
      note: vocab.note || "",
      course_id: vocab.course_id || 1,
      sort_order: vocab.sort_order || 1,
    });
    setDialogMode("edit");
  };

  const openViewDialog = (vocab: Vocabulary) => {
    setSelectedVocabulary(vocab);
    setDialogMode("view");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedVocabulary(null);
  };

  const handleSubmit = async () => {
    try {
      const vocabData = {
        course_id: formData.course_id,
        sort_order: formData.sort_order,
        terms: [
          {
            language_code: formData.term_language,
            text_value: formData.term_text,
            script_type: "LATIN",
          },
        ],
        meanings: [
          {
            language_code: formData.meaning_language,
            meaning_text: formData.meaning_text,
            example_sentence: formData.example_sentence,
            part_of_speech: formData.part_of_speech,
            sense_order: 1,
          },
        ],
        medias: [],
        note: formData.note,
      };

      if (dialogMode === "create") {
        await vocabularyService.create(vocabData);
      } else if (dialogMode === "edit" && selectedVocabulary) {
        await vocabularyService.update(selectedVocabulary.id, vocabData);
      }
      closeDialog();
      fetchVocabularies();
      toast.success("Vocabulary saved successfully");
    } catch (err) {
      console.error("Failed to save vocabulary:", err);
      toast.error((err as Error).message || "Failed to save vocabulary");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vocabulary?")) return;

    try {
      await vocabularyService.delete(id);
      fetchVocabularies();
      toast.success("Vocabulary deleted successfully");
    } catch (err) {
      console.error("Failed to delete vocabulary:", err);
      toast.error((err as Error).message || "Failed to delete vocabulary");
    }
  };

  const filteredVocabularies = vocabularies.filter((vocab) =>
    vocab.terms.some((term) =>
      term.text_value.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
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
            Vocabularies
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all vocabularies in the system
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={openCreateDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Vocabulary
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search vocabularies..."
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
                <TableHead>Term</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Meaning</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVocabularies.map((vocab) => (
                <TableRow key={vocab.id}>
                  <TableCell className="font-medium">
                    {vocab.terms[0]?.text_value || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {vocab.terms[0]?.language_code || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {vocab.meanings[0]?.meaning_text || "N/A"}
                  </TableCell>
                  <TableCell>
                    {vocab.medias.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <Volume2 className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">{vocab.medias.length}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(vocab.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openViewDialog(vocab)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(vocab)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(vocab.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Create" : "Edit"} Vocabulary
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Add a new vocabulary entry."
                : "Update vocabulary information."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="term_text">Term *</Label>
              <Input
                id="term_text"
                value={formData.term_text}
                onChange={(e) =>
                  setFormData({ ...formData, term_text: e.target.value })
                }
                placeholder="Enter vocabulary term"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term_language">Term Language *</Label>
              <Select
                value={formData.term_language}
                onValueChange={(value) =>
                  setFormData({ ...formData, term_language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meaning_text">Meaning *</Label>
              <Textarea
                id="meaning_text"
                value={formData.meaning_text}
                onChange={(e) =>
                  setFormData({ ...formData, meaning_text: e.target.value })
                }
                placeholder="Enter meaning"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meaning_language">Meaning Language *</Label>
              <Select
                value={formData.meaning_language}
                onValueChange={(value) =>
                  setFormData({ ...formData, meaning_language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="part_of_speech">Part of Speech *</Label>
              <Select
                value={formData.part_of_speech}
                onValueChange={(value) =>
                  setFormData({ ...formData, part_of_speech: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOUN">Noun</SelectItem>
                  <SelectItem value="VERB">Verb</SelectItem>
                  <SelectItem value="ADJECTIVE">Adjective</SelectItem>
                  <SelectItem value="ADVERB">Adverb</SelectItem>
                  <SelectItem value="PRONOUN">Pronoun</SelectItem>
                  <SelectItem value="PREPOSITION">Preposition</SelectItem>
                  <SelectItem value="CONJUNCTION">Conjunction</SelectItem>
                  <SelectItem value="INTERJECTION">Interjection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="example_sentence">Example Sentence</Label>
              <Textarea
                id="example_sentence"
                value={formData.example_sentence}
                onChange={(e) =>
                  setFormData({ ...formData, example_sentence: e.target.value })
                }
                placeholder="Enter example sentence"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="Additional notes"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course_id">Course ID *</Label>
                <Input
                  id="course_id"
                  type="number"
                  value={formData.course_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      course_id: parseInt(e.target.value),
                    })
                  }
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order *</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value),
                    })
                  }
                  min="1"
                />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vocabulary Details</DialogTitle>
            <DialogDescription>
              View complete vocabulary information.
            </DialogDescription>
          </DialogHeader>
          {selectedVocabulary && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-gray-500">Term</Label>
                <p className="mt-1 font-medium text-lg">
                  {selectedVocabulary.terms[0]?.text_value || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Term Language</Label>
                  <p className="mt-1">
                    <Badge variant="outline">
                      {selectedVocabulary.terms[0]?.language_code || "N/A"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Script Type</Label>
                  <p className="mt-1">
                    <Badge variant="secondary">
                      {selectedVocabulary.terms[0]?.script_type || "N/A"}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Meaning</Label>
                <p className="mt-1">
                  {selectedVocabulary.meanings[0]?.meaning_text || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Meaning Language</Label>
                  <p className="mt-1">
                    <Badge variant="outline">
                      {selectedVocabulary.meanings[0]?.language_code || "N/A"}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Part of Speech</Label>
                  <p className="mt-1">
                    <Badge variant="secondary">
                      {selectedVocabulary.meanings[0]?.part_of_speech || "N/A"}
                    </Badge>
                  </p>
                </div>
              </div>
              {selectedVocabulary.meanings[0]?.example_sentence && (
                <div>
                  <Label className="text-gray-500">Example Sentence</Label>
                  <p className="mt-1 italic text-gray-700">
                    {selectedVocabulary.meanings[0].example_sentence}
                  </p>
                  {selectedVocabulary.meanings[0]?.example_translation && (
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedVocabulary.meanings[0].example_translation}
                    </p>
                  )}
                </div>
              )}
              {selectedVocabulary.note && (
                <div>
                  <Label className="text-gray-500">Note</Label>
                  <p className="mt-1">{selectedVocabulary.note}</p>
                </div>
              )}
              <div>
                <Label className="text-gray-500">Media Files</Label>
                <p className="mt-1">
                  {selectedVocabulary.medias.length > 0 ? (
                    <Badge variant="secondary">
                      {selectedVocabulary.medias.length} file(s)
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">
                      No media files
                    </span>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Created At</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedVocabulary.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Updated At</Label>
                  <p className="mt-1 text-sm">
                    {new Date(selectedVocabulary.updated_at).toLocaleString()}
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
