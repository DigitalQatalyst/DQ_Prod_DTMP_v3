import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { DBPOverview } from "@/components/sections/DBPOverview";
import { GovernanceModel } from "@/components/sections/GovernanceModel";
import { ExecutionStreams } from "@/components/sections/ExecutionStreams";
import { ResourceMarketplaces } from "@/components/sections/ResourceMarketplaces";
import { TOValue } from "@/components/sections/TOValue";
import { Contributors } from "@/components/sections/Contributors";
import { FinalCTA } from "@/components/sections/FinalCTA";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <section id="dbp-overview">
          <DBPOverview />
        </section>
        <section id="governance-model">
          <GovernanceModel />
        </section>
        <section id="execution-streams">
          <ExecutionStreams />
        </section>
        <section id="marketplaces">
          <ResourceMarketplaces />
        </section>
        <section id="to-value">
          <TOValue />
        </section>
        <section id="contributors">
          <Contributors />
        </section>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
