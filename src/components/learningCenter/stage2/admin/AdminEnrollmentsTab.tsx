import { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Mail,
  Eye,
  MoreHorizontal,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import type { EnrolledStudent, StudentStatus } from "@/data/learningCenter/stage2/types";

interface AdminEnrollmentsTabProps {
  students: EnrolledStudent[];
}

const statusConfig: Record<
  StudentStatus,
  { label: string; color: string }
> = {
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  active: { label: "Active", color: "bg-blue-100 text-blue-700" },
  "at-risk": { label: "At Risk", color: "bg-amber-100 text-amber-700" },
  struggling: { label: "Struggling", color: "bg-red-100 text-red-700" },
};

const ITEMS_PER_PAGE = 5;

const AdminEnrollmentsTab = ({ students }: AdminEnrollmentsTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleStudent = (id: string) => {
    const next = new Set(selectedStudents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedStudents(next);
  };

  const toggleAll = () => {
    if (selectedStudents.size === paginatedStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(paginatedStudents.map((s) => s.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-primary-navy flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Enrollments ({filteredStudents.length} students)
          </h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="at-risk">At Risk</option>
            <option value="struggling">Struggling</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.size > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex flex-wrap items-center gap-3">
            <span className="text-sm text-blue-800 font-medium">
              {selectedStudents.size} selected:
            </span>
            <Button size="sm" variant="outline" className="text-xs">
              <Mail className="w-3 h-3 mr-1" />
              Send Email
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Send Notification
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              Export Data
            </Button>
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left w-10">
                  <Checkbox
                    checked={
                      paginatedStudents.length > 0 &&
                      selectedStudents.size === paginatedStudents.length
                    }
                    onCheckedChange={toggleAll}
                  />
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Student
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Enrollment
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Progress
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Avg Score
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Last Activity
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.map((student) => {
                const config = statusConfig[student.status];
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedStudents.has(student.id)}
                        onCheckedChange={() => toggleStudent(student.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Day {student.enrolledDays}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {student.enrolledDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={student.progress}
                          className="w-20 h-2 [&>div]:bg-orange-600"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {student.progress}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {student.modulesCompleted}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          student.avgScore >= 80
                            ? "text-green-600"
                            : student.avgScore >= 70
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {student.avgScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={`${config.color} border-0 text-xs`}
                      >
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {student.lastActivity}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(student.status === "at-risk" ||
                          student.status === "struggling") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-amber-600"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of{" "}
            {filteredStudents.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={page === currentPage ? "default" : "outline"}
                  className={
                    page === currentPage
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : ""
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollmentsTab;
