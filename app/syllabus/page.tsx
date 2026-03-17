"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FadeInOnScroll } from "@/components/ui/fade-in-on-scroll";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  syllabusService,
  vocabularyService,
  type Course,
  type Syllabus,
  type Vocabulary,
} from "@/services";
import {
  BookOpen,
  Check,
  Clock3,
  Filter,
  Languages,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

type SortOption = "newest" | "title_asc" | "title_desc" | "days_asc" | "days_desc";
type DurationFilter = "all" | "short" | "medium" | "long";

function getPrimaryTerm(vocabulary: Vocabulary): string {
  return vocabulary.terms[0]?.text_value || "No term";
}

function getPrimaryMeaning(vocabulary: Vocabulary): string {
  return vocabulary.meanings[0]?.meaning_text || "No meaning";
}

function getPrimaryLanguage(vocabulary: Vocabulary): string {
  return vocabulary.terms[0]?.language_code || "N/A";
}

export default function SyllabusPage() {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedLanguageSets, setSelectedLanguageSets] = useState<string[]>([]);
  const [selectedVisibilities, setSelectedVisibilities] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<DurationFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSyllabus, setDetailSyllabus] = useState<Syllabus | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [expandedTopicIds, setExpandedTopicIds] = useState<number[]>([]);
  const [expandedCourseIds, setExpandedCourseIds] = useState<number[]>([]);
  const [courseVocabularyMap, setCourseVocabularyMap] = useState<
    Record<number, Vocabulary[]>
  >({});
  const [loadingVocabularyCourseIds, setLoadingVocabularyCourseIds] = useState<
    number[]
  >([]);

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await syllabusService.list({ page: 0, size: 200 });
        setSyllabuses(response.result.content || []);
      } catch (err) {
        console.error("Failed to fetch syllabuses:", err);
        setError("Cannot load syllabuses from API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSyllabuses();
  }, []);

  const languageSetOptions = useMemo(
    () =>
      Array.from(new Set(syllabuses.map((item) => item.language_set))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [syllabuses],
  );

  const visibilityOptions = useMemo(
    () => Array.from(new Set(syllabuses.map((item) => item.visibility))),
    [syllabuses],
  );

  const filteredSyllabuses = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const filtered = syllabuses.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        (item.description || "").toLowerCase().includes(normalizedSearch);

      const matchesLanguage =
        selectedLanguageSets.length === 0 ||
        selectedLanguageSets.includes(item.language_set);

      const matchesVisibility =
        selectedVisibilities.length === 0 ||
        selectedVisibilities.includes(item.visibility);

      const matchesDuration =
        selectedDuration === "all" ||
        (selectedDuration === "short" && item.total_days <= 30) ||
        (selectedDuration === "medium" && item.total_days > 30 && item.total_days <= 90) ||
        (selectedDuration === "long" && item.total_days > 90);

      return matchesSearch && matchesLanguage && matchesVisibility && matchesDuration;
    });

    const sorted = filtered.slice();

    sorted.sort((a, b) => {
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title_desc") {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === "days_asc") {
        return a.total_days - b.total_days;
      }
      if (sortBy === "days_desc") {
        return b.total_days - a.total_days;
      }

      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return bTime - aTime;
    });

    return sorted;
  }, [searchText, selectedLanguageSets, selectedVisibilities, selectedDuration, sortBy, syllabuses]);

  const toggleInArray = (
    value: string,
    setState: Dispatch<SetStateAction<string[]>>,
  ) => {
    setState((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const openDetailModal = useCallback(async (syllabusId: number) => {
    setDetailOpen(true);
    setIsDetailLoading(true);

    try {
      const response = await syllabusService.getById(syllabusId);
      setDetailSyllabus(response.result);

      const sortedTopics = (response.result.topics || [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order);

      const firstTopicId = sortedTopics[0]?.id;
      setExpandedTopicIds(firstTopicId ? [firstTopicId] : []);
      setExpandedCourseIds([]);
      setCourseVocabularyMap({});
      setLoadingVocabularyCourseIds([]);
    } catch (err) {
      console.error("Failed to fetch syllabus detail:", err);
      setDetailSyllabus(null);
      setError("Cannot load syllabus detail right now.");
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const sortedTopics = (detailSyllabus?.topics || [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);

  const isLoadingVocabularyForCourse = (courseId: number) =>
    loadingVocabularyCourseIds.includes(courseId);

  const loadVocabularyForCourse = useCallback(async (courseId: number) => {
    if (courseVocabularyMap[courseId]) {
      return;
    }

    setLoadingVocabularyCourseIds((current) => [...current, courseId]);

    try {
      const response = await vocabularyService.listByCourse(courseId, {
        page: 0,
        size: 50,
      });

      setCourseVocabularyMap((current) => ({
        ...current,
        [courseId]: response.result.content || [],
      }));
    } catch (err) {
      console.error("Failed to fetch vocabularies for course:", err);
      setCourseVocabularyMap((current) => ({
        ...current,
        [courseId]: [],
      }));
    } finally {
      setLoadingVocabularyCourseIds((current) =>
        current.filter((id) => id !== courseId),
      );
    }
  }, [courseVocabularyMap]);

  const toggleTopic = (topicId: number) => {
    setExpandedTopicIds((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId],
    );
  };

  const toggleCourse = (course: Course) => {
    const courseId = course.id;

    setExpandedCourseIds((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId],
    );

    if (!courseVocabularyMap[courseId]) {
      loadVocabularyForCourse(courseId);
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedLanguageSets([]);
    setSelectedVisibilities([]);
    setSelectedDuration("all");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border bg-linear-to-r from-primary/10 via-background to-background py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Vocafy Syllabus Catalog
          </Badge>
          <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Explore Learning Syllabuses
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Browse by filters, compare syllabuses, and open full topic/course/
            vocabulary details in one place.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 sm:py-10">
        {error ? (
          <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-foreground">
              <Filter className="h-4 w-4 text-primary" />
              <p className="font-semibold">Filters</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Search</p>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search syllabus..."
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Language Set</p>
              <div className="space-y-1.5">
                {languageSetOptions.map((language) => {
                  const checked = selectedLanguageSets.includes(language);
                  return (
                    <button
                      key={language}
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg border border-border px-2.5 py-2 text-left text-sm hover:bg-muted/50"
                      onClick={() => toggleInArray(language, setSelectedLanguageSets)}
                    >
                      <span className="text-foreground">{language}</span>
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
              <p className="text-sm font-medium text-foreground">Visibility</p>
              <div className="space-y-1.5">
                {visibilityOptions.map((visibility) => {
                  const checked = selectedVisibilities.includes(visibility);
                  return (
                    <button
                      key={visibility}
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg border border-border px-2.5 py-2 text-left text-sm hover:bg-muted/50"
                      onClick={() => toggleInArray(visibility, setSelectedVisibilities)}
                    >
                      <span className="text-foreground">{visibility}</span>
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
              <p className="text-sm font-medium text-foreground">Duration</p>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                value={selectedDuration}
                onChange={(event) =>
                  setSelectedDuration(event.target.value as DurationFilter)
                }
              >
                <option value="all">All durations</option>
                <option value="short">Short (&lt;= 30 days)</option>
                <option value="medium">Medium (31 - 90 days)</option>
                <option value="long">Long (&gt; 90 days)</option>
              </select>
            </div>

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              Clear filters
            </Button>
          </aside>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                We found <span className="font-semibold text-primary">{filteredSyllabuses.length}</span> syllabuses for you
              </p>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort by:</span>
                <select
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                >
                  <option value="newest">Newest</option>
                  <option value="title_asc">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                  <option value="days_asc">Duration: Low to High</option>
                  <option value="days_desc">Duration: High to Low</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
            ) : filteredSyllabuses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No syllabus matched your filters.
              </div>
            ) : (
              <FadeInOnScroll>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredSyllabuses.map((syllabus) => (
                    <button
                      key={syllabus.id}
                      type="button"
                      onClick={() => openDetailModal(syllabus.id)}
                      className="group rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
                    >
                      <div className="mb-3 rounded-xl bg-linear-to-r from-primary/12 via-primary/5 to-transparent p-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline">#{syllabus.id}</Badge>
                          <Badge variant="secondary">{syllabus.visibility}</Badge>
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground">
                          {syllabus.title}
                        </h3>
                      </div>

                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {syllabus.description || "No description"}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div className="rounded-lg border border-border bg-background px-2.5 py-2">
                          <Clock3 className="mb-1 h-3.5 w-3.5 text-primary" />
                          <span className="text-foreground">{syllabus.total_days} days</span>
                        </div>
                        <div className="rounded-lg border border-border bg-background px-2.5 py-2">
                          <Languages className="mb-1 h-3.5 w-3.5 text-primary" />
                          <span className="text-foreground">{syllabus.language_set}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs font-medium text-primary group-hover:underline">
                        View details
                      </p>
                    </button>
                  ))}
                </div>
              </FadeInOnScroll>
            )}
          </div>
        </div>
      </section>

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setDetailSyllabus(null);
            setExpandedTopicIds([]);
            setExpandedCourseIds([]);
            setCourseVocabularyMap({});
            setLoadingVocabularyCourseIds([]);
          }
        }}
      >
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-4xl">
          {isDetailLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : detailSyllabus ? (
            <>
              <DialogHeader>
                <DialogTitle>{detailSyllabus.title}</DialogTitle>
                <DialogDescription>
                  {detailSyllabus.description || "No description"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {detailSyllabus.total_days} days
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">Language Set</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {detailSyllabus.language_set}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
                  <p className="text-muted-foreground">Topics</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {sortedTopics.length}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Topic, Course, Vocabulary Details
                  </p>
                </div>

                {sortedTopics.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    This syllabus has no topics yet.
                  </div>
                ) : (
                  sortedTopics.map((topic, topicIndex) => {
                    const courses = (topic.courses || [])
                      .slice()
                      .sort((a, b) => a.sort_order - b.sort_order);
                    const topicExpanded = expandedTopicIds.includes(topic.id);

                    return (
                      <div
                        key={topic.id}
                        className="rounded-xl border border-border bg-card p-3"
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1 text-left"
                          onClick={() => toggleTopic(topic.id)}
                        >
                          <div>
                            <p className="text-xs text-muted-foreground">Topic {topicIndex + 1}</p>
                            <p className="font-semibold text-foreground">{topic.title}</p>
                          </div>
                          <Badge variant="outline">{courses.length} courses</Badge>
                        </button>

                        {topicExpanded ? (
                          <div className="mt-3 space-y-2 border-t border-border pt-3">
                            <p className="text-sm text-muted-foreground">
                              {topic.description || "No description"}
                            </p>

                            {courses.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No courses</p>
                            ) : (
                              courses.map((course, courseIndex) => {
                                const courseExpanded = expandedCourseIds.includes(course.id);
                                const vocabularies = courseVocabularyMap[course.id] || [];
                                const loading = isLoadingVocabularyForCourse(course.id);

                                return (
                                  <div
                                    key={course.id}
                                    className="rounded-lg border border-border bg-background p-3"
                                  >
                                    <button
                                      type="button"
                                      className="flex w-full items-center justify-between gap-2 text-left"
                                      onClick={() => toggleCourse(course)}
                                    >
                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Course {courseIndex + 1}
                                        </p>
                                        <p className="font-medium text-foreground">{course.title}</p>
                                      </div>
                                      <Badge variant="secondary">Vocabulary</Badge>
                                    </button>

                                    {courseExpanded ? (
                                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                                        <p className="text-sm text-muted-foreground">
                                          {course.description || "No description"}
                                        </p>

                                        {loading ? (
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading vocabulary details...
                                          </div>
                                        ) : vocabularies.length === 0 ? (
                                          <p className="text-sm text-muted-foreground">
                                            No vocabularies in this course.
                                          </p>
                                        ) : (
                                          <div className="space-y-2">
                                            {vocabularies.map((vocabulary) => (
                                              <div
                                                key={vocabulary.id}
                                                className="rounded-md border border-border bg-card px-3 py-2"
                                              >
                                                <div className="flex items-start justify-between gap-2">
                                                  <p className="font-medium text-foreground">
                                                    {getPrimaryTerm(vocabulary)}
                                                  </p>
                                                  <Badge variant="outline">
                                                    {getPrimaryLanguage(vocabulary)}
                                                  </Badge>
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                  {getPrimaryMeaning(vocabulary)}
                                                </p>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Failed to load syllabus details.
            </p>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
