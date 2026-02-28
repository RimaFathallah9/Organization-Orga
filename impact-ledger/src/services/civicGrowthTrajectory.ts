/**
 * Civic Growth Trajectory Modeling
 * 
 * Track longitudinal development and:
 * - Detect skill stagnation
 * - Recommend diversification
 * - Predict optimal next mission type
 * - Visualize transformation over time
 */

export interface GrowthTrajectory {
  userId: string;
  timespan: number; // days since first mission
  totalMissions: number;
  growthPhase: 'exploration' | 'acceleration' | 'mastery' | 'stagnation';
  trajectoryHealth: number; // 0-100: overall health of growth
  skillVelocity: number; // skills/month
  completionConsistency: number; // 0-100: consistency of mission completion
}

export interface SkillStagnationAlert {
  userId: string;
  skillName: string;
  lastImprovedDate: string;
  daysSinceImprovement: number;
  severity: 'warning' | 'critical';
  recommendation: string;
}

export interface DiversificationScore {
  userId: string;
  categoryDiversity: number; // 0-100: spread across skill categories
  causesDiversity: number; // 0-100: spread across causes
  missionTypeDiversity: number; // 0-100: spread across mission types
  overallDiversity: number; // 0-100: composite diversity
  underrepresentedAreas: string[];
  diversificationRecommendations: string[];
}

export interface OptimalMissionRecommendation {
  missionType: string;
  skillsFocused: string[];
  cause: string;
  rationale: string;
  expectedImpact: string;
  priority: 1 | 2 | 3; // 1 = highest priority
}

export interface TransformationMilestone {
  date: string;
  from: string; // skill/role
  to: string; // skill/role
  growthPercentage: number;
  timeToAchieve: number; // days
  impactfulMissions: string[];
}

/**
 * Analyze user's civic growth trajectory
 */
export function analyzeGrowthTrajectory(
  userId: string,
  missionHistory: Array<{
    completedDate: string;
    skillsGained: Record<string, number>;
    organizationVerified: boolean;
  }>,
  currentSkillLevels: Record<string, number>
): GrowthTrajectory {
  if (missionHistory.length === 0) {
    return {
      userId,
      timespan: 0,
      totalMissions: 0,
      growthPhase: 'exploration',
      trajectoryHealth: 30,
      skillVelocity: 0,
      completionConsistency: 0,
    };
  }

  const sortedMissions = [...missionHistory].sort(
    (a, b) => new Date(a.completedDate).getTime() - new Date(b.completedDate).getTime()
  );

  const firstMissionDate = new Date(sortedMissions[0].completedDate);
  const lastMissionDate = new Date(sortedMissions[sortedMissions.length - 1].completedDate);
  const timespan = Math.floor(
    (lastMissionDate.getTime() - firstMissionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const skillVelocity = (Object.values(currentSkillLevels).reduce((a, b) => a + b, 0) / 30) *
    (30 / (timespan || 1)); // skills/month

  const completionConsistency = calculateCompletionConsistency(sortedMissions);
  const growthPhase = determineGrowthPhase(skillVelocity, missionHistory.length, timespan);
  const trajectoryHealth = calculateTrajectoryHealth(
    skillVelocity,
    completionConsistency,
    missionHistory.length
  );

  return {
    userId,
    timespan,
    totalMissions: missionHistory.length,
    growthPhase,
    trajectoryHealth: Math.round(trajectoryHealth),
    skillVelocity: Math.round(skillVelocity * 100) / 100,
    completionConsistency: Math.round(completionConsistency),
  };
}

/**
 * Calculate mission completion consistency
 */
function calculateCompletionConsistency(missions: Array<any>): number {
  if (missions.length < 2) return 50;

  const dates = missions.map((m) => new Date(m.completedDate).getTime());
  const gaps: number[] = [];

  for (let i = 1; i < dates.length; i++) {
    gaps.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24)); // days
  }

  if (gaps.length === 0) return 0;

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
  const coefficient = Math.sqrt(variance) / avgGap; // Coefficient of variation

  // Lower coefficient = higher consistency
  return Math.max(0, Math.min(100, 100 - coefficient * 20));
}

/**
 * Determine growth phase based on metrics
 */
function determineGrowthPhase(
  skillVelocity: number,
  totalMissions: number,
  timespan: number
): 'exploration' | 'acceleration' | 'mastery' | 'stagnation' {
  if (totalMissions < 3) return 'exploration';

  const avgMissionsPerMonth = (totalMissions / timespan) * 30;

  if (skillVelocity > 0.8 && avgMissionsPerMonth > 1) return 'acceleration';
  if (skillVelocity > 0.3 && avgMissionsPerMonth > 0.5) return 'mastery';
  if (skillVelocity < 0.1 && avgMissionsPerMonth < 0.25) return 'stagnation';

  return 'acceleration';
}

