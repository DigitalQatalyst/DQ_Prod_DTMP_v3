import { Link } from "react-router-dom";
import { BookOpen, Layers, ChevronRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section
      className="py-16"
      style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #7c2d12 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">
            Enter the{" "}
            <span style={{ color: "#a78bfa" }}>DEWA Enterprise DTMP</span>
          </h2>
          <div className="w-10 h-0.5 bg-white/30 mb-4" />
          <p className="text-white/60 text-sm">
            Govern, design, and deliver DEWA&apos;s digital transformation at enterprise scale.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full lg:w-96">
          {[
            {
              icon: <BookOpen size={16} />,
              label: "Learn to work with DTMP today",
              route: "/marketplaces/learning-center",
            },
            {
              icon: <Layers size={16} />,
              label: "Explore EA Marketplaces",
              route: "/marketplaces",
            },
            {
              icon: <ChevronRight size={16} />,
              label: "Submit Architecture Service Request",
              route: "/marketplaces/document-studio",
            },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.route}
              className="flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              <ChevronRight size={16} className="text-white/50" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
