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
  Send,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContentModule, ContentResource, LessonType } from "@/data/learningCenter/stage2/types";

interface StagedChange {
  id: string;
  label: string;
}

type ActiveForm = {
  type: "edit-module" | "edit-lesson" | "add-module" | "add-lesson";
  moduleId: string;
  lessonId?: string;
  draftTitle: string;
  draftDuration: string;
  draftLessonType: LessonType;
};

interface AdminContentTabProps {
  modules: ContentModule[];
  resources: ContentResource[];
  onSubmitForReview: (description: string) => void;
  onViewInTOOffice?: () => void;
}

const LESSON_TYPES: LessonType[] = ["video", "reading", "quiz", "exercise", "discussion"];

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

const AdminContentTab = ({ modules, resources, onSubmitForReview, onViewInTOOffice }: AdminContentTabProps) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([modules[0]?.id])
  );
  const [stagedChanges, setStagedChanges] = useState<StagedChange[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [activeForm, setActiveForm] = useState<ActiveForm | null>(null);

  const toggleModule = (id: string) => {
    const next = new Set(expandedModules);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedModules(next);
  };

  const stageChange = (label: string) => {
    setStagedChanges((prev) => [
      ...prev,
      { id: `sc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label },
    ]);
    setSubmitted(false);
  };

  const unstageChange = (id: string) => {
    setStagedChanges((prev) => prev.filter((c) => c.id !== id));
  };

  const openEditModule = (mod: ContentModule) => {
    // Expand the module so the form is visible
    setExpandedModules((prev) => new Set([...prev, mod.id]));
    setActiveForm({
      type: "edit-module",
      moduleId: mod.id,
      draftTitle: mod.title,
      draftDuration: "",
      draftLessonType: "video",
    });
  };

  const openEditLesson = (mod: ContentModule, lessonId: string) => {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;
    setActiveForm({
      type: "edit-lesson",
      moduleId: mod.id,
      lessonId: lesson.id,
      draftTitle: lesson.title,
      draftDuration: lesson.duration,
      draftLessonType: lesson.type,
    });
  };

  const openAddModule = () => {
    setActiveForm({
      type: "add-module",
      moduleId: "new",
      draftTitle: "",
      draftDuration: "",
      draftLessonType: "video",
    });
  };

  const openAddLesson = (moduleId: string) => {
    setActiveForm({
      type: "add-lesson",
      moduleId,
      draftTitle: "",
      draftDuration: "",
      draftLessonType: "video",
    });
  };

  const handleStageFromForm = () => {
    if (!activeForm) return;

    if (activeForm.type === "edit-module") {
      const mod = modules.find((m) => m.id === activeForm.moduleId);
      if (!mod) return;
      const changes: string[] = [];
      if (activeForm.draftTitle.trim() && activeForm.draftTitle.trim() !== mod.title) {
        changes.push(`Rename module ${mod.number}: "${mod.title}" → "${activeForm.draftTitle.trim()}"`);
      }
      if (changes.length === 0) {
        setActiveForm(null);
        return;
      }
      changes.forEach((c) => stageChange(c));
    } else if (activeForm.type === "edit-lesson") {
      const mod = modules.find((m) => m.id === activeForm.moduleId);
      const lesson = mod?.lessons.find((l) => l.id === activeForm.lessonId);
      if (!lesson || !mod) return;
      const changes: string[] = [];
      if (activeForm.draftTitle.trim() && activeForm.draftTitle.trim() !== lesson.title) {
        changes.push(
          `Rename lesson: "${lesson.title}" → "${activeForm.draftTitle.trim()}" (in ${mod.title})`
        );
      }
      if (activeForm.draftDuration && activeForm.draftDuration !== lesson.duration) {
        changes.push(
          `Update duration of "${lesson.title}": ${lesson.duration} → ${activeForm.draftDuration}`
        );
      }
      if (activeForm.draftLessonType !== lesson.type) {
        changes.push(
          `Change type of "${lesson.title}": ${lessonTypeLabel[lesson.type]} → ${lessonTypeLabel[activeForm.draftLessonType]}`
        );
      }
      if (changes.length === 0) {
        setActiveForm(null);
        return;
      }
      changes.forEach((c) => stageChange(c));
    } else if (activeForm.type === "add-module") {
      if (!activeForm.draftTitle.trim()) return;
      stageChange(
        `Add new module: "${activeForm.draftTitle.trim()}"${
          activeForm.draftDuration ? ` (est. ${activeForm.draftDuration})` : ""
        }`
      );
    } else if (activeForm.type === "add-lesson") {
      const mod = modules.find((m) => m.id === activeForm.moduleId);
      if (!activeForm.draftTitle.trim()) return;
      stageChange(
        `Add lesson: "${activeForm.draftTitle.trim()}" (${lessonTypeLabel[activeForm.draftLessonType]}${
          activeForm.draftDuration ? `, ${activeForm.draftDuration}` : ""
        }) to "${mod?.title ?? "module"}"`
      );
    }

    setActiveForm(null);
  };

  const handleSubmit = () => {
    if (stagedChanges.length === 0) return;
    const description = stagedChanges.map((c) => `• ${c.label}`).join("\n");
    onSubmitForReview(description);
    setStagedChanges([]);
    setSubmitted(true);
  };

  // Inline form card — reused for all form types
  const InlineForm = ({
    title,
    showDuration,
    showType,
    onCancel,
  }: {
    title: string;
    showDuration: boolean;
    showType: boolean;
    onCancel: () => void;
  }) => {
    if (!activeForm) return null;
    const canStage = activeForm.draftTitle.trim().length > 0;
    return (
      <div className="mx-4 my-2 p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-orange-800 uppercase tracking-wide">{title}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs text-gray-600">Title</Label>
            <Input
              className="mt-1 text-sm"
              value={activeForm.draftTitle}
              onChange={(e) =>
                setActiveForm((f) => f && { ...f, draftTitle: e.target.value })
              }
              placeholder="Enter title…"
              autoFocus
            />
          </div>
          {showDuration && (
            <div>
              <Label className="text-xs text-gray-600">Duration</Label>
              <Input
                className="mt-1 text-sm"
                value={activeForm.draftDuration}
                onChange={(e) =>
                  setActiveForm((f) => f && { ...f, draftDuration: e.target.value })
                }
                placeholder="e.g. 20 min"
              />
            </div>
          )}
          {showType && (
            <div>
              <Label className="text-xs text-gray-600">Type</Label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                value={activeForm.draftLessonType}
                onChange={(e) =>
                  setActiveForm(
                    (f) => f && { ...f, draftLessonType: e.target.value as LessonType }
                  )
                }
              >
                {LESSON_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {lessonTypeLabel[t]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            disabled={!canStage}
            onClick={handleStageFromForm}
          >
            <Check className="w-3 h-3 mr-1" />
            Stage Change
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Staged Changes Action Strip */}
      <div
        className={`border rounded-xl p-4 ${
          stagedChanges.length > 0
            ? "bg-orange-50 border-orange-200"
            : submitted
            ? "bg-green-50 border-green-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                stagedChanges.length > 0
                  ? "text-orange-900"
                  : submitted
                  ? "text-green-800"
                  : "text-gray-600"
              }`}
            >
              {stagedChanges.length > 0
                ? `${stagedChanges.length} staged content change${stagedChanges.length > 1 ? "s" : ""} pending submission`
                : submitted
                ? "Content update request submitted to TO Office for review."
                : "No staged content changes"}
            </p>
            <p
              className={`text-xs mt-0.5 ${
                stagedChanges.length > 0
                  ? "text-orange-700"
                  : submitted
                  ? "text-green-700"
                  : "text-gray-400"
              }`}
            >
              {stagedChanges.length > 0
                ? "Review changes below, then submit for TO Office approval."
                : submitted
                ? (
                  <span className="flex items-center gap-2">
                    <span>TO Office will review and approve before changes go live.</span>
                    {onViewInTOOffice && (
                      <button
                        type="button"
                        onClick={onViewInTOOffice}
                        className="text-orange-600 hover:text-orange-800 font-medium underline underline-offset-2"
                      >
                        View in TO Office →
                      </button>
                    )}
                  </span>
                )
                : "Use Edit, Delete, and Add buttons below to stage content changes for TO review."}
            </p>
            {stagedChanges.length > 0 && (
              <ul className="mt-2 space-y-1">
                {stagedChanges.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-xs text-orange-800">
                    <span className="flex-1">• {c.label}</span>
                    <button
                      type="button"
                      onClick={() => unstageChange(c.id)}
                      className="text-orange-400 hover:text-orange-700 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white flex-shrink-0"
            disabled={stagedChanges.length === 0}
            onClick={handleSubmit}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit for TO Review
          </Button>
        </div>
      </div>

      {/* Course Structure Editor */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-navy">Course Content (Editable)</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={openAddModule}
            >
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

        {/* Add Module inline form */}
        {activeForm?.type === "add-module" && (
          <InlineForm
            title="New Module Details"
            showDuration={true}
            showType={false}
            onCancel={() => setActiveForm(null)}
          />
        )}

        <div className="divide-y divide-gray-100">
          {modules.map((mod) => {
            const isExpanded = expandedModules.has(mod.id);
            const isEditingThisModule =
              activeForm?.type === "edit-module" && activeForm.moduleId === mod.id;

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
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-7 text-xs ${isEditingThisModule ? "text-orange-600 bg-orange-50" : ""}`}
                      onClick={() =>
                        isEditingThisModule ? setActiveForm(null) : openEditModule(mod)
                      }
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      {isEditingThisModule ? "Cancel Edit" : "Edit"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs text-red-600 hover:text-red-700"
                      onClick={() => stageChange(`Delete module ${mod.number}: "${mod.title}"`)}
                    >
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

                {/* Edit Module inline form */}
                {isEditingThisModule && (
                  <InlineForm
                    title={`Editing Module ${mod.number}: "${mod.title}"`}
                    showDuration={false}
                    showType={false}
                    onCancel={() => setActiveForm(null)}
                  />
                )}

                {/* Expanded Lessons */}
                {isExpanded && (
                  <div className="pl-16 pr-6 pb-4 space-y-2">
                    {mod.lessons.map((lesson) => {
                      const LessonIcon = lessonTypeIcon[lesson.type];
                      const isEditingThisLesson =
                        activeForm?.type === "edit-lesson" &&
                        activeForm.lessonId === lesson.id;

                      return (
                        <div key={lesson.id}>
                          <div className="flex items-center gap-3 py-2 px-4 bg-gray-50 rounded-lg">
                            <GripVertical className="w-3 h-3 text-gray-400 cursor-grab" />
                            <LessonIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-foreground">{lesson.title}</span>
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
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-6 w-6 p-0 ${isEditingThisLesson ? "text-orange-600" : ""}`}
                                onClick={() =>
                                  isEditingThisLesson
                                    ? setActiveForm(null)
                                    : openEditLesson(mod, lesson.id)
                                }
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <Download className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-500"
                                onClick={() =>
                                  stageChange(
                                    `Delete lesson: "${lesson.title}" from "${mod.title}"`
                                  )
                                }
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Edit Lesson inline form */}
                          {isEditingThisLesson && (
                            <div className="mt-1">
                              <InlineForm
                                title={`Editing: "${lesson.title}"`}
                                showDuration={true}
                                showType={true}
                                onCancel={() => setActiveForm(null)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Lesson inline form */}
                    {activeForm?.type === "add-lesson" && activeForm.moduleId === mod.id ? (
                      <InlineForm
                        title={`New Lesson in "${mod.title}"`}
                        showDuration={true}
                        showType={true}
                        onCancel={() => setActiveForm(null)}
                      />
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 text-xs"
                        onClick={() => openAddLesson(mod.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Lesson
                      </Button>
                    )}
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
          <Badge className="bg-orange-100 text-orange-700 border-0 cursor-pointer">Video</Badge>
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
          <p className="text-xs text-muted-foreground mt-2">Supported formats:</p>
          <p className="text-xs text-muted-foreground">
            Videos: MP4, MOV, AVI (max 2GB) &bull; Documents: PDF, DOCX, PPTX (max 50MB) &bull;
            SCORM packages supported
          </p>
        </div>
      </div>

      {/* Course Resources */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-navy">Downloadable Resources</h3>
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
                <p className="text-sm font-medium text-foreground">{resource.name}</p>
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
