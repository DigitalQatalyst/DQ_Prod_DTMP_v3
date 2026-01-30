import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, BookOpen, Users } from "lucide-react";
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

const tabPlaceholders: Record<TabType, string> = {
  courses: "Search courses, topics, or instructors...",
  "learning-tracks": "Search learning tracks or focus areas...",
  reviews: "Search reviews or courses...",
};

export default function LearningCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "courses";
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const handleTabChange = (value: string) => {
    const tab = value as TabType;
    setActiveTab(tab);
    setSearchParams({ tab });
    setSelectedFilters({});
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
  };

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
        return courses.length;
      case "learning-tracks":
        return learningTracks.length;
      case "reviews":
        return reviews.length;
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
          <FilterPanel
            filters={getCurrentFilters()}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Result Count */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 lg:px-8 py-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{getResultCount()}</span> {getResultLabel()}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="px-4 lg:px-8 py-6">
              <TabsContent value="courses" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigate(`/marketplaces/learning-center/courses/${course.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="learning-tracks" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {learningTracks.map((track) => (
                    <LearningTrackCard
                      key={track.id}
                      track={track}
                      onClick={() => navigate(`/marketplaces/learning-center/learning-tracks/${track.id}`)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </TabsContent>
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
