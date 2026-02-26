 export interface DigitalMaturityService {
   id: string;
   title: string;
   description: string;
   icon: string;
   analyticsType: string;
   assessmentScope: string;
   framework: string;
   aiPowered: boolean;
   aiCapabilities: string[];
   assessmentFrequency: string;
   outputFormat: string;
   complexity: "Low" | "Medium" | "High";
   accuracy: string;
   keyInsights: string[];
 }
 
 export const digitalMaturity: DigitalMaturityService[] = [
   {
    id: "dbp-maturity-assessment",
    title: "DBP Maturity Assessment",
    description: "Comprehensive AI-powered assessment of digital business platform maturity across all 12 domains",
    icon: "TrendingUp",
    analyticsType: "DBP Maturity",
    assessmentScope: "Enterprise",
    framework: "DBP Framework",
    aiPowered: true,
    aiCapabilities: ["Auto-scoring", "Gap Analysis", "Recommendation Engine"],
    assessmentFrequency: "Quarterly",
    outputFormat: "Interactive Dashboard",
    complexity: "High",
    accuracy: "93% Accuracy",
     keyInsights: ["Maturity by domain", "Gap analysis", "Improvement roadmap"]
   },
   {
     id: "transformation-readiness-score",
     title: "Transformation Readiness Score",
     description: "AI-driven assessment of organizational readiness for digital transformation",
     icon: "Gauge",
     analyticsType: "Organizational Maturity",
     assessmentScope: "Enterprise",
     framework: "Custom Framework",
     aiPowered: true,
     aiCapabilities: ["Readiness Scoring", "Risk Identification"],
     assessmentFrequency: "On-demand",
     outputFormat: "PDF Report",
     complexity: "Medium",
     accuracy: "88% Accuracy",
     keyInsights: ["Readiness score", "Risk factors", "Enabler recommendations"]
   },
   {
    id: "capability-maturity-tracking",
    title: "Capability Maturity Tracking",
    description: "Continuous tracking of business capability maturity with trend analysis",
    icon: "Target",
    analyticsType: "Capability Maturity",
    assessmentScope: "Domain",
    framework: "DBP Framework",
    aiPowered: true,
    aiCapabilities: ["Trend Analysis", "Benchmark Comparison"],
    assessmentFrequency: "Continuous",
    outputFormat: "Interactive Dashboard",
    complexity: "Medium",
    accuracy: "91% Accuracy",
     keyInsights: ["Capability scores", "Maturity trends", "Peer benchmarks"]
   },
   {
     id: "technology-maturity-index",
     title: "Technology Maturity Index",
     description: "Assess technology stack maturity and currency with upgrade recommendations",
     icon: "Cpu",
     analyticsType: "Technology Maturity",
     assessmentScope: "Enterprise",
     framework: "Industry Standard",
     aiPowered: true,
     aiCapabilities: ["Auto-scoring", "Upgrade Prioritization"],
     assessmentFrequency: "Semi-Annual",
     outputFormat: "Excel Scorecard",
     complexity: "High",
     accuracy: "92% Accuracy",
     keyInsights: ["Tech debt score", "EOL risks", "Modernization priorities"]
   },
   {
    id: "process-maturity-evaluation",
    title: "Process Maturity Evaluation",
    description: "Evaluate process maturity across transformation and operational processes",
    icon: "GitBranch",
    analyticsType: "Process Maturity",
    assessmentScope: "Enterprise",
    framework: "CMMI",
    aiPowered: true,
    aiCapabilities: ["Auto-scoring", "Best Practice Matching"],
    assessmentFrequency: "Annual",
    outputFormat: "PPTX Presentation",
    complexity: "High",
    accuracy: "89% Accuracy",
     keyInsights: ["Process scores", "Best practice gaps", "Improvement areas"]
   },
   {
     id: "benchmark-intelligence",
     title: "Industry Benchmark Intelligence",
     description: "AI-powered benchmarking against industry peers and best-in-class organizations",
     icon: "BarChart3",
     analyticsType: "DBP Maturity",
     assessmentScope: "Enterprise",
     framework: "DBP Framework",
     aiPowered: true,
     aiCapabilities: ["Benchmark Comparison", "Peer Analysis"],
     assessmentFrequency: "Quarterly",
     outputFormat: "Interactive Dashboard",
     complexity: "Medium",
     accuracy: "85% Accuracy",
     keyInsights: ["Industry position", "Best practice gaps", "Competitive insights"]
   },
   {
    id: "maturity-roadmap-generator",
    title: "Maturity Roadmap Generator",
    description: "AI-generated improvement roadmap based on current maturity and target state",
    icon: "Map",
    analyticsType: "DBP Maturity",
    assessmentScope: "Enterprise",
    framework: "DBP Framework",
    aiPowered: true,
    aiCapabilities: ["Roadmap Generation", "Prioritization Engine"],
    assessmentFrequency: "On-demand",
    outputFormat: "PPTX Presentation",
    complexity: "High",
    accuracy: "86% Accuracy",
     keyInsights: ["Phased roadmap", "Quick wins", "Strategic initiatives"]
   },
   {
     id: "continuous-maturity-monitoring",
     title: "Continuous Maturity Monitoring",
     description: "Real-time maturity tracking with automated alerts for regression or improvements",
     icon: "Activity",
     analyticsType: "DBP Maturity",
     assessmentScope: "Enterprise",
     framework: "DBP Framework",
     aiPowered: true,
     aiCapabilities: ["Trend Analysis", "Anomaly Detection"],
     assessmentFrequency: "Continuous",
     outputFormat: "Interactive Dashboard",
     complexity: "Medium",
     accuracy: "90% Accuracy",
     keyInsights: ["Maturity trends", "Regression alerts", "Improvement velocity"]
   }
 ];