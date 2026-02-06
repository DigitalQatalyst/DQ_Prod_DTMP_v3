import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { applicationPortfolio, projectPortfolio } from "@/data/portfolio";

const PortfolioTestPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Portfolio Management Test
          </h1>
          <p className="text-gray-600">
            Data import test
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Application Services: {applicationPortfolio.length}</p>
            <p>Project Services: {projectPortfolio.length}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioTestPage;