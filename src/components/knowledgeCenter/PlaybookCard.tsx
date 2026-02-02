import { BookOpen, MonitorPlay, FileText, Video, Presentation, User } from "lucide-react";
import { Playbook } from "@/data/knowledgeCenter/playbooks";

interface PlaybookCardProps {
  playbook: Playbook;
  onClick: () => void;
}

const formatIcons: Record<string, React.ElementType> = {
  MonitorPlay: MonitorPlay,
  FileText: FileText,
  Video: Video,
  Presentation: Presentation,
};

export function PlaybookCard({ playbook, onClick }: PlaybookCardProps) {
  const FormatIcon = formatIcons[playbook.formatIcon] || FileText;
  
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div
        className="aspect-video flex items-center justify-center relative"
        style={{ background: playbook.coverGradient }}
      >
        <BookOpen className="w-16 h-16 text-white/30" />
        <span className="absolute top-3 right-3 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
          {playbook.industry}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
            {playbook.type}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1">
            <FormatIcon className="w-3 h-3" />
            {playbook.format}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {playbook.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {playbook.description}
        </p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
            Covers:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
            {playbook.topics.slice(0, 3).map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <User className="w-3 h-3" />
            {playbook.contributor}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
            {playbook.scope}
          </span>
        </div>
      </div>
    </div>
  );
}
