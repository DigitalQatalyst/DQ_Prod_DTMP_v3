import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Database, Settings, Zap, Building2, Globe, ChevronRight, ArrowRight
} from "lucide-react";
import { SectionPill, IconBadge } from "@/components/landing/shared";

const phaseColors: Record<string, string> = {
  Discern: "#6d28d9",
  Design: "#0369A1",
  Deploy: "#16A34A",
  Drive: "#D97706",
};

const marketplaces = [
  {
    id: "learning-center",
    phase: "Discern",
    icon: BookOpen,
    name: "DTMP Learning Centre",
    description: "Technology and sustainability learning tracks for all DEWA divisions and roles.",
    audience: "All DEWA staff",
    cta: "Explore Learning Centre",
    route: "/marketplaces/learning-center",
  },
  {
    id: "knowledge-center",
    phase: "Discern",
    icon: Database,
    name: "DTMP Knowledge Centre",
    description: "Knowledge standards, design patterns, and governance policies enterprise-wide.",
    audience: "Architects & analysts",
    cta: "Browse Knowledge Centre",
    route: "/marketplaces/knowledge-center",
  },
  {
    id: "document-studio",
    phase: "Design",
    icon: Settings,
    name: "DTMP Document Studio",
    description: "AI-generated assessments for visualisation and documentation of architecture.",
    audience: "EA practitioners",
    cta: "Open Document Studio",
    route: "/marketplaces/document-studio",
  },
  {
    id: "solution-specs",
    phase: "Design",
    icon: Globe,
    name: "DTMP Solution Specs",
    description: "Resources for diagnostic integration, sensors, and field-ready specs.",
    audience: "Solution architects",
    cta: "Browse Solution Specs",
    route: "/marketplaces/solution-specs",
  },
  {
    id: "solution-build",
    phase: "Deploy",
    icon: Zap,
    name: "DTMP Solution Build",
    description: "Support for diagnostic-capable solution and programme transformation.",
    audience: "Delivery teams",
    cta: "Request Build Support",
    route: "/marketplaces/solution-build",
  },
  {
    id: "lifecycle-management",
    phase: "Drive",
    icon: Building2,
    name: "DTMP Lifecycle Management",
    description: "In-cycle management for water transformation and operations initiatives.",
    audience: "Programme managers",
    cta: "Open Lifecycle Dashboard",
    route: "/marketplaces/lifecycle-management",
  },
];

const phases = ["All", "Discern", "Design", "Deploy", "Drive"];

export function ResourceMarketplaces() {
  const [activePhase, setActivePhase] = useState("All");

  const filtered =
    activePhase === "All"
      ? marketplaces
      : marketplaces.filter((m) => m.phase === activePhase);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Marketplace" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          The 4D EA Marketplace Architecture
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-8 text-sm leading-relaxed">
          A structured capability spanning Discern, Design, Deploy, and Drive — from literacy to scale.
        </p>

        {/* phase tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                activePhase === phase
                  ? { background: "linear-gradient(135deg, #6d28d9 0%, #0369A1 100%)", color: "#fff" }
                  : { background: "#f1f5f9", color: "#64748b" }
              }
            >
              {phase === "All" ? "All Capabilities" : `${phase}`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filtered.map((mp) => {
            const Icon = mp.icon;
            return (
              <div key={mp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                <IconBadge icon={<Icon size={18} className="text-white" />} />
                <p
                  className="text-xs font-bold uppercase tracking-widest mt-4 mb-1"
                  style={{ color: phaseColors[mp.phase] }}
                >
                  {mp.phase}
                </p>
                <h3 className="font-bold text-slate-800 mb-2 text-base">{mp.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-2">{mp.description}</p>
                <p className="text-xs text-slate-400 mb-4">For: {mp.audience}</p>
                <Link
                  to={mp.route}
                  className="text-sm font-semibold inline-flex items-center gap-1 text-violet-700"
                >
                  {mp.cta} <ChevronRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            to="/marketplaces"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)" }}
          >
            Explore All Marketplaces <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