/**
 * Calculate overall trajectory health
 */
function calculateTrajectoryHealth(
  skillVelocity: number,
  completionConsistency: number,
  totalMissions: number
): number {
  const velocityScore = Math.min(100, skillVelocity * 50);
  const consistencyScore = completionConsistency;
  const volumeScore = Math.min(100, totalMissions * 10);

  return (velocityScore * 0.4 + consistencyScore * 0.35 + volumeScore * 0.25) / 100;
}

/**
 * Detect skill stagnation
 */
export function detectSkillStagnation(
  userId: string,
  missionHistory: Array<{ completedDate: string; skillsGained: Record<string, number> }>,
  currentDate: Date = new Date()
): SkillStagnationAlert[] {
  const alerts: SkillStagnationAlert[] = [];

  const skillLastImproved: Record<string, string> = {};

  // Track when each skill was last improved
  missionHistory.forEach((mission) => {
    Object.keys(mission.skillsGained).forEach((skill) => {
      if (mission.skillsGained[skill] > 0) {
        skillLastImproved[skill] = mission.completedDate;
      }
    });
  });

  // Check for stagnation (3+ months without improvement)
  const stagnationThreshold = 90; // days
  const criticalThreshold = 180; // days

  Object.entries(skillLastImproved).forEach(([skill, lastDate]) => {
    const daysSince = Math.floor(
      (currentDate.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince > stagnationThreshold) {
      const severity = daysSince > criticalThreshold ? 'critical' : 'warning';
      alerts.push({
        userId,
        skillName: skill,
        lastImprovedDate: lastDate,
        daysSinceImprovement: daysSince,
        severity,
        recommendation:
          severity === 'critical'
            ? `Urgent: ${skill} has not improved in ${daysSince} days. Seek targeted missions immediately.`
            : `Consider missions that develop ${skill} to prevent skill atrophy.`,
      });
    }
  });

  return alerts.sort((a, b) => b.daysSinceImprovement - a.daysSinceImprovement);
}

/**
 * Calculate diversification score
 */
export function calculateDiversificationScore(
  userId: string,
  missionHistory: Array<{
    skillsRequired: string[];
    cause: string;
    missionType: string;
  }>
): DiversificationScore {
  if (missionHistory.length < 2) {
    return {
      userId,
      categoryDiversity: 30,
      causesDiversity: 30,
      missionTypeDiversity: 30,
      overallDiversity: 30,
      underrepresentedAreas: [
        'Consider exploring new skill categories',
        'Expand across different causes',
        'Try different mission types',
      ],
      diversificationRecommendations: [
        'Take missions across multiple skill categories',
        'Explore different social causes',
        'Try remote, hybrid, and local missions',
      ],
    };
  }

  // Category diversity
  const allSkills = new Set<string>();
  const skillCounts: Record<string, number> = {};

  missionHistory.forEach((mission) => {
    mission.skillsRequired.forEach((skill) => {
      allSkills.add(skill);
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const categoryDiversity = (allSkills.size / Math.max(allSkills.size, 10)) * 100;

  // Cause diversity
  const causesSet = new Set(missionHistory.map((m) => m.cause));
  const causesDiversity = (causesSet.size / Math.max(causesSet.size, 5)) * 100;

  // Mission type diversity
  const typesSet = new Set(missionHistory.map((m) => m.missionType));
  const missionTypeDiversity = (typesSet.size / 3) * 100; // Assume 3 types max
  
  // Overall diversity (composite)
  const overallDiversity = (categoryDiversity * 0.4 + causesDiversity * 0.4 + missionTypeDiversity * 0.2) / 100;

  // Identify underrepresented areas
  const underrepresentedAreas: string[] = [];
  if (categoryDiversity < 60) underrepresentedAreas.push('Cross-functional skills');
  if (causesDiversity < 60) underrepresentedAreas.push(`Explore ${6 - causesSet.size} more causes`);
  if (missionTypeDiversity < 80) underrepresentedAreas.push('Try different mission modalities');

  const recommendations: string[] = [];
  if (categoryDiversity < 50) {
    recommendations.push('Expand into new skill areas (Management, Technical, Creative, etc.)');
  }
  if (causesDiversity < 50) {
    recommendations.push('Explore missions across different social causes');
  }
  if (missionTypeDiversity < 66) {
    recommendations.push('Balance Remote, Hybrid, and Local mission experiences');
  }

  return {
    userId,
    categoryDiversity: Math.round(categoryDiversity),
    causesDiversity: Math.round(causesDiversity),
    missionTypeDiversity: Math.round(missionTypeDiversity),
    overallDiversity: Math.round(overallDiversity * 100),
    underrepresentedAreas,
    diversificationRecommendations: recommendations,
  };
}

/**
 * Predict optimal next mission type
 */
export function predictOptimalNextMission(
  missionHistory: Array<{
    missionType: string;
    skillsFocused: string[];
    cause: string;
    completedDate: string;
    outcome: number; // satisfaction score 0-100
  }>,
  currentSkillLevels: Record<string, number>,
  _previouslyCompletedMissions: Set<string>
): OptimalMissionRecommendation[] {
  const recommendations: OptimalMissionRecommendation[] = [];

  // 1. Find skill gaps
  const allSkillsNeeded = [
    'Leadership',
    'Project Management',
    'Communication',
    'Strategic Decision Making',
    'Resource Management',
  ];
  const skillGaps = allSkillsNeeded.filter((s) => (currentSkillLevels[s] || 0) < 6);

  // 2. Find underexplored causes
  const causeFrequency: Record<string, number> = {};
  missionHistory.forEach((m) => {
    causeFrequency[m.cause] = (causeFrequency[m.cause] || 0) + 1;
  });

  const underexploredCauses = [
    'Environment',
    'Education',
    'Health',
    'Social Justice',
    'Community Development',
  ].filter((c) => (causeFrequency[c] || 0) === 0);

  // 3. Generate recommendations
  if (skillGaps.length > 0) {
    recommendations.push({
      missionType: `${skillGaps[0]} Leadership Role`,
      skillsFocused: [skillGaps[0], 'Communication'],
      cause: underexploredCauses[0] || 'Community Service',
      rationale: `Close gap in ${skillGaps[0]} while exploring new cause area`,
      expectedImpact: `+2-3 levels in ${skillGaps[0]}, +1 level in related skills`,
      priority: 1,
    });
  }

  // 4. Diversification recommendation
  if (underexploredCauses.length > 0) {
    recommendations.push({
      missionType: 'Cross-cause exploration mission',
      skillsFocused: ['Adaptability', 'Learning'],
      cause: underexploredCauses[0],
      rationale: `Broaden impact across new cause: ${underexploredCauses[0]}`,
      expectedImpact: 'Discover unexpected skill synergies, expand network',
      priority: 2,
    });
  }

  return recommendations;
}

/**
 * Identify transformation milestones
 */
export function identifyTransformationMilestones(
  missionHistory: Array<{
    completedDate: string;
    title: string;
    skillsGained: Record<string, number>;
  }>,
  skillHistory: Array<{
    skillName: string;
    level: number;
    date: string;
  }>
): TransformationMilestone[] {
  const milestones: TransformationMilestone[] = [];

  // Find significant skill jumps (3+ levels)
  const skillProgression: Record<string, Array<{ date: string; level: number }>> = {};

  skillHistory.forEach((entry) => {
    if (!skillProgression[entry.skillName]) {
      skillProgression[entry.skillName] = [];
    }
    skillProgression[entry.skillName].push({ date: entry.date, level: entry.level });
  });

  Object.entries(skillProgression).forEach(([skill, progression]) => {
    if (progression.length >= 2) {
      for (let i = 1; i < progression.length; i++) {
        const levelGain = progression[i].level - progression[i - 1].level;

        if (levelGain >= 3) {
          const fromLevel = progression[i - 1].level;
          const toLevel = progression[i].level;
          const fromDate = new Date(progression[i - 1].date);
          const toDate = new Date(progression[i].date);
          const timeToAchieve = Math.floor(
            (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Find impactful missions
          const impactfulMissions = missionHistory
            .filter((m) => {
              const missionDate = new Date(m.completedDate);
              return missionDate >= fromDate && missionDate <= toDate;
            })
            .map((m) => m.title)
            .slice(0, 3);

          milestones.push({
            date: progression[i].date,
            from: `${skill} Level ${fromLevel}`,
            to: `${skill} Level ${toLevel}`,
            growthPercentage: ((levelGain / (fromLevel || 1)) * 100),
            timeToAchieve,
            impactfulMissions,
          });
        }
      }
    }
  });

  return milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Generate transformation visualization data
 */
export function generateTransformationVisualization(
  _userId: string,
  skillHistory: Array<{ skillName: string; level: number; date: string }>
): Array<{ date: string; skillName: string; level: number }> {
  // Sort by date
  const sorted = [...skillHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Return chronological skill progression for charting
  return sorted;
}
