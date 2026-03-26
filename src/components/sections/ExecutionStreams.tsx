import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StreamCard } from "@/components/cards/StreamCard";
import { executionStreams } from "@/data/executionStreams";
import { SectionPill } from "@/components/landing/shared";

export function ExecutionStreams() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="What DTMP Governs" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          The Programmes Driving DEWA's Transformation
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          Four of the most consequential transformation programmes in the region. DTMP provides the architecture governance layer that keeps every decision across all four aligned to one enterprise direction.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {executionStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/marketplaces/portfolio-management"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)" }}
          >
            Explore All Programmes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
