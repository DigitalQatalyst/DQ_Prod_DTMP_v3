import { useState } from "react";

const DATE_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;
type DateRange = (typeof DATE_RANGES)[number];

const topCourses = [
  { title: "Smart Grid Architecture - Design Principles", level: "Intermediate", division: "Transmission", enrolled: 89, completed: 71, rate: 80, rating: 4.7 },
  { title: "Enterprise Architecture Fundamentals for DEWA", level: "Beginner", division: "All Divisions", enrolled: 76, completed: 68, rate: 89, rating: 4.7 },
  { title: "DTMP Platform Orientation - Getting Started", level: "Beginner", division: "All Divisions", enrolled: 71, completed: 69, rate: 97, rating: 4.9 },
  { title: "Introduction to the 4D Governance Model", level: "Beginner", division: "All Divisions", enrolled: 68, completed: 63, rate: 93, rating: 4.8 },
  { title: "Net-Zero 2050 - Architecture's Role", level: "Beginner", division: "All Divisions", enrolled: 63, completed: 55, rate: 87, rating: 4.8 },
  { title: "Virtual Engineer Architecture", level: "Advanced", division: "Digital DEWA", enrolled: 58, completed: 31, rate: 53, rating: 4.8 },
  { title: "EA 4.0 Practice - DEWA's Approach", level: "Intermediate", division: "All Divisions", enrolled: 54, completed: 42, rate: 78, rating: 4.8 },
  { title: "Cybersecurity Architecture for OT", level: "Intermediate", division: "Transmission", enrolled: 51, completed: 36, rate: 71, rating: 4.7 },
  { title: "Executive Transformation Leadership", level: "Advanced", division: "All Divisions", enrolled: 46, completed: 31, rate: 67, rating: 4.9 },
  { title: "Cloud Architecture & Migration", level: "Intermediate", division: "Digital DEWA", enrolled: 41, completed: 26, rate: 63, rating: 4.6 },
];

const trackData = [
  { title: "DEWA EA Practitioner Pathway", enrolled: 54, completed: 29, rate: 54, certs: 26 },
  { title: "Smart Grid & Transmission Architecture", enrolled: 47, completed: 19, rate: 40, certs: 17 },
  { title: "AI Governance & Digital Innovation Track", enrolled: 38, completed: 14, rate: 37, certs: 11 },
  { title: "Transformation Portfolio & Governance Track", enrolled: 36, completed: 22, rate: 61, certs: 19 },
  { title: "Customer Experience & AI Services Architecture", enrolled: 29, completed: 15, rate: 52, certs: 0 },
  { title: "Net-Zero & Sustainability Architecture Track", enrolled: 26, completed: 14, rate: 54, certs: 11 },
  { title: "Executive Transformation Leadership Track", enrolled: 23, completed: 20, rate: 87, certs: 18 },
];

const divisionBreakdown = [
  { name: "Corporate EA Office", learners: 68 },
  { name: "Digital DEWA & Moro Hub", learners: 51 },
  { name: "Transmission", learners: 44 },
  { name: "Customer Experience", learners: 31 },
  { name: "Generation", learners: 38 },
  { name: "Water Services", learners: 29 },
  { name: "Distribution", learners: 23 },
];

const maxDivision = Math.max(...divisionBreakdown.map((d) => d.learners));

const levelCompletion = [
  { level: "Beginner", rate: 78 },
  { level: "Intermediate", rate: 62 },
  { level: "Advanced", rate: 41 },
];

