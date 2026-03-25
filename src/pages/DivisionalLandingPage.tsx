import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  BookOpen, Zap, Shield, Brain, BarChart2, Users, Settings,
  ArrowRight, Layers, Target, TrendingUp, Activity, Star,
  Database, Globe, ChevronRight, Building2, Cpu,
  Droplets, HeartHandshake, Bot, Sparkles
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  divisionalLandingData,
  isDivisionId,
} from "@/data/divisions/divisionalLandingData";
import { SectionPill, IconBadge, StatCard } from "@/components/landing/shared";

// ── accent / hero config ──────────────────────────────────────────────────────
const divisionConfig: Record<string, { accent: string; heroGradient: string; icon: React.ReactNode }> = {
  "water-services": {
    accent: "#0D9488",
    heroGradient: "linear-gradient(135deg, #0f2027 0%, #1a3a4a 40%, #0D9488 100%)",
    icon: <Droplets size={22} className="text-white" />,
  },
  "customer-services": {
    accent: "#7C3AED",
    heroGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #7C3AED 100%)",
    icon: <HeartHandshake size={22} className="text-white" />,
  },
  "digital-dewa-moro-hub": {
    accent: "#0369A1",
    heroGradient: "linear-gradient(135deg, #0c1445 0%, #1e3a5f 40%, #0369A1 100%)",
    icon: <Bot size={22} className="text-white" />,
  },
  generation: {
    accent: "#D97706",
    heroGradient: "linear-gradient(135deg, #1c0a00 0%, #3d1f00 40%, #D97706 100%)",
    icon: <Zap size={22} className="text-white" />,
  },
  transmission: {
    accent: "#0EA5E9",
    heroGradient: "linear-gradient(135deg, #0c1a2e 0%, #0f3460 40%, #0EA5E9 100%)",
    icon: <Activity size={22} className="text-white" />,
  },
  distribution: {
    accent: "#16A34A",
    heroGradient: "linear-gradient(135deg, #052e16 0%, #14532d 40%, #16A34A 100%)",
    icon: <Globe size={22} className="text-white" />,
  },
};

const phaseColors: Record<string, string> = {
  Discern: "#6d28d9",
  Design: "#0369A1",
  Deploy: "#16A34A",
  Drive: "#D97706",
};

