import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  Download,
  ExternalLink,
  ArrowRight,
  Users,
  FileText,
  Image,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/learningCenter/CourseCard";
import { LearningTrackCard } from "@/components/learningCenter/LearningTrackCard";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { courses, Course } from "@/data/learningCenter/courses";
import { learningTracks, LearningTrack } from "@/data/learningCenter/learningTracks";
import { reviews, Review } from "@/data/learningCenter/reviews";

type DetailTab = "about" | "eligibility" | "process" | "documents" | "provider";

const levelColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
  Executive: "bg-orange-100 text-orange-700",
};

const gradientColors = [
  "from-blue-400 to-purple-500",
  "from-green-400 to-blue-500",
  "from-orange-400 to-pink-500",
  "from-purple-400 to-pink-500",
  "from-teal-400 to-blue-500",
  "from-rose-400 to-orange-500",
];

export default function LearningCenterDetailPage() {
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>("about");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Find the item based on tab type
  const getCourse = (): Course | undefined => courses.find((c) => c.id === cardId);
  const getTrack = (): LearningTrack | undefined => learningTracks.find((t) => t.id === cardId);
  const getReview = (): Review | undefined => reviews.find((r) => r.id === cardId);

  const item = tab === "courses" ? getCourse() : tab === "learning-tracks" ? getTrack() : getReview();

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Item not found</h1>
          <Button onClick={() => navigate("/marketplaces/learning-center")}>
            Back to Learning Center
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isCourse = tab === "courses";
  const isTrack = tab === "learning-tracks";
  const course = isCourse ? (item as Course) : null;
  const track = isTrack ? (item as LearningTrack) : null;

  const title = isCourse ? course?.title : isTrack ? track?.title : (item as Review).courseName;
  const description = isCourse ? course?.description : isTrack ? track?.description : (item as Review).text;

  // Get related items
  const getRelatedCourses = () => {
    if (!course) return [];
    return courses.filter((c) => c.id !== course.id && (c.category === course.category || c.level === course.level)).slice(0, 3);
  };

  const getRelatedTracks = () => {
    if (!track) return [];
    return learningTracks.filter((t) => t.id !== track.id && t.focusArea === track.focusArea).slice(0, 3);
  };

  const handleEnroll = () => {
    setShowLoginModal(true);
  };

  const gradientIndex = cardId ? cardId.length % gradientColors.length : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/learning-center" className="hover:text-foreground transition-colors">
              Learning Center
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to={`/marketplaces/learning-center?tab=${tab}`} className="hover:text-foreground transition-colors capitalize">
              {tab?.replace("-", " ")}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground line-clamp-1">{title}</span>
          </nav>
        </div>
      </div>

      {/* Detail Header */}
      <section className="bg-white border-b border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Provider Info */}
          {isCourse && course?.provider && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="text-gray-500">Provided by</span>
              <span className="text-foreground font-medium">{course.provider.name}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">{title}</h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {isCourse && course && (
              <>
                <Badge className={`${levelColors[course.level]} border-0`}>{course.level}</Badge>
                <Badge className="bg-purple-100 text-purple-700 border-0">{course.category}</Badge>
                {course.certification && (
                  <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Certification Available
                  </Badge>
                )}
              </>
            )}
            {isTrack && track && (
              <>
                <Badge className="bg-blue-100 text-blue-700 border-0">{track.role}</Badge>
                <Badge className="bg-purple-100 text-purple-700 border-0">{track.focusArea}</Badge>
                {track.certification && (
                  <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Certification Available
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Rating */}
          {isCourse && course?.rating && (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(course.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-base text-muted-foreground font-medium">
                {course.rating} ({course.students} students)
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DetailTab)} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {["about", "eligibility", "process", "documents", "provider"].map((tabName) => (
                <TabsTrigger
                  key={tabName}
                  value={tabName}
                  className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent capitalize"
                >
                  {tabName === "provider" ? "Provider Info" : tabName}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Tab Content */}
            <div className="flex-1 min-w-0">
              <TabsContent value="about" className="mt-0">
                <div className="space-y-8">
                  {/* Introduction */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {isCourse ? "Course Overview" : "Track Overview"}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {(isCourse ? course?.introduction : track?.introduction) || description}
                    </p>
                  </div>

                  {/* Highlights */}
                  {(isCourse ? course?.highlights : track?.highlights) && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Key Highlights</h3>
                      <ul className="space-y-3">
                        {(isCourse ? course?.highlights : track?.highlights)?.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learning Outcomes */}
                  {(isCourse ? course?.learningOutcomes : track?.learningOutcomes) && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">What You'll Learn</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {(isCourse ? course?.learningOutcomes : track?.learningOutcomes)?.map((outcome, idx) => (
                          <li key={idx}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {(isCourse ? course?.prerequisites : track?.prerequisites) && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Prerequisites</h3>
                      <p className="text-muted-foreground">
                        {isCourse ? course?.prerequisites : track?.prerequisites}
                      </p>
                    </div>
                  )}

                  {/* Course Modules */}
                  {isCourse && course?.modules && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Course Outline</h3>
                      <div className="space-y-4">
                        {course.modules.map((module, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="text-xs font-semibold text-orange-600 uppercase">
                                  Module {idx + 1}
                                </span>
                                <h4 className="text-lg font-semibold text-foreground">{module.title}</h4>
                              </div>
                              <span className="text-sm text-muted-foreground">{module.duration}</span>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground pl-4">
                              {module.lessons.map((lesson, lessonIdx) => (
                                <li key={lessonIdx}>{lesson}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Track Course List */}
                  {isTrack && track?.courseList && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Courses in This Track</h3>
                      <div className="space-y-3">
                        {track.courseList.map((courseItem, idx) => (
                          <div
                            key={courseItem.id}
                            className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => navigate(`/marketplaces/learning-center/courses/${courseItem.id}`)}
                          >
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{courseItem.title}</h4>
                              <span className="text-sm text-muted-foreground">{courseItem.duration}</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="eligibility" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Who Should Take This {isCourse ? "Course" : "Track"}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {(isCourse ? course?.targetAudience : track?.targetAudience) ||
                        "This learning experience is designed for professionals looking to develop their transformation skills."}
                    </p>
                  </div>

                  {(isCourse ? course?.recommendedRoles : track?.recommendedRoles) && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Recommended For</h3>
                      <div className="flex flex-wrap gap-2">
                        {(isCourse ? course?.recommendedRoles : track?.recommendedRoles)?.map((role, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg"
                          >
                            <Users className="w-4 h-4" />
                            {role}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(isCourse ? course?.requirements : track?.requirements) && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {(isCourse ? course?.requirements : track?.requirements)?.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="process" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">How It Works</h2>
                    <div className="space-y-6">
                      {[
                        { title: "Enroll", description: "Click 'Enroll Now' and complete your registration" },
                        { title: "Learn", description: "Work through the content at your own pace" },
                        { title: "Practice", description: "Complete hands-on exercises and assessments" },
                        { title: "Certify", description: "Earn your certificate upon successful completion" },
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Timeline</h3>
                    <p className="text-muted-foreground">
                      {(isCourse ? course?.timeline : track?.timeline) ||
                        "Complete the course at your own pace. Most learners finish within 2-4 weeks."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Assessment & Certification</h3>
                    <p className="text-muted-foreground">
                      {(isCourse ? course?.assessmentInfo : track?.assessmentInfo) ||
                        "Complete all modules and pass the final assessment to earn your certificate."}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      {isCourse ? "Course Materials" : "Track Materials"}
                    </h2>
                    {course?.documents ? (
                      <div className="grid gap-4">
                        {course.documents.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                          >
                            <FileText className="w-8 h-8 text-gray-400" />
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-foreground">{doc.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {doc.type} • {doc.size}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon" className="text-orange-600 hover:text-orange-700">
                              <Download className="w-5 h-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Materials will be available after enrollment.
                      </p>
                    )}
                  </div>

                  {course?.resources && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Additional Resources</h3>
                      <ul className="space-y-2">
                        {course.resources.map((resource, idx) => (
                          <li key={idx}>
                            <a
                              href={resource.url}
                              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="provider" className="mt-0">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      About {course?.provider?.name || "the Provider"}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {course?.providerInfo?.description ||
                        "This content is provided by our trusted learning partners to ensure high-quality educational experiences."}
                    </p>
                  </div>

                  {course?.providerInfo?.credentials && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Credentials</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {course.providerInfo.credentials.map((cred, idx) => (
                          <li key={idx}>{cred}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course?.providerInfo?.otherCourses && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Other Offerings</h3>
                      <div className="space-y-3">
                        {course.providerInfo.otherCourses.map((otherCourse, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h4 className="font-semibold text-foreground">{otherCourse.title}</h4>
                            <p className="text-sm text-muted-foreground">{otherCourse.brief}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>

            {/* Right Sidebar */}
            <aside className="lg:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-6">
                  {isCourse ? "Course Details" : "Track Details"}
                </h3>

                {/* Details Table */}
                <table className="w-full mb-6">
                  <tbody>
                    {isCourse && course && (
                      <>
                        <tr className="border-b border-gray-100">
                          <td className="text-sm text-muted-foreground py-3 pr-4">Format</td>
                          <td className="text-sm font-medium text-foreground py-3">{course.format}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="text-sm text-muted-foreground py-3 pr-4">Duration</td>
                          <td className="text-sm font-medium text-foreground py-3">{course.duration}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="text-sm text-muted-foreground py-3 pr-4">Lessons</td>
                          <td className="text-sm font-medium text-foreground py-3">{course.lessons} modules</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-muted-foreground py-3 pr-4">Level</td>
                          <td className="text-sm font-medium text-foreground py-3">{course.level}</td>
                        </tr>
                      </>
                    )}
                    {isTrack && track && (
                      <>
                        <tr className="border-b border-gray-100">
                          <td className="text-sm text-muted-foreground py-3 pr-4">Courses</td>
                          <td className="text-sm font-medium text-foreground py-3">{track.courses} courses</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="text-sm text-muted-foreground py-3 pr-4">Duration</td>
                          <td className="text-sm font-medium text-foreground py-3">{track.duration}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="text-sm text-muted-foreground py-3 pr-4">Focus Area</td>
                          <td className="text-sm font-medium text-foreground py-3">{track.focusArea}</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-muted-foreground py-3 pr-4">Prerequisites</td>
                          <td className="text-sm font-medium text-foreground py-3">{track.prerequisites}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

                {/* Inclusions */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {((isCourse ? course?.inclusions : track?.inclusions) || [
                      "Video lessons",
                      "Hands-on exercises",
                      "Certificate of completion",
                      "Lifetime access",
                      "Downloadable resources",
                    ]).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleEnroll}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold transition-all hover:shadow-xl"
                >
                  Enroll Now
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </Tabs>

      {/* Related Offerings */}
      {(isCourse ? getRelatedCourses().length > 0 : getRelatedTracks().length > 0) && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related {isCourse ? "Courses" : "Learning Tracks"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isCourse
                ? getRelatedCourses().map((relatedCourse) => (
                    <CourseCard
                      key={relatedCourse.id}
                      course={relatedCourse}
                      onClick={() => navigate(`/marketplaces/learning-center/courses/${relatedCourse.id}`)}
                    />
                  ))
                : getRelatedTracks().map((relatedTrack) => (
                    <LearningTrackCard
                      key={relatedTrack.id}
                      track={relatedTrack}
                      onClick={() => navigate(`/marketplaces/learning-center/learning-tracks/${relatedTrack.id}`)}
                    />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "learning-center",
          tab: tab || "courses",
          cardId: cardId || "",
          serviceName: title || "",
          action: "enroll",
        }}
      />

      <Footer />
    </div>
  );
}
