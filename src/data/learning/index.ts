// Learning Center Data Exports
export * from './types';
export * from './courses';
export * from './learningPaths';
export * from './resources';

import { enrolledCourses } from './courses';
import { learningPaths } from './learningPaths';
import { resources } from './resources';

// Learning Center Statistics
export const learningStats = {
  totalCourses: enrolledCourses.length,
  coursesInProgress: enrolledCourses.filter(c => c.status === 'in-progress').length,
  coursesCompleted: enrolledCourses.filter(c => c.status === 'completed').length,
  coursesNotStarted: enrolledCourses.filter(c => c.status === 'not-started').length,
  totalCredits: enrolledCourses.reduce((sum, course) => sum + course.credits, 0),
  creditsEarned: enrolledCourses
    .filter(c => c.status === 'completed')
    .reduce((sum, course) => sum + course.credits, 0),
  averageProgress: Math.round(
    enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length
  ),
  certificatesEarned: enrolledCourses.filter(c => c.stats.certificateEarned).length,
  totalLearningPaths: learningPaths.length,
  enrolledPaths: learningPaths.filter(p => p.enrolled).length,
  totalResources: resources.length,
  totalTimeInvested: calculateTotalTime(enrolledCourses.map(c => c.stats.timeInvested))
};

// Helper function to calculate total time
function calculateTotalTime(times: string[]): string {
  let totalMinutes = 0;
  
  times.forEach(time => {
    const match = time.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      totalMinutes += parseInt(match[1]) * 60 + parseInt(match[2]);
    }
  });
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
