import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  HelpCircle,
  Code,
  Clock,
  Play,
  RotateCcw,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type {
  CourseModule,
  Lesson,
  ModuleStatus,
  QuizRuntimeConfig,
} from "@/data/learningCenter/stage2/types";
import QuizPlayer from "./QuizPlayer";

interface UserModulesTabProps {
  courseId?: string;
  modules: CourseModule[];
  quizConfigs?: QuizRuntimeConfig[];
  quizAttemptsByModule?: Record<string, number>;
  onCompleteLesson?: (moduleId: string, lessonId: string) => void;
  onQuizSubmit?: (
    moduleId: string,
    lessonId: string,
    score: number,
    passThreshold: number
  ) => void;
}

interface LessonIntegrationLink {
  id: string;
  label: string;
  description: string;
  to: string;
}

const getLessonIntegrationLinks = (
  courseId: string | undefined,
  moduleTitle: string,
  lessonTitle: string
): LessonIntegrationLink[] => {
  const context = `${courseId ?? ""} ${moduleTitle} ${lessonTitle}`.toLowerCase();
  const links: LessonIntegrationLink[] = [];

  if (
    context.includes("api") ||
    context.includes("architecture") ||
    context.includes("integration")
  ) {
    links.push({
      id: "knowledge-link",
      label: "Open Knowledge Center Article",
      description: "Review a related architecture reference before continuing this lesson.",
      to: "/stage2/knowledge/library/api-first-patterns?source=learning-center",
    });
  }

  if (
    context.includes("portfolio") ||
    context.includes("rationaliz") ||
    context.includes("application assessment")
  ) {
    links.push({
      id: "portfolio-link",
      label: "Launch Portfolio Management Tool",
      description: "Practice this exercise using the portfolio sandbox workspace.",
      to: "/stage2/portfolio-management?tab=application-portfolio&mode=training&source=learning-center",
    });
  }

  if (
    context.includes("stage gate") ||
    context.includes("governance") ||
    context.includes("lifecycle")
  ) {
    links.push({
      id: "lifecycle-link",
      label: "Open Lifecycle Management (Training)",
      description: "Submit a practice stage-gate workflow in training mode.",
      to: "/stage2/lifecycle-management?mode=training&source=learning-center",
    });
  }

  return links;
};

const statusConfig: Record<
  ModuleStatus,
  { label: string; color: string; icon: typeof CheckCircle }
> = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: PlayCircle,
  },
  available: {
    label: "Available",
    color: "bg-amber-100 text-amber-700",
    icon: PlayCircle,
  },
  locked: {
    label: "Locked",
    color: "bg-gray-100 text-gray-500",
    icon: Lock,
  },
};

const lessonTypeIcon: Record<string, typeof Video> = {
  video: Video,
  reading: FileText,
  quiz: HelpCircle,
  exercise: Code,
  discussion: FileText,
};

