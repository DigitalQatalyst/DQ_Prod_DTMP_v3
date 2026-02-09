import { 
  Play, 
  BookOpen, 
  Download, 
  Award, 
  MessageSquare, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Calendar,
  User,
  Star,
  Users
} from "lucide-react";
import { CourseEnrollment } from "@/data/learning/types";
import { digitalTransformationFundamentals } from "@/data/learning/courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModuleCard } from "./ModuleCard";

interface CourseDetailViewProps {
  course: CourseEnrollment;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course }) => {
  // Get detailed course data (for now, only DT Fundamentals has full details)
  const detailedCourse = course.id === "digital-transformation-fundamentals" 
    ? digitalTransformationFundamentals 
    : null;

  // Calculate circular progress path
  const progressCircumference = 282.7;
  const progressOffset = progressCircumference - (course.progress / 100) * progressCircumference;

  return (
    <div className="p-6 space-y-6">
      {/* Hero Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col lg:flex-row justify-between gap-8">
        {/* Left: Course Info */}
        <div className="flex-1">
          {/* Meta Row */}
          <div className="flex items-center gap-3 mb-3">
            <Badge className={`${
              course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              course.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
              'bg-purple-100 text-purple-700'
            } border-0`}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </Badge>
            <span className="text-sm text-gray-600 font-medium">
              {course.duration} • {course.credits} CPE Credits
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {course.courseName}
          </h1>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <User size={16} />
            <span>{course.instructor} • DTMP Academy</span>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span>{course.rating} ({course.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <span>{course.enrolledCount.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} className="text-orange-500" />
              <span>Certificate included</span>
            </div>
          </div>
        </div>

        {/* Right: Progress Circle + CTA */}
        <div className="flex flex-col items-center gap-5">
          {/* Circular Progress */}
          <div className="relative w-[120px] h-[120px]">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={progressCircumference}
                strokeDashoffset={progressOffset}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{course.progress}%</span>
              <span className="text-xs text-gray-600 uppercase tracking-wide">Complete</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-base font-semibold flex items-center gap-2">
            <Play size={20} />
            {course.status === 'completed' ? 'Review Course' : 
             course.status === 'not-started' ? 'Start Course' : 'Continue Learning'}
          </Button>
        </div>
      </div>

      {/* Two-Column Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-orange-500 hover:shadow-md transition-all">
          <BookOpen size={24} className="text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Current Module</h3>
            <p className="text-xs text-gray-600">{course.currentModule.title}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-orange-500 hover:shadow-md transition-all">
          <Download size={24} className="text-orange-600 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Download Available Resources</h3>
            <p className="text-xs text-gray-600">
              {detailedCourse ? detailedCourse.modules.length * 3 : course.stats.totalModules * 3} files available
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid - 2x3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <Award size={24} className="text-purple-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Certificate Progress</h4>
            <p className="text-lg font-bold text-gray-900">
              {course.stats.modulesCompleted} of {course.stats.totalModules} modules complete
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <MessageSquare size={24} className="text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Discussion Forum</h4>
            <p className="text-lg font-bold text-gray-900">234 active discussions</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Modules Completed</h4>
            <p className="text-lg font-bold text-gray-900">
              {course.stats.modulesCompleted} / {course.stats.totalModules}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <TrendingUp size={24} className="text-green-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Avg Quiz Score</h4>
            <p className="text-lg font-bold text-gray-900">{course.stats.averageQuizScore}%</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <Clock size={24} className="text-purple-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Time Invested</h4>
            <p className="text-lg font-bold text-gray-900">{course.stats.timeInvested}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
          <Calendar size={24} className="text-orange-600 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-1">Est. Completion</h4>
            <p className="text-lg font-bold text-gray-900">{course.estimatedCompletion}</p>
          </div>
        </div>
      </div>

      {/* Course Modules Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Course Modules</h2>
        
        {detailedCourse ? (
          <div className="flex flex-col gap-3">
            {detailedCourse.modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                defaultExpanded={module.status === 'in-progress'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Module details would be displayed here</p>
            <p className="text-sm mt-2">
              {course.stats.modulesCompleted} of {course.stats.totalModules} modules completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
