import { useState } from "react";
import { CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserOverviewTab from "@/components/learningCenter/stage2/user/UserOverviewTab";
import UserModulesTab from "@/components/learningCenter/stage2/user/UserModulesTab";
import UserProgressTab from "@/components/learningCenter/stage2/user/UserProgressTab";
import UserResourcesTab from "@/components/learningCenter/stage2/user/UserResourcesTab";
import UserCertificateTab from "@/components/learningCenter/stage2/user/UserCertificateTab";
import UserFeedbackTab from "@/components/learningCenter/stage2/user/UserFeedbackTab";
import AdminOverviewTab from "@/components/learningCenter/stage2/admin/AdminOverviewTab";
import AdminEnrollmentsTab from "@/components/learningCenter/stage2/admin/AdminEnrollmentsTab";
import AdminPerformanceTab from "@/components/learningCenter/stage2/admin/AdminPerformanceTab";
import AdminContentTab from "@/components/learningCenter/stage2/admin/AdminContentTab";
import AdminSettingsTab from "@/components/learningCenter/stage2/admin/AdminSettingsTab";

type LearningUserTab = "overview" | "modules" | "progress" | "resources" | "certificate" | "feedback";
type LearningAdminTab = "overview" | "enrollments" | "performance" | "content" | "settings";

interface LearningCourseNavItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: string;
  progress: number;
}

interface LearningWorkspaceSidebarProps {
  viewMode: "user" | "admin";
  learningSubServices: LearningCourseNavItem[];
  activeSubService: string | null;
  onSelectSubService: (subServiceId: string) => void;
}

