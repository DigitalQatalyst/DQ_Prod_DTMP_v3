import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  HelpCircle,
  Code,
  Pencil,
  Trash2,
  Eye,
  Plus,
  Upload,
  Download,
  GripVertical,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ContentModule, ContentResource, LessonType } from "@/data/learningCenter/stage2/types";

interface AdminContentTabProps {
  modules: ContentModule[];
  resources: ContentResource[];
}

const lessonTypeIcon: Record<LessonType, typeof Video> = {
  video: Video,
  reading: FileText,
  quiz: HelpCircle,
  exercise: Code,
  discussion: FileText,
};

const lessonTypeLabel: Record<LessonType, string> = {
  video: "Video",
  reading: "Reading",
  quiz: "Quiz",
  exercise: "Exercise",
  discussion: "Discussion",
};

const AdminContentTab = ({ modules, resources }: AdminContentTabProps) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([modules[0]?.id])
  );

  const toggleModule = (id: string) => {
    const next = new Set(expandedModules);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedModules(next);
  };

  return (
    <div className="space-y-8">
      {/* Course Structure Editor */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-navy">
            Course Content (Editable)
          </h3>
          <div className="flex gap-2">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Add Module
            </Button>
            <Button size="sm" variant="outline">
              Reorder Modules
            </Button>
            <Button size="sm" variant="outline">
              Bulk Upload
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {modules.map((mod) => {
            const isExpanded = expandedModules.has(mod.id);
            return (
              <div key={mod.id}>
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-grab" />
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 rotate-180" />
                  )}
                  <span className="text-sm font-semibold text-primary-navy flex-1">
                    Module {mod.number}: {mod.title}
                  </span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analytics
                    </Button>
                  </div>
                </button>

                {/* Expanded Lessons */}
                {isExpanded && (
                  <div className="pl-16 pr-6 pb-4 space-y-2">
                    {mod.lessons.map((lesson) => {
                      const LessonIcon = lessonTypeIcon[lesson.type];
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 py-2 px-4 bg-gray-50 rounded-lg"
                        >
                          <GripVertical className="w-3 h-3 text-gray-400 cursor-grab" />
                          <LessonIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-foreground">
                              {lesson.title}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              ({lesson.duration})
                            </span>
                          </div>
                          <Badge className="bg-gray-200 text-gray-600 border-0 text-xs">
                            {lessonTypeLabel[lesson.type]}
                          </Badge>
                          {lesson.views && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.views.toLocaleString()} views
                            </span>
                          )}
                          {lesson.reads && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.reads.toLocaleString()} reads
                            </span>
                          )}
                          {lesson.attempts && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.attempts.toLocaleString()} attempts
                            </span>
                          )}
                          {lesson.avgScore && (
                            <span className="text-xs text-muted-foreground">
                              Avg: {lesson.avgScore}
                            </span>
                          )}
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Lesson
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload New Content */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-orange-600" />
          Upload Content
        </h3>
        <div className="flex gap-3 mb-4">
          <Badge className="bg-orange-100 text-orange-700 border-0 cursor-pointer">
            Video
          </Badge>
          <Badge className="bg-gray-100 text-gray-600 border-0 cursor-pointer hover:bg-gray-200">
            Reading
          </Badge>
          <Badge className="bg-gray-100 text-gray-600 border-0 cursor-pointer hover:bg-gray-200">
            Quiz
          </Badge>
          <Badge className="bg-gray-100 text-gray-600 border-0 cursor-pointer hover:bg-gray-200">
            Exercise
          </Badge>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">
            Drag & drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats:
          </p>
          <p className="text-xs text-muted-foreground">
            Videos: MP4, MOV, AVI (max 2GB) &bull; Documents: PDF, DOCX, PPTX
            (max 50MB) &bull; SCORM packages supported
          </p>
        </div>
      </div>

      {/* Course Resources */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-navy">
            Downloadable Resources
          </h3>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-1" />
            Add Resource
          </Button>
        </div>
        <div className="divide-y divide-gray-100">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
            >
              <FileText className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {resource.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {resource.fileType}, {resource.size}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {resource.downloads.toLocaleString()} downloads
              </span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="text-xs">
                  Replace File
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminContentTab;