export default function LCAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange>("Last 30 days");

  const maxEnrolled = Math.max(...topCourses.map((c) => c.enrolled));

  return (
    <div className="p-6 space-y-6">
      {/* Header + Date filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Learning Analytics</h2>
          <p className="text-sm text-gray-500">DEWA Learning Centre performance overview</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {DATE_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                dateRange === r ? "bg-white text-orange-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Enrolled Learners", value: "284", sub: "Across all courses & tracks" },
          { label: "Courses Completed This Month", value: "47", sub: "March 2026" },
          { label: "Active Learners", value: "89", sub: "In last 30 days" },
          { label: "Certificates Issued", value: "63", sub: "All time" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Course Performance Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Course Performance</h3>
          <p className="text-xs text-gray-500">Top 10 courses by enrolment</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Course</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Level</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Division</th>
                <th className="text-right px-5 py-2 font-medium text-gray-600">Enrolled</th>
                <th className="text-right px-5 py-2 font-medium text-gray-600">Completed</th>
                <th className="text-right px-5 py-2 font-medium text-gray-600">Rate</th>
                <th className="text-right px-5 py-2 font-medium text-gray-600">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topCourses.map((c) => (
                <tr key={c.title} className="hover:bg-gray-50">
                  <td className="px-5 py-2.5 font-medium text-gray-800 max-w-xs">
                    <span className="line-clamp-1">{c.title}</span>
                  </td>
                  <td className="px-5 py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        c.level === "Beginner"
                          ? "bg-green-100 text-green-700"
                          : c.level === "Intermediate"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {c.level}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-gray-500 text-xs">{c.division}</td>
                  <td className="px-5 py-2.5 text-right text-gray-700">{c.enrolled}</td>
                  <td className="px-5 py-2.5 text-right text-gray-700">{c.completed}</td>
                  <td className="px-5 py-2.5 text-right">
                    <span className={`font-medium ${c.rate >= 80 ? "text-green-600" : c.rate >= 60 ? "text-amber-600" : "text-red-500"}`}>
                      {c.rate}%
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-right text-amber-600 font-medium">★ {c.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Track Performance */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Track Performance</h3>
          <p className="text-xs text-gray-500">All 7 learning pathways</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-2 font-medium text-gray-600">Track</th>
              <th className="text-right px-5 py-2 font-medium text-gray-600">Enrolled</th>
              <th className="text-right px-5 py-2 font-medium text-gray-600">Completed</th>
              <th className="text-right px-5 py-2 font-medium text-gray-600">Rate</th>
              <th className="text-right px-5 py-2 font-medium text-gray-600">Certs Issued</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trackData.map((t) => (
              <tr key={t.title} className="hover:bg-gray-50">
                <td className="px-5 py-2.5 font-medium text-gray-800 max-w-xs">
                  <span className="line-clamp-1">{t.title}</span>
                </td>
                <td className="px-5 py-2.5 text-right text-gray-700">{t.enrolled}</td>
                <td className="px-5 py-2.5 text-right text-gray-700">{t.completed}</td>
                <td className="px-5 py-2.5 text-right">
                  <span className={`font-medium ${t.rate >= 70 ? "text-green-600" : t.rate >= 50 ? "text-amber-600" : "text-red-500"}`}>
                    {t.rate}%
                  </span>
                </td>
                <td className="px-5 py-2.5 text-right text-gray-700">{t.certs || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side-by-side: Top 5 Enrolment + Completion by Level */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top 5 Courses bar chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Top 5 Courses by Enrolment</h3>
          <p className="text-xs text-gray-500 mb-4">Visual enrolment comparison</p>
          <div className="space-y-3">
            {topCourses.slice(0, 5).map((c) => (
              <div key={c.title}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-700 font-medium line-clamp-1 flex-1 mr-2">{c.title}</p>
                  <p className="text-xs text-gray-500 flex-shrink-0">{c.enrolled}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-orange-500 rounded-full transition-all"
                    style={{ width: `${(c.enrolled / maxEnrolled) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion by Level */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Completion Rate by Level</h3>
          <p className="text-xs text-gray-500 mb-4">Average across all courses per level</p>
          <div className="space-y-4">
            {levelCompletion.map((l) => (
              <div key={l.level}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700">{l.level}</p>
                  <p className="text-sm font-semibold text-gray-900">{l.rate}%</p>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      l.rate >= 70 ? "bg-green-500" : l.rate >= 55 ? "bg-amber-500" : "bg-red-400"
                    }`}
                    style={{ width: `${l.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Division Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-1">Division Breakdown</h3>
        <p className="text-xs text-gray-500 mb-4">Active learners per DEWA division</p>
        <div className="space-y-3">
          {[...divisionBreakdown].sort((a, b) => b.learners - a.learners).map((d) => (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-700">{d.name}</p>
                <p className="text-sm font-semibold text-gray-900">{d.learners}</p>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2.5 bg-orange-400 rounded-full transition-all"
                  style={{ width: `${(d.learners / maxDivision) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