export function LearningWorkspaceSidebar({
  viewMode,
  learningSubServices,
  activeSubService,
  onSelectSubService,
}: LearningWorkspaceSidebarProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {viewMode === "admin" ? "All Courses" : "My Courses"}
        </h3>
        <div className="space-y-2">
          {learningSubServices.map((course) => {
            const Icon = course.icon;
            const statusColor =
              course.status === "completed"
                ? "text-green-600"
                : course.status === "in-progress"
                  ? "text-blue-600"
                  : "text-gray-400";
            return (
              <button
                key={course.id}
                onClick={() => onSelectSubService(course.id)}
                className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                  activeSubService === course.id
                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusColor}`} />
                <div className="text-left flex-1">
                  <div className="font-medium">{course.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{course.description}</div>
                  {course.progress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-orange-600 h-1.5 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface LearningWorkspaceMainProps {
  viewMode: "user" | "admin";
  activeTrackSnapshot?: {
    trackTitle: string;
    requiredCompleted: number;
    requiredTotal: number;
    progressPercent: number;
    nextRequiredCourseTitle: string | null;
    nextStage2CourseId: string | null;
  };
  trackMilestoneNotifications: Array<{ id: string; message: string; timestamp: string }>;
  onContinueTrack: () => void;
  activeLearningUserTab: LearningUserTab;
  setActiveLearningUserTab: (tab: LearningUserTab) => void;
  activeLearningAdminTab: LearningAdminTab;
  setActiveLearningAdminTab: (tab: LearningAdminTab) => void;
  canAccessAdminView: boolean;
  selectedLearningCourse?: unknown;
  activeTrackAnalytics?: unknown;
  adminViewData: any;
  userViewData: any;
  onCompleteLesson: (moduleId: string, lessonId: string) => void;
  onQuizSubmit: (moduleId: string, lessonId: string, score: number, passThreshold: number) => void;
  activePathCertificate?: any;
  adminDraftSettings: any;
  onAdminDraftSettingsChange: (next: any) => void;
  adminDeleteRequested: boolean;
  onAdminDeleteRequestedChange: (value: boolean) => void;
  adminPendingChangeCount: number;
  onSubmitSettingsForReview: () => void;
  onSubmitContentForReview: (description: string) => void;
  escalationMessage?: string | null;
  settingsDiffs: Array<{ label: string; before: string; after: string }>;
  onViewInTOOffice: () => void;
}

export function LearningWorkspaceMain({
  viewMode,
  activeTrackSnapshot,
  trackMilestoneNotifications,
  onContinueTrack,
  activeLearningUserTab,
  setActiveLearningUserTab,
  activeLearningAdminTab,
  setActiveLearningAdminTab,
  canAccessAdminView,
  selectedLearningCourse,
  activeTrackAnalytics,
  adminViewData,
  userViewData,
  onCompleteLesson,
  onQuizSubmit,
  activePathCertificate,
  adminDraftSettings,
  onAdminDraftSettingsChange,
  adminDeleteRequested,
  onAdminDeleteRequestedChange,
  adminPendingChangeCount,
  onSubmitSettingsForReview,
  onSubmitContentForReview,
  escalationMessage,
  settingsDiffs,
  onViewInTOOffice,
}: LearningWorkspaceMainProps) {
  const [trackExpanded, setTrackExpanded] = useState(false);

  return (
    <div className="h-full">
      <div className="p-6 space-y-6">
        {viewMode === "user" && activeTrackSnapshot && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Always-visible header row */}
            <button
              onClick={() => setTrackExpanded((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-left min-w-0">
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold leading-none mb-0.5">
                    Active Learning Track
                  </p>
                  <p className="text-sm font-semibold text-primary-navy truncate">
                    {activeTrackSnapshot.trackTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-navy leading-none">
                    {activeTrackSnapshot.progressPercent}%
                  </p>
                  <p className="text-xs text-gray-500">Track Progress</p>
                </div>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={(e) => { e.stopPropagation(); onContinueTrack(); }}
                  disabled={!activeTrackSnapshot.nextStage2CourseId}
                >
                  Continue Track
                </Button>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${trackExpanded ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Collapsible section */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                trackExpanded ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                {/* Progress bar */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    {activeTrackSnapshot.requiredCompleted}/{activeTrackSnapshot.requiredTotal} required courses complete
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${activeTrackSnapshot.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Next: {activeTrackSnapshot.nextRequiredCourseTitle ?? "All required courses completed"}
                  </p>
                </div>

                {/* Milestones */}
                {trackMilestoneNotifications.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Path Milestones
                    </p>
                    {trackMilestoneNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-base font-semibold text-primary-navy">
              {viewMode === "admin" ? "Admin Workspace" : "Learner Workspace"}
            </h3>
          </div>

          {viewMode === "admin" ? (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["overview", "Overview"],
                  ["enrollments", "Enrollments"],
                  ["performance", "Performance"],
                  ["content", "Content"],
                  ["settings", "Settings"],
                ] as Array<[LearningAdminTab, string]>
              ).map(([tabKey, tabLabel]) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveLearningAdminTab(tabKey)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeLearningAdminTab === tabKey
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["overview", "Overview"],
                  ["modules", "Modules"],
                  ["progress", "Progress"],
                  ["resources", "Resources"],
                  ["certificate", "Certificate"],
                  ["feedback", "Feedback"],
                ] as Array<[LearningUserTab, string]>
              ).map(([tabKey, tabLabel]) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveLearningUserTab(tabKey)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeLearningUserTab === tabKey
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tabLabel}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {viewMode === "admin" ? (
            !canAccessAdminView ? (
              <div className="bg-white border border-red-200 rounded-xl p-6">
                <h4 className="text-base font-semibold text-red-700">Access Restricted</h4>
                <p className="text-sm text-red-600 mt-1">
                  You do not have permission to access manager/admin analytics.
                </p>
              </div>
            ) : !selectedLearningCourse ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-base font-semibold text-primary-navy">No Course Selected</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a course in Column 2 to load admin analytics.
                </p>
              </div>
            ) : (
              <>
                {activeLearningAdminTab === "overview" && (
                  <>
                    {!activeTrackAnalytics && (
                      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                          Track analytics are unavailable for this course. Overview metrics are currently
                          course-level only.
                        </p>
                      </div>
                    )}
                    <AdminOverviewTab
                      data={adminViewData}
                      trackAnalytics={activeTrackAnalytics as any}
                      onViewAlerts={() => setActiveLearningAdminTab("enrollments")}
                    />
                  </>
                )}
                {activeLearningAdminTab === "enrollments" && (
                  <AdminEnrollmentsTab students={adminViewData.students} courseId={adminViewData.courseId} />
                )}
                {activeLearningAdminTab === "performance" && (
                  <AdminPerformanceTab data={adminViewData} />
                )}
                {activeLearningAdminTab === "content" && (
                  <AdminContentTab
                    modules={adminViewData.contentModules}
                    resources={adminViewData.contentResources}
                    onSubmitForReview={onSubmitContentForReview}
                    onViewInTOOffice={onViewInTOOffice}
                  />
                )}
                {activeLearningAdminTab === "settings" && (
                  <AdminSettingsTab
                    settings={adminDraftSettings}
                    onChange={onAdminDraftSettingsChange}
                    deleteRequested={adminDeleteRequested}
                    onDeleteRequestedChange={onAdminDeleteRequestedChange}
                    pendingChangeCount={adminPendingChangeCount}
                    onSubmitForReview={onSubmitSettingsForReview}
                    escalationMessage={escalationMessage}
                    settingsDiffs={settingsDiffs}
                    onViewInTOOffice={onViewInTOOffice}
                  />
                )}
              </>
            )
          ) : (
            <>
              {activeLearningUserTab === "overview" && <UserOverviewTab data={userViewData} />}
              {activeLearningUserTab === "modules" && (
                <UserModulesTab
                  courseId={userViewData.courseId}
                  modules={userViewData.modules}
                  quizConfigs={userViewData.quizConfigs}
                  quizAttemptsByModule={Object.fromEntries(
                    userViewData.quizResults.map((quiz: any) => [quiz.moduleId, quiz.attempts])
                  )}
                  onCompleteLesson={onCompleteLesson}
                  onQuizSubmit={onQuizSubmit}
                />
              )}
              {activeLearningUserTab === "progress" && <UserProgressTab data={userViewData} />}
              {activeLearningUserTab === "resources" && (
                <UserResourcesTab resources={userViewData.resources} />
              )}
              {activeLearningUserTab === "certificate" && (
                <UserCertificateTab data={userViewData} pathCertificate={activePathCertificate} />
              )}
              {activeLearningUserTab === "feedback" && (
                <UserFeedbackTab
                  courseId={userViewData.courseId}
                  courseTitle={userViewData.courseTitle}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
