import { CheckCircle, Play, Circle, Lock, Video, FileText, Pencil, HelpCircle, MessageSquare } from "lucide-react";
import { Lesson } from "@/data/learning/types";
import { Button } from "@/components/ui/button";

interface LessonItemProps {
  lesson: Lesson;
}

export const LessonItem: React.FC<LessonItemProps> = ({ lesson }) => {
  const StatusIcon = {
    'completed': CheckCircle,
    'in-progress': Play,
    'available': Circle,
    'locked': Lock
  }[lesson.status];

  const TypeIcon = {
    'video': Video,
    'reading': FileText,
    'exercise': Pencil,
    'quiz': HelpCircle,
    'discussion': MessageSquare
  }[lesson.type];

  return (
    <div className={`flex items-center gap-3 p-3 bg-white rounded-lg border transition-all ${
      lesson.status === 'completed' ? 'bg-green-50 border-green-200' :
      lesson.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
      lesson.status === 'locked' ? 'opacity-50 cursor-not-allowed border-gray-200' :
      'border-gray-200 hover:border-orange-500 hover:shadow-sm'
    }`}>
      <StatusIcon 
        size={16} 
        className={`flex-shrink-0 ${
          lesson.status === 'completed' ? 'text-green-600' :
          lesson.status === 'in-progress' ? 'text-blue-600' :
          lesson.status === 'locked' ? 'text-gray-400' :
          'text-gray-500'
        }`}
      />
      <TypeIcon size={16} className="flex-shrink-0 text-gray-500" />
      <span className="flex-1 text-sm font-medium text-gray-900">{lesson.title}</span>
      <span className="text-xs text-gray-600">{lesson.duration}</span>
      
      {lesson.status === 'in-progress' && (
        <Button 
          size="sm" 
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 h-7 text-xs"
        >
          Continue
        </Button>
      )}
    </div>
  );
};
