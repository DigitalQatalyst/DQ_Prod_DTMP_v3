import { Link } from "react-router-dom";
import {
  Shield, Globe, Zap, BarChart2, Brain, Star, ArrowRight
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
    phase: "Discern",
    icon: Shield,
    title: "Enterprise Architecture Coherence",
    body: "One architecture standard across all DEWA divisions with no fragmentation and no conflicting frameworks.",
    kpi: "KPI: Cross-Division EA Compliance Rate",
  },
  {
    number: "02",
    phase: "Design",
    icon: Globe,
    title: "Digital DEWA Programme Governance",
    body: "Govern Solar, Storage, AI, and Digital Services as architecturally aligned and mutually reinforcing programmes.",
    kpi: "KPI: Digital DEWA Architecture Alignment Score",
  },
  {
    number: "03",
    phase: "Deploy",
    icon: Zap,
    title: "Net-Zero Architecture Alignment",
    body: "Make every architecture decision traceable to DEWA's Net-Zero 2050 commitments.",
    kpi: "KPI: Net-Zero Architecture Contribution Score",
  },
  {
    number: "04",
    phase: "Drive",
    icon: BarChart2,
    title: "Technology Investment Control",
    body: "Deliver enterprise visibility for smarter prioritisation, reduced duplication, and accountable investment governance.",
    kpi: "KPI: Technology Rationalisation Rate",
  },
  {
    number: "05",
    phase: "Design",
    icon: Brain,
    title: "AI-Native Operations Readiness",
    body: "Prepare all divisions for AI-native operations with governance frameworks and reusable architecture blueprints.",
    kpi: "KPI: AI Readiness Assessment Score",
  },
  {
    number: "06",
    phase: "Deploy",
    icon: Star,
    title: "World-Class Service Reliability",
    body: "Protect DEWA's benchmark reliability through architecture governance linked to continuity and customer outcomes.",
    kpi: "KPI: Architecture-Linked Service Continuity",
  },
];

export function StrategicPriorities() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Enterprise Priorities" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          Enterprise Strategic Priorities
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          Six enterprise-wide outcomes DTMP is configured to deliver for all of DEWA,
          aligned to 2030 targets and Net-Zero 2050.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {priorities.map((priority) => {
            const Icon = priority.icon;
            return (
              <div key={priority.number} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                <span className="absolute top-4 right-4 text-xs font-bold text-slate-300">{priority.number}</span>
                <IconBadge icon={<Icon size={18} className="text-white" />} />
                <p
                  className="text-xs font-bold uppercase tracking-widest mt-4 mb-1"
                  style={{ color: phaseColors[priority.phase] }}
                >
                  {priority.phase}
                </p>
                <h3 className="font-bold text-slate-800 mb-2 text-base">{priority.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{priority.body}</p>
                <p className="text-xs font-semibold text-violet-600">{priority.kpi}</p>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/marketplaces"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #6d28d9 0%, #0369A1 100%)" }}
          >
            Explore EA Architecture Strategy <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
