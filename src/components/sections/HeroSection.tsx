import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles, MessageCircle } from "lucide-react";

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

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center w-full">
        {/* pill + title + subtitle constrained to max-w-4xl */}
        <div className="max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 inline-block" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
              DTMP — The Transformation Hub
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            The EA Platform{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa 0%, #f472b6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for DEWA&apos;s Digital Transformation.
            </span>
          </h1>

          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Governed architecture tools, knowledge resources, and delivery marketplaces — empowering DEWA to design, align, and accelerate enterprise-wide digital transformation.
          </p>
        </div>

        {/* search bar — full max-w-5xl width, taller */}
        <div className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 w-full mb-8 shadow-lg">
          <Sparkles size={20} className="text-violet-500 flex-shrink-0" />
          <span className="text-slate-400 text-base flex-1 text-left">
            Ask me anything about DTMP... What do you need help with?
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            EA Ready
          </span>
          <div className="w-px h-5 bg-slate-200 shrink-0" />
          <MessageCircle size={20} className="text-slate-400 hover:text-violet-500 transition-colors cursor-pointer shrink-0" />
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
      </div>
    </section>
  );
}
