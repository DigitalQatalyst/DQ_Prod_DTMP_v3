export interface Review {
  id: string;
  reviewer: { name: string; avatar: string };
  date: string;
  rating: number;
  courseName: string;
  courseId: string;
  title?: string;
  text: string;
  verified: boolean;
  helpfulCount: number;
  completionStatus: "Completed" | "In Progress";
}

export const reviews: Review[] = [
  {
    id: "review-001",
    reviewer: { name: "Sarah Mitchell", avatar: "S" },
    date: "2 weeks ago",
    rating: 5,
    courseName: "Digital Transformation Fundamentals",
    courseId: "dt-fundamentals",
    title: "Transformed our approach to digital initiatives",
    text: "This course provided exactly the framework we needed. The DBP model is now central to how we plan and execute transformation projects across the enterprise. The instructors were knowledgeable and the content was immediately applicable to our work.",
    verified: true,
    helpfulCount: 24,
    completionStatus: "Completed"
  },
  {
    id: "review-002",
    reviewer: { name: "James Chen", avatar: "J" },
    date: "1 month ago",
    rating: 5,
    courseName: "Enterprise Architecture for Digital Leaders",
    courseId: "enterprise-arch",
    title: "Excellent for architects transitioning to digital",
    text: "As an enterprise architect, this course filled critical gaps in my understanding of digital platform architecture. The hands-on exercises were particularly valuable. I've already applied several frameworks from this course to our current platform modernization initiative.",
    verified: true,
    helpfulCount: 18,
    completionStatus: "Completed"
  },
  {
    id: "review-003",
    reviewer: { name: "Maria Rodriguez", avatar: "M" },
    date: "3 days ago",
    rating: 4,
    courseName: "4D Transformation Model Mastery",
    courseId: "4d-model-mastery",
    title: "Great framework, needs more examples",
    text: "The 4D model is powerful and well-explained. Would benefit from more real-world implementation examples, but overall very comprehensive. The instructor's experience in transformation really shows through in the delivery.",
    verified: true,
    helpfulCount: 12,
    completionStatus: "In Progress"
  },
  {
    id: "review-004",
    reviewer: { name: "David Park", avatar: "D" },
    date: "2 months ago",
    rating: 5,
    courseName: "Transformation Leadership Program",
    courseId: "transformation-leadership",
    title: "Worth every minute for executives",
    text: "This executive program exceeded expectations. Directly applicable to our transformation office setup. The cohort format enabled great peer learning. I've built lasting relationships with other transformation leaders through this program.",
    verified: true,
    helpfulCount: 31,
    completionStatus: "Completed"
  },
  {
    id: "review-005",
    reviewer: { name: "Lisa Thompson", avatar: "L" },
    date: "1 week ago",
    rating: 4,
    courseName: "Change Leadership in Transformation",
    courseId: "change-leadership",
    title: "Practical change management strategies",
    text: "Very practical course with actionable strategies. The instructor's experience shows through. Minor: could use more digital-specific case studies. Overall, a solid foundation for anyone leading change initiatives.",
    verified: false,
    helpfulCount: 9,
    completionStatus: "Completed"
  },
  {
    id: "review-006",
    reviewer: { name: "Robert Kim", avatar: "R" },
    date: "3 weeks ago",
    rating: 5,
    courseName: "DBP Capability Framework Deep Dive",
    courseId: "dbp-capability",
    title: "Essential for understanding DBP domains",
    text: "This deep dive is essential for anyone working with the DBP framework. The 12 domains are explained clearly with excellent examples of capability mapping. I now have a much better understanding of how capabilities connect across the enterprise.",
    verified: true,
    helpfulCount: 22,
    completionStatus: "Completed"
  },
  {
    id: "review-007",
    reviewer: { name: "Amanda Foster", avatar: "A" },
    date: "5 days ago",
    rating: 5,
    courseName: "AI in Digital Transformation",
    courseId: "ai-transformation",
    title: "Cutting-edge content on AI applications",
    text: "This workshop format was perfect for exploring AI use cases in transformation. The hands-on labs helped solidify concepts. Highly recommend for technical leads. The content is current and the instructors are clearly experts in applying AI practically.",
    verified: true,
    helpfulCount: 16,
    completionStatus: "Completed"
  },
  {
    id: "review-008",
    reviewer: { name: "Michael Brown", avatar: "M" },
    date: "1 month ago",
    rating: 4,
    courseName: "Portfolio Management Excellence",
    courseId: "portfolio-mgmt-cert",
    title: "Comprehensive portfolio management coverage",
    text: "Covers both application and project portfolio management well. The certification exam was challenging but fair. Great for portfolio managers transitioning to digital. The templates and tools provided are immediately useful.",
    verified: true,
    helpfulCount: 14,
    completionStatus: "Completed"
  },
  {
    id: "review-009",
    reviewer: { name: "Jennifer Lee", avatar: "J" },
    date: "2 days ago",
    rating: 5,
    courseName: "Agile Transformation Methods",
    courseId: "agile-transformation",
    title: "Best agile course I've taken",
    text: "Clear, practical, and immediately applicable. The focus on enterprise-scale agile transformation sets this apart from other agile courses. I particularly appreciated the sections on scaling and organizational change.",
    verified: true,
    helpfulCount: 7,
    completionStatus: "In Progress"
  },
  {
    id: "review-010",
    reviewer: { name: "Thomas Anderson", avatar: "T" },
    date: "1 week ago",
    rating: 4,
    courseName: "Strategic Roadmap Development",
    courseId: "strategic-roadmap",
    title: "Solid roadmap creation course",
    text: "Solid course on roadmap creation. The templates provided are very useful. Could expand on stakeholder alignment aspects. Overall, a good foundation for anyone needing to create and communicate transformation roadmaps.",
    verified: false,
    helpfulCount: 11,
    completionStatus: "Completed"
  },
  {
    id: "review-011",
    reviewer: { name: "Patricia Garcia", avatar: "P" },
    date: "3 months ago",
    rating: 5,
    courseName: "Transformation Leader Pathway",
    courseId: "transformation-leader",
    title: "Career-changing learning track",
    text: "This learning track comprehensively prepared me for my transformation leader role. The progression through courses is well-designed and the certification is respected. I've been promoted since completing this track.",
    verified: true,
    helpfulCount: 28,
    completionStatus: "Completed"
  },
  {
    id: "review-012",
    reviewer: { name: "Kevin White", avatar: "K" },
    date: "2 weeks ago",
    rating: 5,
    courseName: "Cloud Architecture Fundamentals",
    courseId: "cloud-architecture",
    title: "Perfect bridge to cloud-native thinking",
    text: "For architects moving to cloud-native platforms, this is the course you need. Covers migration strategies and architecture patterns comprehensively. The hands-on labs in real cloud environments were invaluable.",
    verified: true,
    helpfulCount: 19,
    completionStatus: "Completed"
  }
];

export const reviewsFilters = {
  contentType: ["Courses", "Learning Tracks", "Instructors"],
  rating: ["5 stars", "4+ stars", "3+ stars", "All"],
  verifiedLearner: ["Yes", "All"],
  completionStatus: ["Completed", "In Progress", "All"],
  date: ["Last week", "Last month", "Last 3 months", "All time"]
};
