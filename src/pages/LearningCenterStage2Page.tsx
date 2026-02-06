import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, GraduationCap, BookOpen, FolderOpen, BarChart3, Award, LayoutDashboard, Users, TrendingUp, Settings, FileEdit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ViewToggle from "@/components/learningCenter/stage2/ViewToggle";
import { userCourseData, adminCourseData } from "@/data/learningCenter/stage2";

// User view tab components
import UserOverviewTab from "@/components/learningCenter/stage2/user/UserOverviewTab";
import UserModulesTab from "@/components/learningCenter/stage2/user/UserModulesTab";
import UserResourcesTab from "@/components/learningCenter/stage2/user/UserResourcesTab";
import UserProgressTab from "@/components/learningCenter/stage2/user/UserProgressTab";
import UserCertificateTab from "@/components/learningCenter/stage2/user/UserCertificateTab";

// Admin view tab components
import AdminOverviewTab from "@/components/learningCenter/stage2/admin/AdminOverviewTab";
import AdminEnrollmentsTab from "@/components/learningCenter/stage2/admin/AdminEnrollmentsTab";
import AdminPerformanceTab from "@/components/learningCenter/stage2/admin/AdminPerformanceTab";
import AdminContentTab from "@/components/learningCenter/stage2/admin/AdminContentTab";
import AdminSettingsTab from "@/components/learningCenter/stage2/admin/AdminSettingsTab";

const userTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "modules", label: "Modules", icon: BookOpen },
  { id: "resources", label: "Resources", icon: FolderOpen },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "certificate", label: "Certificate", icon: Award },
];

const adminTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "enrollments", label: "Enrollments", icon: Users },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "content", label: "Content Management", icon: FileEdit },
  { id: "settings", label: "Settings", icon: Settings },
];

const LearningCenterStage2Page = () => {
  const { courseId, view } = useParams<{ courseId: string; view: string }>();
  const currentView = view === "admin" ? "admin" : "user";
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = currentView === "user" ? userTabs : adminTabs;
  const courseTitle = userCourseData.courseTitle;

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
            <Link
              to="/marketplaces/learning-center"
              className="hover:text-foreground transition-colors"
            >
              Learning Center
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              to="/marketplaces/learning-center?tab=courses"
              className="hover:text-foreground transition-colors"
            >
              Courses
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="hover:text-foreground transition-colors">
              {courseTitle}
            </span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">
              {currentView === "user" ? "My Course" : "Admin Dashboard"}
            </span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-orange-600" />
                </div>
                <Badge className="bg-phase-discern-bg text-phase-discern border-0">
                  Discern Phase
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  Beginner
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-2">
                {courseTitle}
              </h1>
              <p className="text-muted-foreground">
                {currentView === "user"
                  ? `${userCourseData.instructorName} \u2022 ${userCourseData.institution}`
                  : `Course Administration \u2022 ${adminCourseData.stats.totalEnrollments.toLocaleString()} students enrolled`}
              </p>
            </div>
            <div className="flex-shrink-0">
              <ViewToggle currentView={currentView} courseId={courseId || "dt-fundamentals"} />
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
                >
                  <tab.icon className="w-4 h-4 mr-2 inline-block" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {currentView === "user" ? (
            <>
              <TabsContent value="overview" className="mt-0">
                <UserOverviewTab data={userCourseData} />
              </TabsContent>
              <TabsContent value="modules" className="mt-0">
                <UserModulesTab modules={userCourseData.modules} />
              </TabsContent>
              <TabsContent value="resources" className="mt-0">
                <UserResourcesTab resources={userCourseData.resources} />
              </TabsContent>
              <TabsContent value="progress" className="mt-0">
                <UserProgressTab data={userCourseData} />
              </TabsContent>
              <TabsContent value="certificate" className="mt-0">
                <UserCertificateTab data={userCourseData} />
              </TabsContent>
            </>
          ) : (
            <>
              <TabsContent value="overview" className="mt-0">
                <AdminOverviewTab data={adminCourseData} />
              </TabsContent>
              <TabsContent value="enrollments" className="mt-0">
                <AdminEnrollmentsTab students={adminCourseData.students} />
              </TabsContent>
              <TabsContent value="performance" className="mt-0">
                <AdminPerformanceTab data={adminCourseData} />
              </TabsContent>
              <TabsContent value="content" className="mt-0">
                <AdminContentTab
                  modules={adminCourseData.contentModules}
                  resources={adminCourseData.contentResources}
                />
              </TabsContent>
              <TabsContent value="settings" className="mt-0">
                <AdminSettingsTab settings={adminCourseData.settings} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>

      <Footer />
    </div>
  );
};

export default LearningCenterStage2Page;
