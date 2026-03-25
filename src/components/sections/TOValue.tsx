import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ValueCard } from "@/components/cards/ValueCard";
import { valueProps, stats } from "@/data/valueProps";
import { SectionPill, StatCard } from "@/components/landing/shared";

export function TOValue() {
  return (
    <section className="py-20" style={{ background: "#EEF2FF" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Enterprise Value" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          Corporate EA Office Value
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          Why enterprise-wide EA governance matters and what it delivers for all DEWA divisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {valueProps.map((value) => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} sub={stat.note} />
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/stage3/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #6d28d9 0%, #0369A1 100%)" }}
          >
            Enter the Corporate EA Office <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
