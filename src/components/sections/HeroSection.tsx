import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative py-20 lg:py-28 flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a4e 40%, #0c2340 70%, #0f2027 100%)",
        minHeight: 580,
      }}
    >
      {/* radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 55% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center w-full">
        {/* pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.20)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">
            DEWA Corporate EA &amp; Transformation Office
          </span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
          One Platform. One Direction.{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa 0%, #f472b6 60%, #fb923c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Governing All of DEWA&apos;s Digital Transformation.
          </span>
        </h1>

        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
          The enterprise architecture platform designed, deployed, and governed by
          DEWA&apos;s Corporate EA Office — accelerating every division&apos;s journey
          to a Digital-First, Net-Zero utility.
        </p>

        {/* search bar */}
        <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 max-w-xl mx-auto mb-8 shadow-lg">
          <Sparkles size={18} className="text-violet-500 flex-shrink-0" />
          <span className="text-slate-400 text-sm flex-1 text-left">
            Ask me anything about DTMP... What do you need help with?
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
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              color: "#fff",
            }}
          >
            <BookOpen size={16} /> Learn to work with DTMP today
          </Link>
          <Link
            to="/marketplaces"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg, #6d28d9 0%, #db2777 60%, #ea580c 100%)" }}
          >
            Explore Marketplaces <ArrowRight size={16} />
          </Link>
        </div>

        {/* fact pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {["4D Governance Model", "EA 4.0 Corporate Practice", "Digital DEWA Aligned", "Net-Zero 2050 Vision"].map(
            (item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium text-white/70"
                style={{ border: "1px solid rgba(255,255,255,0.18)" }}
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
