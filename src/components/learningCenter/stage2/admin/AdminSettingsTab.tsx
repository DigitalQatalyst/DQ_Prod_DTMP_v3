import {
  Settings,
  Users,
  GraduationCap,
  User,
  Bell,
  Wrench,
  Save,
  Download,
  Copy,
  Archive,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { CourseSettings } from "@/data/learningCenter/stage2/types";

interface AdminSettingsTabProps {
  settings: CourseSettings;
  onChange: (next: CourseSettings) => void;
  deleteRequested: boolean;
  onDeleteRequestedChange: (value: boolean) => void;
  pendingChangeCount: number;
}

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: typeof Settings;
  title: string;
}) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-5 h-5 text-orange-600" />
    <h3 className="text-lg font-semibold text-primary-navy">{title}</h3>
  </div>
);

const AdminSettingsTab = ({
  settings,
  onChange,
  deleteRequested,
  onDeleteRequestedChange,
  pendingChangeCount,
}: AdminSettingsTabProps) => {
  const updateField = <K extends keyof CourseSettings>(field: K, value: CourseSettings[K]) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900 font-medium">Pending Draft Changes</p>
        <p className="text-xs text-blue-700 mt-1">
          {pendingChangeCount} field change(s) {deleteRequested ? " + delete request" : ""} ready for TO review submission.
        </p>
      </div>
      {/* General Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader icon={Settings} title="General Settings" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="courseTitle" className="text-sm font-medium">
              Course Title
            </Label>
            <Input
              id="courseTitle"
              value={settings.courseTitle}
              onChange={(event) => updateField("courseTitle", event.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="courseCode" className="text-sm font-medium">
              Course Code
            </Label>
            <Input
              id="courseCode"
              value={settings.courseCode}
              onChange={(event) => updateField("courseCode", event.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="duration" className="text-sm font-medium">
              Duration
            </Label>
            <Input
              id="duration"
              value={settings.duration}
              onChange={(event) => updateField("duration", event.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty
            </Label>
            <select
              id="difficulty"
              value={settings.difficulty}
              onChange={(event) => updateField("difficulty", event.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Executive</option>
            </select>
          </div>
          <div>
            <Label htmlFor="language" className="text-sm font-medium">
              Language
            </Label>
            <select
              id="language"
              value={settings.language}
              onChange={(event) => updateField("language", event.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
        <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Enrollment Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader icon={Users} title="Enrollment Settings" />
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="enrollmentType"
                id="open"
                defaultChecked={settings.enrollmentType === "open"}
                className="w-4 h-4 text-orange-600"
              />
              <Label htmlFor="open">Open enrollment (anyone can enroll)</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="enrollmentType"
                id="approval"
                defaultChecked={settings.enrollmentType === "approval"}
                className="w-4 h-4 text-orange-600"
              />
              <Label htmlFor="approval">Requires approval</Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="enrollmentType"
                id="invitation"
                defaultChecked={settings.enrollmentType === "invitation"}
                className="w-4 h-4 text-orange-600"
              />
              <Label htmlFor="invitation">Invitation only</Label>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxEnrollments" className="text-sm font-medium">
                Max Enrollments
              </Label>
              <select
              id="maxEnrollments"
              value={settings.maxEnrollments}
              onChange={(event) => updateField("maxEnrollments", event.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
                <option>Unlimited</option>
                <option>100</option>
                <option>500</option>
                <option>1000</option>
                <option>5000</option>
              </select>
            </div>
            <div>
              <Label htmlFor="enrollStart" className="text-sm font-medium">
                Enrollment Start
              </Label>
              <Input
                id="enrollStart"
                value={settings.enrollmentStart}
                onChange={(event) => updateField("enrollmentStart", event.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="enrollEnd" className="text-sm font-medium">
                Enrollment End
              </Label>
              <Input
                id="enrollEnd"
                value={settings.enrollmentEnd}
                onChange={(event) => updateField("enrollmentEnd", event.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
        <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Grading & Certification */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader icon={GraduationCap} title="Grading & Certification" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="passingScore" className="text-sm font-medium">
              Passing Score (%)
            </Label>
            <Input
              id="passingScore"
              type="number"
              value={settings.passingScore}
              onChange={(event) => updateField("passingScore", Number(event.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="quizAttempts" className="text-sm font-medium">
              Quiz Attempts
            </Label>
            <select
              id="quizAttempts"
              value={settings.quizAttempts}
              onChange={(event) => updateField("quizAttempts", event.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option>Unlimited</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>5</option>
            </select>
          </div>
        </div>
        <Separator className="my-4" />
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Certificate Requirements:
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch checked={settings.requireCompleteModules} onCheckedChange={(value) => updateField("requireCompleteModules", value)} />
            <Label>Complete all modules</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={settings.requirePassQuizzes} onCheckedChange={(value) => updateField("requirePassQuizzes", value)} />
            <Label>Pass all quizzes</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={settings.requireFinalProject} onCheckedChange={(value) => updateField("requireFinalProject", value)} />
            <Label>Complete final project</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={settings.requireFinalExam} onCheckedChange={(value) => updateField("requireFinalExam", value)} />
            <Label>
              Pass final exam with {settings.finalExamPassScore}%+
            </Label>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="cpeCredits" className="text-sm font-medium">
            CPE Credits
          </Label>
          <Input
            id="cpeCredits"
            type="number"
            value={settings.cpeCredits}
            onChange={(event) => updateField("cpeCredits", Number(event.target.value) || 0)}
            className="mt-1 w-32"
          />
        </div>
        <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Instructor Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader icon={User} title="Instructor Settings" />
        <div className="space-y-4">
          <div>
            <Label htmlFor="primaryInstructor" className="text-sm font-medium">
              Primary Instructor
            </Label>
            <select
              id="primaryInstructor"
              value={settings.primaryInstructor}
              onChange={(event) => updateField("primaryInstructor", event.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option>{settings.primaryInstructor}</option>
              <option>Dr. James Wilson</option>
              <option>Prof. Maria Garcia</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add Co-Instructor
            </Button>
            <Button size="sm" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add TA
            </Button>
          </div>
        </div>
        <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader icon={Bell} title="Notifications" />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Notify instructor of new enrollments</Label>
            <Switch checked={settings.notifyNewEnrollments} onCheckedChange={(value) => updateField("notifyNewEnrollments", value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Send weekly progress reports to instructor</Label>
            <Switch checked={settings.notifyWeeklyReports} onCheckedChange={(value) => updateField("notifyWeeklyReports", value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Alert on student inactivity (14+ days)</Label>
            <Switch checked={settings.notifyInactivity} onCheckedChange={(value) => updateField("notifyInactivity", value)} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Notify of quiz failures (3+ attempts)</Label>
            <Switch checked={settings.notifyQuizFailures} onCheckedChange={(value) => updateField("notifyQuizFailures", value)} />
          </div>
        </div>
        <Button className="mt-4 bg-orange-600 hover:bg-orange-700 text-white" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Advanced */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <SectionHeader icon={Wrench} title="Advanced" />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Duplicate Course
          </Button>
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archive Course
          </Button>
          <Button
            variant="outline"
            className={`text-red-600 border-red-300 hover:bg-red-50 ${
              deleteRequested ? "bg-red-50" : ""
            }`}
            onClick={() => onDeleteRequestedChange(!deleteRequested)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteRequested ? "Delete Requested" : "Request Course Deletion"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Deleting a course requires confirmation and cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default AdminSettingsTab;