const LessonItem = ({
  lesson,
  moduleStatus,
}: {
  lesson: Lesson;
  moduleStatus: ModuleStatus;
}) => {
  const TypeIcon = lessonTypeIcon[lesson.type] || FileText;
  const isLocked = moduleStatus === "locked" || lesson.status === "locked";
  const isCompleted = lesson.status === "completed";

  return (
    <div
      className={`flex items-center gap-3 py-3 px-4 rounded-lg ${
        isLocked ? "opacity-60" : "hover:bg-gray-50"
      }`}
    >
      {/* Status Icon */}
      {isCompleted ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : isLocked ? (
        <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
      ) : lesson.status === "in-progress" ? (
        <PlayCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
      )}

      {/* Type Icon */}
      <TypeIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            isLocked ? "text-gray-400" : "text-foreground"
          }`}
        >
          {lesson.title}
        </p>
        {lesson.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {lesson.description}
          </p>
        )}
      </div>

      {/* Duration */}
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {lesson.duration}
      </span>

      {/* Status indicator */}
      {isCompleted && lesson.completedDate && (
        <span className="text-xs text-green-600 whitespace-nowrap hidden sm:block">
          &#10003;
        </span>
      )}
    </div>
  );
};

const VideoPlayerPlaceholder = ({ title }: { title: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4">
    <h4 className="text-sm font-semibold text-primary-navy mb-3">
      {title}
    </h4>
    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Play className="w-8 h-8 text-white ml-1" />
        </div>
        <p className="text-white/70 text-sm">Video content will play here</p>
      </div>
    </div>
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">1080p</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          Mark as Complete
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          Next &rarr;
        </Button>
      </div>
    </div>
  </div>
);

const UserModulesTab = ({
  courseId,
  modules,
  quizConfigs = [],
  quizAttemptsByModule = {},
  onCompleteLesson,
  onQuizSubmit,
}: UserModulesTabProps) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(
    modules.find((m) => m.status === "in-progress")?.id || null
  );
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeQuizKey, setActiveQuizKey] = useState<string | null>(null);

  const resumeModule = useMemo(
    () =>
      modules.find((module) => module.status === "in-progress") ??
      modules.find((module) => module.status === "available"),
    [modules]
  );

  useEffect(() => {
    if (!resumeModule) return;
    setExpandedModule(resumeModule.id);
    setShowPlayer(true);
  }, [resumeModule]);

  const toggleModule = (moduleId: string) => {
    const status = modules.find((m) => m.id === moduleId)?.status;
    if (status === "locked") return;
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setShowPlayer(false);
    setActiveQuizKey(null);
  };

  return (
    <div className="space-y-4">
      {modules.map((mod) => {
        const config = statusConfig[mod.status];
        const StatusIcon = config.icon;
        const isExpanded = expandedModule === mod.id;
        const isLocked = mod.status === "locked";

        return (
          <div
            key={mod.id}
            className={`bg-white border rounded-xl overflow-hidden transition-all ${
              isLocked
                ? "border-gray-200 opacity-75"
                : isExpanded
                ? "border-orange-300 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(mod.id)}
              disabled={isLocked}
              className="w-full flex items-center gap-4 p-5 text-left"
            >
              {/* Module Number Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  mod.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : mod.status === "in-progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {mod.status === "completed" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : mod.status === "locked" ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  mod.number
                )}
              </div>

              {/* Title & Meta */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-primary-navy">
                  Module {mod.number}: {mod.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <Badge className={`${config.color} border-0 text-xs`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {mod.duration}
                  </span>
                  {mod.quizScore !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      Score: {mod.quizScore}%
                    </span>
                  )}
                  {isLocked && mod.unlockDate && (
                    <span className="text-xs text-muted-foreground">
                      {mod.unlockDate}
                    </span>
                  )}
                </div>
                {mod.status === "in-progress" && (
                  <div className="flex items-center gap-2 mt-2">
                    <Progress
                      value={mod.progress}
                      className="flex-1 h-1.5 max-w-[200px] [&>div]:bg-blue-600"
                    />
                    <span className="text-xs text-muted-foreground">
                      {mod.progress}%
                    </span>
                  </div>
                )}
              </div>

              {/* Expand Icon */}
              {!isLocked &&
                (isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ))}
            </button>

            {/* Expanded Content */}
            {isExpanded && !isLocked && (
              <div className="border-t border-gray-100 px-5 pb-5">
                <div className="divide-y divide-gray-100">
                  {mod.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      moduleStatus={mod.status}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  {mod.status === "in-progress" && (
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlayer(!showPlayer);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Module
                    </Button>
                  )}
                  {mod.status === "available" && (
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlayer(!showPlayer);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Module
                    </Button>
                  )}
                  {mod.status === "completed" && (
                    <>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Module
                      </Button>
                      {mod.quizScore !== undefined && (
                        <Button size="sm" variant="outline">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Retake Quiz
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Inline Video Player */}
                {showPlayer && mod.status === "in-progress" && (
                  <div>
                    <VideoPlayerPlaceholder
                      title={`Module ${mod.number} - ${
                        mod.lessons.find(
                          (l) =>
                            l.status === "not-started" ||
                            l.status === "in-progress"
                        )?.title || "Next Lesson"
                      }`}
                    />
                    {(() => {
                      const activeLesson = mod.lessons.find(
                        (lesson) =>
                          lesson.status === "in-progress" ||
                          lesson.status === "not-started"
                      );
                      if (!activeLesson) return null;

                      const quizConfig = quizConfigs.find(
                        (config) =>
                          config.moduleId === mod.id &&
                          config.lessonId === activeLesson.id
                      );
                      const quizKey = `${mod.id}:${activeLesson.id}`;
                      const isQuizLesson =
                        activeLesson.type === "quiz" && Boolean(quizConfig);

                      if (isQuizLesson && quizConfig && onQuizSubmit) {
                        return (
                          <div className="mt-3 space-y-2">
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveQuizKey((prev) =>
                                  prev === quizKey ? null : quizKey
                                );
                              }}
                            >
                              <HelpCircle className="w-4 h-4 mr-2" />
                              {activeQuizKey === quizKey ? "Hide Quiz" : "Start Quiz"}
                            </Button>
                            {activeQuizKey === quizKey && (
                              <QuizPlayer
                                config={quizConfig}
                                attemptsUsed={quizAttemptsByModule[mod.id] ?? 0}
                                onSubmit={(score) =>
                                  onQuizSubmit(
                                    mod.id,
                                    activeLesson.id,
                                    score,
                                    quizConfig.passThreshold
                                  )
                                }
                                onClose={() => setActiveQuizKey(null)}
                              />
                            )}
                          </div>
                        );
                      }

                      if (!onCompleteLesson) return null;

                      return (
                        <div className="mt-3 space-y-3">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={(event) => {
                              event.stopPropagation();
                              onCompleteLesson(mod.id, activeLesson.id);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete "{activeLesson.title}"
                          </Button>
                          {getLessonIntegrationLinks(courseId, mod.title, activeLesson.title).map(
                            (integrationLink) => (
                              <Link
                                key={integrationLink.id}
                                to={integrationLink.to}
                                className="block border border-gray-200 rounded-lg p-3 hover:border-orange-300 hover:bg-orange-50/40 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-xs font-semibold text-foreground">
                                      {integrationLink.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {integrationLink.description}
                                    </p>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {showPlayer && mod.status === "available" && (
                  <div>
                    <VideoPlayerPlaceholder
                      title={`Module ${mod.number} - ${
                        mod.lessons.find(
                          (l) =>
                            l.status === "not-started" ||
                            l.status === "in-progress"
                        )?.title || "First Lesson"
                      }`}
                    />
                    {(() => {
                      const activeLesson = mod.lessons.find(
                        (lesson) =>
                          lesson.status === "in-progress" ||
                          lesson.status === "not-started"
                      );
                      if (!activeLesson) return null;

                      const quizConfig = quizConfigs.find(
                        (config) =>
                          config.moduleId === mod.id &&
                          config.lessonId === activeLesson.id
                      );
                      const quizKey = `${mod.id}:${activeLesson.id}`;
                      const isQuizLesson =
                        activeLesson.type === "quiz" && Boolean(quizConfig);

                      if (isQuizLesson && quizConfig && onQuizSubmit) {
                        return (
                          <div className="mt-3 space-y-2">
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={(event) => {
                                event.stopPropagation();
                                setActiveQuizKey((prev) =>
                                  prev === quizKey ? null : quizKey
                                );
                              }}
                            >
                              <HelpCircle className="w-4 h-4 mr-2" />
                              {activeQuizKey === quizKey ? "Hide Quiz" : "Start Quiz"}
                            </Button>
                            {activeQuizKey === quizKey && (
                              <QuizPlayer
                                config={quizConfig}
                                attemptsUsed={quizAttemptsByModule[mod.id] ?? 0}
                                onSubmit={(score) =>
                                  onQuizSubmit(
                                    mod.id,
                                    activeLesson.id,
                                    score,
                                    quizConfig.passThreshold
                                  )
                                }
                                onClose={() => setActiveQuizKey(null)}
                              />
                            )}
                          </div>
                        );
                      }

                      if (!onCompleteLesson) return null;

                      return (
                        <div className="mt-3 space-y-3">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={(event) => {
                              event.stopPropagation();
                              onCompleteLesson(mod.id, activeLesson.id);
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete "{activeLesson.title}"
                          </Button>
                          {getLessonIntegrationLinks(courseId, mod.title, activeLesson.title).map(
                            (integrationLink) => (
                              <Link
                                key={integrationLink.id}
                                to={integrationLink.to}
                                className="block border border-gray-200 rounded-lg p-3 hover:border-orange-300 hover:bg-orange-50/40 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-xs font-semibold text-foreground">
                                      {integrationLink.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {integrationLink.description}
                                    </p>
                                  </div>
                                  <ExternalLink className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserModulesTab;
