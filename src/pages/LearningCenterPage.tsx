import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, BookOpen, Users, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseCard } from "@/components/learningCenter/CourseCard";
import { LearningTrackCard } from "@/components/learningCenter/LearningTrackCard";
import { ReviewCard } from "@/components/learningCenter/ReviewCard";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { courses, coursesFilters } from "@/data/learningCenter/courses";
import { learningTracks, tracksFilters } from "@/data/learningCenter/learningTracks";
import { reviews, reviewsFilters } from "@/data/learningCenter/reviews";

type TabType = "courses" | "learning-tracks" | "reviews";
type SortOption =
  | "recommended"
  | "title-asc"
  | "rating-desc"
  | "duration-asc"
  | "courses-desc"
  | "helpful-desc"
  | "recent";

const ITEMS_PER_PAGE = 9;

const defaultSortByTab: Record<TabType, SortOption> = {
  courses: "recommended",
  "learning-tracks": "recommended",
  reviews: "recent",
};

const tabPlaceholders: Record<TabType, string> = {
  courses: "Search courses, topics, or instructors...",
  "learning-tracks": "Search learning tracks or focus areas...",
  reviews: "Search reviews or courses...",
};

const parseHours = (duration: string) => {
  const match = duration.toLowerCase().match(/(\d+(\.\d+)?)\s*hours?/);
  return match ? Number(match[1]) : 0;
};

const matchDurationRange = (hours: number, range: string) => {
  switch (range) {
    case "< 5 hours":
      return hours < 5;
    case "5-10 hours":
      return hours >= 5 && hours <= 10;
    case "10-20 hours":
      return hours > 10 && hours <= 20;
    case "20-40 hours":
      return hours > 20 && hours <= 40;
    case "40+ hours":
      return hours > 40;
    default:
      return true;
  }
};

const parseTrackDurationWeeks = (duration: string) => {
  const normalized = duration.toLowerCase();
  const valueMatch = normalized.match(/(\d+(\.\d+)?)/);
  const value = valueMatch ? Number(valueMatch[1]) : 0;
  if (normalized.includes("month")) return value * 4;
  if (normalized.includes("week")) return value;
  return 0;
};

const matchTrackDurationRange = (weeks: number, range: string) => {
  switch (range) {
    case "2-4 weeks":
      return weeks >= 2 && weeks <= 4;
    case "1-2 months":
      return weeks > 4 && weeks <= 8;
    case "2-3 months":
      return weeks > 8 && weeks <= 12;
    case "3-6 months":
      return weeks > 12 && weeks <= 24;
    default:
      return true;
  }
};

const getRatingThreshold = (ratingFilter: string) => {
  switch (ratingFilter) {
    case "5 stars":
      return 5;
    case "4+ stars":
      return 4;
    case "3+ stars":
      return 3;
    default:
      return 0;
  }
};