const priorityIcons = [Target, TrendingUp, Layers, Shield, BarChart2, Star];
const roleIcons = [Brain, BarChart2, Cpu, Users, Activity, Shield];
const marketplaceIcons = [BookOpen, Database, Settings, Zap, Building2, Globe];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DivisionalLandingPage() {
  const { divisionId } = useParams<{ divisionId?: string }>();
  const [activePhase, setActivePhase] = useState<string>("All");

  if (!isDivisionId(divisionId)) return <Navigate to="/" replace />;

  const data = divisionalLandingData[divisionId];
  const cfg = divisionConfig[divisionId] ?? divisionConfig["transmission"];
  const phases = ["All", "Discern", "Design", "Deploy", "Drive"];
  const filteredMarketplaces =
    activePhase === "All"
      ? data.marketplaces
      : data.marketplaces.filter((m) => m.phase === activePhase);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section
          className="relative py-20 lg:py-28 flex items-center overflow-hidden"
          style={{ background: cfg.heroGradient, minHeight: 520 }}
        >
          {/* subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
          <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            {/* pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              {cfg.icon}
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                {data.divisionLabel} — DTMP
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              {data.heroTitle}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              {data.heroSubtitle}
            </p>
            {/* search bar */}
            <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 max-w-xl mx-auto mb-8 shadow-lg">
              <Sparkles size={18} className="text-violet-500 flex-shrink-0" />
              <span className="text-slate-400 text-sm flex-1 text-left">
                Ask me anything about {data.shortTitle}... What do you need help with?
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                EA Ready
              </span>
            </div>
            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/marketplaces/learning-center"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff" }}
              >
                <BookOpen size={16} /> Learn to work with DTMP today
              </Link>
              <Link
                to="/marketplaces"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                style={{ background: cfg.accent }}
              >
                Explore Marketplaces <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── CONTEXT — 3 feature cards ── */}
        <section className="py-20" style={{ background: "#EEF2FF" }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <SectionPill label="Division Context" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
              {data.contextTitle}
            </h2>
            <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
              {data.contextOverview[0]}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.whyItMatters.slice(0, 3).map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <IconBadge icon={[<Brain />, <Zap />, <Shield />][i % 3]} />
                  <h3 className="font-bold text-slate-800 mt-4 mb-2 text-base">{item.split(" ").slice(0, 4).join(" ")}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            {data.contextOverview[1] && (
              <p className="text-slate-500 text-center max-w-3xl mx-auto mt-10 text-sm leading-relaxed">
                {data.contextOverview[1]}
              </p>
            )}
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <SectionPill label="Why DTMP Matters Here" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
              From Fragmented Architecture to Enterprise Advantage
            </h2>
            <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm">
              Architecture only scales when it's governed, contextual, and measured end-to-end.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {data.whyItMatters.slice(3).map((item, i) => {
                const vals = ["85%", "92%", "78%", "96%"];
                const labels = ["Architecture Coverage", "Governance Adoption", "Lifecycle Compliance", "Risk Reduction"];
                return (
                  <StatCard
                    key={i}
                    value={vals[i] ?? "—"}
                    label={labels[i] ?? item.split(" ").slice(0, 3).join(" ")}
                    sub={item}
                  />
                );
              })}
            </div>
            <div className="text-center">
              <Link
                to="/marketplaces"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)" }}
              >
                Explore the Unified EA Architecture <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRIORITIES — numbered grid ── */}
        <section className="py-20" style={{ background: "#EEF2FF" }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <SectionPill label="Strategic Priorities" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
              The {data.priorities.length} {data.shortTitle} Imperatives
            </h2>
            <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm">
              Structural priorities that transform architecture from governance into measurable, value-generating outcomes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.priorities.map((p, i) => {
                const Icon = priorityIcons[i % priorityIcons.length];
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                    <span className="absolute top-4 right-4 text-xs font-bold text-slate-300">{i + 1}</span>
                    <IconBadge icon={<Icon size={18} className="text-white" />} />
                    <h3 className="font-bold text-slate-800 mt-4 mb-2 text-base">{p.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{p.description}</p>
                    <p className="text-xs font-semibold text-violet-600">{p.kpi}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── ROLES ── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <SectionPill label="User Journeys" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
              EA Solutions for Every Role
            </h2>
            <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm">
              Role-based environments that preserve accountability while scaling architecture capability with governance and measurable value.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.roles.map((role, i) => {
                const Icon = roleIcons[i % roleIcons.length];
                const categoryLabel = role.name.toUpperCase().split(" ").slice(0, 3).join(" ");
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                    <IconBadge icon={<Icon size={18} className="text-white" />} />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-4 mb-1">{categoryLabel}</p>
                    <h3 className="font-bold text-slate-800 mb-2 text-base">{role.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4">{role.summary}</p>
                    <Link
                      to={role.route}
                      className="text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                      style={{ color: cfg.accent }}
                    >
                      {role.cta} <ChevronRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/marketplaces"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)" }}
              >
                Explore EA Collaboration Framework <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── MARKETPLACES — tabbed ── */}
        <section className="py-20" style={{ background: "#EEF2FF" }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <SectionPill label="Marketplace" />
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
              The 4D EA Marketplace Architecture
            </h2>
            <p className="text-slate-500 text-center max-w-2xl mx-auto mb-8 text-sm">
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
                      ? { background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)", color: "#fff" }
                      : { background: "#fff", color: "#64748b", border: "1.5px solid #e2e8f0" }
                  }
                >
                  {phase === "All" ? "All Capabilities" : `0${phases.indexOf(phase)} ${phase}`}
                </button>
              ))}
            </div>
            {/* phase group header */}
            {activePhase !== "All" && (
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-10 rounded-full" style={{ background: phaseColors[activePhase] }} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Class 0{phases.indexOf(activePhase)}
                  </p>
                  <p className="font-bold text-slate-800 text-lg uppercase">{activePhase}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarketplaces.map((mp, i) => {
                const Icon = marketplaceIcons[i % marketplaceIcons.length];
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                    <IconBadge icon={<Icon size={18} className="text-white" />} />
                    <p className="text-xs font-bold uppercase tracking-widest mt-4 mb-1"
                      style={{ color: phaseColors[mp.phase] }}>
                      {mp.phase}
                    </p>
                    <h3 className="font-bold text-slate-800 mb-2 text-base">{mp.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-2">{mp.description}</p>
                    <p className="text-xs text-slate-400 mb-4">For: {mp.audience}</p>
                    <Link
                      to={mp.route}
                      className="text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                      style={{ color: cfg.accent }}
                    >
                      {mp.cta} <ChevronRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section
          className="py-16"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #7c2d12 100%)" }}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-10">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                Enter the{" "}
                <span style={{ color: cfg.accent }}>{data.shortTitle} DTMP</span>
              </h2>
              <div className="w-10 h-0.5 bg-white/30 mb-4" />
              <p className="text-white/60 text-sm">
                Govern, design, and deliver {data.shortTitle} architecture at enterprise scale.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full lg:w-96">
              {[
                { icon: <BookOpen size={16} />, label: "Learn to work with DTMP today", route: "/marketplaces/learning-center" },
                { icon: <Layers size={16} />, label: "Explore EA Marketplaces", route: "/marketplaces" },
                { icon: <ArrowRight size={16} />, label: "Submit Architecture Service Request", route: "/marketplaces/document-studio" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.route}
                  className="flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:bg-white/20"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <span className="flex items-center gap-3">{item.icon}{item.label}</span>
                  <ChevronRight size={16} className="text-white/50" />
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
