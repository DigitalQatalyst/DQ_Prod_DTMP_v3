import { Link } from "react-router-dom";
import {
  Shield, Globe, Zap, BarChart2, Brain, Star, ArrowRight, ChevronRight
} from "lucide-react";
import { SectionPill, IconBadge } from "@/components/landing/shared";

const phaseColors: Record<string, string> = {
  Discern: "#6d28d9",
  Design: "#0369A1",
  Deploy: "#16A34A",
  Drive: "#D97706",
};

const priorities = [
  {
    number: "01",
    category: "Governance",
    icon: Shield,
    title: "One Architecture Standard",
    body: "No division operates outside the enterprise architecture framework. All six divisions, one governance model, no conflicting standards.",
    kpi: "KPI: Cross-Division EA Compliance Rate ≥95%",
  },
  {
    number: "02",
    category: "Investment",
    icon: BarChart2,
    title: "Investment Governed Upfront",
    body: "No significant technology spend is approved without EA review. Architecture decisions are made before money is committed — not after.",
    kpi: "KPI: 100% of Major Investments Architecture-Reviewed",
  },
  {
    number: "03",
    category: "Alignment",
    icon: Globe,
    title: "Programmes in One Direction",
    body: "Smart Grid, Solar Park, AI, and Digital Services are governed as a coherent portfolio. No programme creates architectural debt for another.",
    kpi: "KPI: Programme Architecture Alignment Score ≥90%",
  },
  {
    number: "04",
    category: "Sustainability",
    icon: Zap,
    title: "Net-Zero by Design",
    body: "Sustainability is not a constraint added at the end — it is a design parameter assessed at architecture stage for every solution.",
    kpi: "KPI: 100% of Solutions Net-Zero Impact Assessed",
  },
  {
    number: "05",
    category: "Capability",
    icon: Brain,
    title: "AI Readiness First",
    body: "No division deploys AI without a governed architecture in place. No shadow AI. No ungoverned pilots reaching production.",
    kpi: "KPI: AI Readiness Baseline Across All 6 Divisions",
  },
  {
    number: "06",
    category: "Reliability",
    icon: Star,
    title: "Reliability Never Compromised",
    body: "Every architecture change is assessed against service continuity. Reliability is protected at design stage, not recovered after failure.",
    kpi: "KPI: Architecture-Linked Service Continuity ≥99.9%",
  },
];

export function StrategicPriorities() {
  return (
    <section className="py-20" style={{ background: "#EEF2FF" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Enterprise Priorities" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          Enterprise Strategic Priorities
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          Measurable outcomes the EA Office governs for DEWA — each with a defined KPI, enforced through DTMP, and traceable to an architecture decision.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {priorities.map((priority) => {
            const Icon = priority.icon;
            return (
              <div key={priority.number} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative transition-all" onMouseEnter={e => (e.currentTarget.style.boxShadow = "6px 8px 24px rgba(0,0,0,0.13)")} onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}>
                <span className="absolute top-4 right-4 text-xs text-slate-400 bg-slate-100 group-hover:bg-[#0369A1] group-hover:text-white rounded-md px-2 py-1 transition-all">{priority.number}</span>
                <div className="transition-transform group-hover:scale-110 origin-left w-fit">
                  <IconBadge icon={<Icon size={18} className="text-white" />} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mt-4 mb-1 text-slate-400">
                  {priority.category}
                </p>
                <h3 className="font-bold text-slate-800 mb-2 text-base">{priority.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{priority.body}</p>
                <p className="text-xs font-semibold text-violet-600 mb-3">{priority.kpi}</p>
                <Link
                  to="/marketplaces/lifecycle-management"
                  className="text-xs font-semibold inline-flex items-center gap-1 text-slate-400 hover:text-[#0369A1] transition-colors"
                >
                  View Active Projects <ChevronRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/marketplaces/lifecycle-management"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)" }}
          >
            See What's Being Delivered <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
