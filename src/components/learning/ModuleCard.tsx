import { useState } from "react";
import { CheckCircle, Play, Circle, Lock, ChevronUp, ChevronDown } from "lucide-react";
import { CourseModule } from "@/data/learning/types";
import { LessonItem } from "./LessonItem";

interface ModuleCardProps {
  module: CourseModule;
  defaultExpanded?: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const StatusIcon = {
    'completed': CheckCircle,
    'in-progress': Play,
    'available': Circle,
    'locked': Lock
  }[module.status];

  const canExpand = module.status !== 'locked';

  return (
    <div className={`border-2 rounded-lg overflow-hidden transition-all ${
      module.status === 'completed' ? 'border-green-200 bg-green-50' :
      module.status === 'in-progress' ? 'border-blue-200 bg-blue-50' :
      module.status === 'available' ? 'border-gray-200 bg-white' :
      'border-gray-200 bg-gray-50 opacity-60'
    }`}>
      <div
        className={`p-5 flex items-center gap-4 transition-colors ${
          canExpand ? 'cursor-pointer hover:bg-black/5' : ''
        }`}
        onClick={() => canExpand && setExpanded(!expanded)}
      >
        {/* Status Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          module.status === 'completed' ? 'bg-green-600 text-white' :
          module.status === 'in-progress' ? 'bg-blue-600 text-white' :
          module.status === 'available' ? 'bg-gray-300 text-gray-600' :
          'bg-gray-200 text-gray-400'
        }`}>
          <StatusIcon size={20} />
        </div>

        {/* Module Info */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Module {module.number}: {module.title}
          </h3>
          <p className="text-sm text-gray-600">
            {module.duration} • {module.lessons.length} Lessons
            {module.lessons.some(l => l.type === 'quiz') && ' • Quiz'}
            {module.lessons.some(l => l.type === 'exercise') && ' • Exercise'}
          </p>
        </div>

        {/* Score Badge (if completed) */}
        {module.status === 'completed' && module.quizScore && (
          <div className="ml-auto">
            <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
              {module.quizScore}%
            </span>
          </div>
        )}

        {/* Progress Bar (if in-progress) */}
        {module.status === 'in-progress' && (
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all"
                style={{ width: `${module.progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-600 min-w-[40px]">
              {module.progress}%
            </span>
          </div>
        )}

        {/* Expand Button */}
        {canExpand && (
          <button className="p-2 rounded-md text-gray-600 hover:bg-black/5 hover:text-gray-900 transition-all">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        )}
      </div>

      {/* Expanded Lessons */}
      {expanded && canExpand && (
        <div className="px-5 pb-5 pl-[76px] flex flex-col gap-2">
          {module.lessons.map(lesson => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
};
