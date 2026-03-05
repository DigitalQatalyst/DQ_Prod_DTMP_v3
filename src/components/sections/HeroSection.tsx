import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center justify-center text-center overflow-hidden bg-primary">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(6,25,39,0.76), rgba(6,25,39,0.72)), url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(14,165,233,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.18)_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-accent mb-4">
          DEWA Corporate EA & Transformation Office
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          One Platform. One Direction. Governing All of DEWA&apos;s Digital Transformation.
        </h1>
        <p className="text-base sm:text-lg text-slate-100/90 mb-8 max-w-3xl mx-auto">
          The enterprise architecture platform designed, deployed, and governed by DEWA&apos;s
          Corporate EA Office, accelerating every division&apos;s journey to a Digital-First,
          Net-Zero utility.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center mb-8">
          <Link to="/marketplaces">
            <Button className="cta-primary inline-flex items-center gap-2">
              Enter the Platform
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => document.getElementById("division-pivot")?.scrollIntoView({ behavior: "smooth" })}
            className="cta-secondary"
          >
            Find Your Division
          </Button>
          <button
            onClick={() => document.getElementById("marketplaces")?.scrollIntoView({ behavior: "smooth" })}
            className="cta-tertiary text-white hover:text-blue-accent"
          >
            → Explore Marketplaces
          </button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {[
            "4D Governance Model",
            "EA 4.0 Corporate Practice",
            "Digital DEWA Aligned",
            "Net-Zero 2050 Vision",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border-[1.5px] border-white/40 px-4 py-2 text-[13px] font-medium text-white"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
