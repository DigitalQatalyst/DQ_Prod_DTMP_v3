import {
  BookOpen,
  Clock,
  Target,
  CalendarDays,
  CheckCircle,
  Circle,
  Play,
  Download,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { UserCourseData } from "@/data/learningCenter/stage2/types";

interface UserOverviewTabProps {
  data: UserCourseData;
}

const UserOverviewTab = ({ data }: UserOverviewTabProps) => {
  // Find the in-progress module for "Next Steps"
  const currentModule = data.modules.find((m) => m.status === "in-progress");
  const currentLesson = currentModule?.lessons.find(
    (l) => l.status === "not-started" || l.status === "in-progress"
  );

  return (
    <div className="space-y-8">
      {/* Header with Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary-navy mb-1">
              {data.courseTitle}
            </h2>
            <p className="text-muted-foreground">
              {data.instructorName} &bull; {data.institution}
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Play className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
            <Button variant="outline" className="border-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Download Materials
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Progress value={data.overallProgress} className="flex-1 h-3 [&>div]:bg-orange-600" />
          <span className="text-sm font-semibold text-primary-navy whitespace-nowrap">
            {data.overallProgress}% Complete
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {data.completedModules} of {data.totalModules} modules finished
        </p>
      </div>

      {/* Course Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.completedModules} of {data.stats.totalModules}
          </p>
          <p className="text-sm text-muted-foreground">Modules</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.timeLeft}
          </p>
          <p className="text-sm text-muted-foreground">Time Left</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.progress}%
          </p>
          <p className="text-sm text-muted-foreground">Progress</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.dueDate}
          </p>
          <p className="text-sm text-muted-foreground">Due Date</p>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-primary-navy mb-4">
          What You'll Learn
        </h3>
        <div className="space-y-3">
          {data.learningOutcomes.map((outcome) => (
            <div key={outcome.id} className="flex items-start gap-3">
              {outcome.achieved ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <span
                className={
                  outcome.achieved
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              >
                {outcome.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Your Next Steps */}
      {currentModule && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 border-l-4 border-l-orange-500">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary-navy mb-1">
                Module {currentModule.number}: {currentModule.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Continue where you left off
              </p>
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume Module
                </Button>
                {currentLesson && (
                  <span className="text-sm text-muted-foreground">
                    {currentLesson.duration} remaining
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Message */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-primary-navy">
              {data.instructorMessage.name}
            </h4>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              "{data.instructorMessage.message}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Posted {data.instructorMessage.postedAgo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverviewTab;