export default function LearningCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "courses";
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<SortOption>(defaultSortByTab[initialTab]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (value: string) => {
    const tab = value as TabType;
    setActiveTab(tab);
    setSearchParams({ tab });
    setSelectedFilters({});
    setSortBy(defaultSortByTab[tab]);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setCurrentPage(1);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCourses = useMemo(() => {
    const activeFilters = selectedFilters;
    return courses.filter((course) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          course.title,
          course.description,
          course.category,
          course.department,
          course.level,
          course.provider?.name ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      if (!matchesSearch) return false;

      const departmentFilter = activeFilters.department ?? [];
      if (departmentFilter.length > 0 && !departmentFilter.includes(course.department)) {
        return false;
      }

      const categoryFilter = activeFilters.category ?? [];
      if (categoryFilter.length > 0 && !categoryFilter.includes(course.category)) {
        return false;
      }

      const providerFilter = activeFilters.provider ?? [];
      if (providerFilter.length > 0) {
        const provider = course.provider?.name ?? "Custom";
        if (!providerFilter.includes(provider)) return false;
      }

      const levelFilter = activeFilters.level ?? [];
      if (levelFilter.length > 0 && !levelFilter.includes(course.level)) {
        return false;
      }

      const durationFilter = activeFilters.duration ?? [];
      if (durationFilter.length > 0) {
        const hours = parseHours(course.duration);
        if (!durationFilter.some((range) => matchDurationRange(hours, range))) return false;
      }

      const formatFilter = activeFilters.format ?? [];
      if (formatFilter.length > 0 && !formatFilter.includes(course.format)) {
        return false;
      }

      const ratingFilter = activeFilters.rating ?? [];
      if (ratingFilter.length > 0) {
        const minThreshold = Math.max(...ratingFilter.map(getRatingThreshold));
        if (course.rating < minThreshold) return false;
      }

      return true;
    });
  }, [normalizedQuery, selectedFilters]);

  const filteredTracks = useMemo(() => {
    const activeFilters = selectedFilters;
    return learningTracks.filter((track) => {
      const matchesSearch =
        !normalizedQuery ||
        [track.title, track.description, track.role, track.focusArea]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      if (!matchesSearch) return false;

      const roleFilter = activeFilters.role ?? [];
      if (roleFilter.length > 0 && !roleFilter.includes(track.role)) {
        return false;
      }

      const focusAreaFilter = activeFilters.focusArea ?? [];
      if (focusAreaFilter.length > 0 && !focusAreaFilter.includes(track.focusArea)) {
        return false;
      }

      const durationFilter = activeFilters.duration ?? [];
      if (durationFilter.length > 0) {
        const weeks = parseTrackDurationWeeks(track.duration);
        if (!durationFilter.some((range) => matchTrackDurationRange(weeks, range))) return false;
      }

      const certificationFilter = activeFilters.includesCertification ?? [];
      if (certificationFilter.length > 0) {
        const label = track.certification ? "Yes" : "No";
        if (!certificationFilter.includes(label)) return false;
      }

      const prerequisitesFilter = activeFilters.prerequisites ?? [];
      if (prerequisitesFilter.length > 0 && !prerequisitesFilter.includes(track.prerequisites)) {
        return false;
      }

      return true;
    });
  }, [normalizedQuery, selectedFilters]);

  const filteredReviews = useMemo(() => {
    const activeFilters = selectedFilters;
    return reviews.filter((review) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          review.courseName,
          review.reviewer.name,
          review.title ?? "",
          review.text,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      if (!matchesSearch) return false;

      const contentTypeFilter = activeFilters.contentType ?? [];
      if (contentTypeFilter.length > 0) {
        const isTrackReview = learningTracks.some((track) => track.id === review.courseId);
        const reviewType = isTrackReview ? "Learning Tracks" : "Courses";
        if (!contentTypeFilter.includes(reviewType)) return false;
      }

      return true;
    });
  }, [normalizedQuery, selectedFilters]);

  const parseRelativeDateToDays = (value: string) => {
    const normalized = value.toLowerCase().trim();
    const match = normalized.match(/(\d+)\s+(day|week|month|year)s?\s+ago/);
    if (!match) return Number.MAX_SAFE_INTEGER;

    const amount = Number(match[1]);
    const unit = match[2];
    if (unit === "day") return amount;
    if (unit === "week") return amount * 7;
    if (unit === "month") return amount * 30;
    return amount * 365;
  };

  const sortedCourses = useMemo(() => {
    const list = [...filteredCourses];
    if (sortBy === "title-asc") return list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "rating-desc") return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "duration-asc") {
      return list.sort((a, b) => parseHours(a.duration) - parseHours(b.duration));
    }
    return list;
  }, [filteredCourses, sortBy]);

  const sortedTracks = useMemo(() => {
    const list = [...filteredTracks];
    if (sortBy === "title-asc") return list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "courses-desc") return list.sort((a, b) => b.courses - a.courses);
    if (sortBy === "duration-asc") {
      return list.sort(
        (a, b) => parseTrackDurationWeeks(a.duration) - parseTrackDurationWeeks(b.duration)
      );
    }
    return list;
  }, [filteredTracks, sortBy]);

  const sortedReviews = useMemo(() => {
    const list = [...filteredReviews];
    if (sortBy === "helpful-desc") return list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    if (sortBy === "rating-desc") return list.sort((a, b) => b.rating - a.rating);
    return list.sort((a, b) => parseRelativeDateToDays(a.date) - parseRelativeDateToDays(b.date));
  }, [filteredReviews, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedFilters, sortBy]);

  const getActiveSortedCount = () => {
    switch (activeTab) {
      case "courses":
        return sortedCourses.length;
      case "learning-tracks":
        return sortedTracks.length;
      case "reviews":
        return sortedReviews.length;
      default:
        return 0;
    }
  };

  const totalPages = Math.max(1, Math.ceil(getActiveSortedCount() / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);

  const pagedCourses = useMemo(
    () => sortedCourses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [sortedCourses, page]
  );
  const pagedTracks = useMemo(
    () => sortedTracks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [sortedTracks, page]
  );
  const pagedReviews = useMemo(
    () => sortedReviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [sortedReviews, page]
  );

  const sortOptions = (() => {
    if (activeTab === "courses") {
      return [
        { value: "recommended", label: "Recommended" },
        { value: "title-asc", label: "Title A-Z" },
        { value: "rating-desc", label: "Highest Rated" },
        { value: "duration-asc", label: "Shortest Duration" },
      ];
    }

    if (activeTab === "learning-tracks") {
      return [
        { value: "recommended", label: "Recommended" },
        { value: "title-asc", label: "Title A-Z" },
        { value: "courses-desc", label: "Most Courses" },
        { value: "duration-asc", label: "Shortest Duration" },
      ];
    }

    return [
      { value: "recent", label: "Most Recent" },
      { value: "helpful-desc", label: "Most Helpful" },
      { value: "rating-desc", label: "Highest Rated" },
    ];
  })();

  const getCurrentFilters = () => {
    switch (activeTab) {
      case "courses":
        return coursesFilters;
      case "learning-tracks":
        return tracksFilters;
      case "reviews":
        return reviewsFilters;
      default:
        return {};
    }
  };

  const getResultCount = () => {
    switch (activeTab) {
      case "courses":
        return filteredCourses.length;
      case "learning-tracks":
        return filteredTracks.length;
      case "reviews":
        return filteredReviews.length;
      default:
        return 0;
    }
  };

  const getResultLabel = () => {
    switch (activeTab) {
      case "courses":
        return "courses";
      case "learning-tracks":
        return "learning tracks";
      case "reviews":
        return "reviews";
      default:
        return "items";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Marketplace Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Learning Center</span>
          </nav>

          {/* Phase Badge */}
          <span className="inline-block bg-phase-discern-bg text-phase-discern px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
            Discern
          </span>

          {/* Title & Description */}
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">
            DTMP Learning Center
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mb-4">
            Develop transformation expertise through structured learning programs. Master DT 2.0 concepts, DBP frameworks, and enterprise transformation practices through courses, learning tracks, and peer reviews.
          </p>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              25 Total Resources
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Enterprise-wide Access
            </span>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-2 overflow-x-auto flex justify-start px-4 lg:px-8">
              <TabsTrigger
                value="courses"
                className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                Courses & Curricula
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "courses" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                  {courses.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="learning-tracks"
                className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                Learning Tracks
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "learning-tracks" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                  {learningTracks.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                Reviews
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === "reviews" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                  {reviews.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={tabPlaceholders[activeTab]}
        />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto flex">
          {/* Filter Panel */}
          {(showDesktopFilters || filterOpen) && (
            <FilterPanel
              filters={getCurrentFilters()}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
              onDesktopToggle={() => setShowDesktopFilters((prev) => !prev)}
            />
          )}

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Result Count */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {getResultCount() === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(page * ITEMS_PER_PAGE, getResultCount())}
                </span>{" "}
                of <span className="font-semibold text-foreground">{getResultCount()}</span>{" "}
                {getResultLabel()}
              </p>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Sort
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="border border-gray-300 rounded-md bg-white px-2 py-1 text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!showDesktopFilters && (
                  <button
                    type="button"
                    onClick={() => setShowDesktopFilters(true)}
                    className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-orange-700 hover:text-orange-800"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                )}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="px-4 lg:px-8 py-6">
              <TabsContent value="courses" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigate(`/marketplaces/learning-center/courses/${course.id}`)}
                    />
                  ))}
                </div>
                {sortedCourses.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-6">
                    No courses match your current search and filters.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="learning-tracks" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedTracks.map((track) => (
                    <LearningTrackCard
                      key={track.id}
                      track={track}
                      onClick={() => navigate(`/marketplaces/learning-center/learning-tracks/${track.id}`)}
                    />
                  ))}
                </div>
                {sortedTracks.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-6">
                    No learning tracks match your current search and filters.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pagedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                {sortedReviews.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-6">
                    No reviews match your current search and filters.
                  </p>
                )}
              </TabsContent>

              {getResultCount() > 0 && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white disabled:opacity-50"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((pageNumber) =>
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        Math.abs(pageNumber - page) <= 1
                      )
                      .map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-1.5 text-sm border rounded-md ${
                            pageNumber === page
                              ? "border-orange-600 bg-orange-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tabs>

      {/* Mobile Filter Button */}
      <MobileFilterButton onClick={() => setFilterOpen(true)} />

      <Footer />
    </div>
  );
}
