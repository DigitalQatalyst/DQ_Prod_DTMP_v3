 export interface ProjectsPortfolioService {
   id: string;
   title: string;
   description: string;
   icon: string;
   analyticsType: string;
   projectType: string;
   aiPowered: boolean;
   aiCapabilities: string[];
   dataSource: string;
   updateFrequency: string;
   visualizationType: string;
   complexity: "Low" | "Medium" | "High";
   accuracy: string;
   keyInsights: string[];
 }
 
 export const projectsPortfolio: ProjectsPortfolioService[] = [
   {
     id: "project-success-prediction",
     title: "Project Success Prediction Model",
     description: "AI model predicting project success probability based on historical data and current indicators",
     icon: "Target",
     analyticsType: "Success Prediction",
     projectType: "All Projects",
     aiPowered: true,
     aiCapabilities: ["Success Scoring", "Risk Prediction"],
     dataSource: "Project Management Tools",
     updateFrequency: "Daily",
     visualizationType: "Predictive Dashboard",
     complexity: "High",
     accuracy: "86% Accuracy",
     keyInsights: ["Success probability", "Risk factors", "Intervention recommendations"]
   },
   {
     id: "delivery-velocity-analytics",
     title: "Delivery Velocity Analytics",
     description: "Track and predict project delivery velocity with AI-powered trend analysis",
     icon: "Zap",
     analyticsType: "Velocity Analytics",
     projectType: "All Projects",
     aiPowered: true,
     aiCapabilities: ["Velocity Prediction", "Trend Analysis"],
     dataSource: "Project Management Tools",
     updateFrequency: "Real-time",
     visualizationType: "Trend Analysis",
     complexity: "Medium",
     accuracy: "91% Accuracy",
     keyInsights: ["Velocity trends", "Sprint predictions", "Throughput forecasts"]
   },
   {
     id: "resource-optimization-ai",
     title: "AI Resource Optimization",
     description: "Optimize resource allocation across projects using machine learning algorithms",
     icon: "Users",
     analyticsType: "Resource Analytics",
     projectType: "All Projects",
     aiPowered: true,
     aiCapabilities: ["Resource Optimization", "Allocation Prediction"],
     dataSource: "Resource Management",
     updateFrequency: "Weekly",
     visualizationType: "Heatmap",
     complexity: "High",
     accuracy: "89% Accuracy",
     keyInsights: ["Optimal allocation", "Utilization gaps", "Skill matching"]
   },
   {
     id: "risk-prediction-engine",
     title: "Project Risk Prediction Engine",
     description: "Predict project risks before they materialize using AI pattern recognition",
     icon: "ShieldAlert",
     analyticsType: "Risk Analytics",
     projectType: "Transformation Projects",
     aiPowered: true,
     aiCapabilities: ["Risk Prediction", "Impact Analysis"],
     dataSource: "All Sources",
     updateFrequency: "Daily",
     visualizationType: "Predictive Dashboard",
     complexity: "High",
     accuracy: "84% Accuracy",
     keyInsights: ["Risk probability", "Impact severity", "Mitigation strategies"]
   },
   {
     id: "timeline-forecasting",
     title: "Project Timeline Forecasting",
     description: "AI-powered forecasting of project completion dates based on current velocity and risks",
     icon: "Calendar",
     analyticsType: "Delivery Forecasting",
     projectType: "All Projects",
     aiPowered: true,
     aiCapabilities: ["Timeline Forecasting", "Delay Prediction"],
     dataSource: "Project Management Tools",
     updateFrequency: "Daily",
     visualizationType: "Forecast Chart",
     complexity: "High",
     accuracy: "88% Accuracy",
     keyInsights: ["Completion probability", "Delay risks", "Acceleration options"]
   },
   {
     id: "budget-variance-prediction",
     title: "Budget Variance Prediction",
     description: "Predict budget overruns and cost variances before they occur",
     icon: "DollarSign",
     analyticsType: "Resource Analytics",
     projectType: "All Projects",
     aiPowered: true,
     aiCapabilities: ["Cost Prediction", "Variance Analysis"],
     dataSource: "Financial Systems",
     updateFrequency: "Weekly",
     visualizationType: "Trend Analysis",
     complexity: "Medium",
     accuracy: "90% Accuracy",
     keyInsights: ["Budget forecast", "Variance drivers", "Cost control actions"]
   },
   {
     id: "quality-prediction-model",
     title: "Project Quality Prediction",
     description: "Predict quality outcomes and defect rates using historical patterns",
     icon: "CheckCircle",
     analyticsType: "Success Prediction",
     projectType: "IT Projects",
     aiPowered: true,
     aiCapabilities: ["Quality Scoring", "Defect Prediction"],
     dataSource: "Project Management Tools",
     updateFrequency: "Daily",
     visualizationType: "Predictive Dashboard",
     complexity: "High",
     accuracy: "87% Accuracy",
     keyInsights: ["Quality score", "Defect forecast", "Testing adequacy"]
   },
   {
     id: "stakeholder-sentiment-analysis",
     title: "Stakeholder Sentiment Analysis",
     description: "AI-powered analysis of stakeholder sentiment from communications and surveys",
     icon: "MessageSquare",
     analyticsType: "Success Prediction",
     projectType: "Transformation Projects",
     aiPowered: true,
     aiCapabilities: ["Sentiment Analysis", "Engagement Scoring"],
     dataSource: "All Sources",
     updateFrequency: "Weekly",
     visualizationType: "Dashboard",
     complexity: "Medium",
     accuracy: "82% Accuracy",
     keyInsights: ["Sentiment trends", "Engagement levels", "Concern areas"]
   },
   {
     id: "dependency-impact-intelligence",
     title: "Dependency Impact Intelligence",
     description: "Analyze project dependencies and predict cascade impacts of delays",
     icon: "GitBranch",
     analyticsType: "Risk Analytics",
     projectType: "All Projects",
     aiPowered: true,
     aiCapabilities: ["Impact Analysis", "Cascade Prediction"],
     dataSource: "Project Management Tools",
     updateFrequency: "Real-time",
     visualizationType: "Heatmap",
     complexity: "High",
     accuracy: "85% Accuracy",
     keyInsights: ["Dependency chains", "Impact radius", "Critical path risks"]
   },
   {
    id: "lessons-learned-intelligence",
    title: "Lessons Learned Intelligence",
    description: "AI-powered extraction and application of lessons learned from past projects",
    icon: "BookOpen",
    analyticsType: "Success Prediction",
    projectType: "All Projects",
    aiPowered: true,
    aiCapabilities: ["Pattern Recognition", "Recommendation Engine"],
    dataSource: "Project Management Tools",
    updateFrequency: "On-demand",
    visualizationType: "Dashboard",
    complexity: "Medium",
    accuracy: "84% Accuracy",
     keyInsights: ["Relevant lessons", "Success patterns", "Failure prevention"]
   }
 ];