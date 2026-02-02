import { 
  FileText, BookOpen, Video, Image, Code, BarChart3, Presentation, Shield, 
  User, Clock, Calendar, Download 
} from "lucide-react";
import { LibraryItem } from "@/data/knowledgeCenter/library";

interface LibraryItemCardProps {
  item: LibraryItem;
  onClick: () => void;
}

const typeIcons: Record<string, React.ElementType> = {
  FileText: FileText,
  BookOpen: BookOpen,
  Video: Video,
  Image: Image,
  Code: Code,
  BarChart3: BarChart3,
  Presentation: Presentation,
  Shield: Shield,
};

export function LibraryItemCard({ item, onClick }: LibraryItemCardProps) {
  const TypeIcon = typeIcons[item.typeIcon] || FileText;
  
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <TypeIcon className="w-10 h-10 text-blue-600" />
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
          {item.format}
        </span>
      </div>

      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-semibold inline-block mb-2">
        {item.contentType}
      </span>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {item.title}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {item.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {item.author}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.length}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {item.datePublished}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
            {topic}
          </span>
        ))}
        {item.topics.length > 3 && (
          <span className="text-xs text-gray-500">+{item.topics.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
          {item.audience}
        </span>
        <span className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium text-sm">
          <Download className="w-4 h-4" />
          Access
        </span>
      </div>
    </div>
  );
}
