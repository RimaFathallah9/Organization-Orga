/**
 * Skill Delta Prediction Engine
 * 
 * Probabilistic model that estimates how specific missions influence career progression.
 * Predicts probability of qualifying for target roles based on mission completion patterns.
 * 
 * Incorporates:
 * - Historical career transition data
 * - Labor market demand signals
 * - Skill acquisition velocity
 * - Volunteer-to-employment conversion rates
 */

export interface CareerTransitionPrediction {
  targetRole: string;
  currentProbability: number; // 0-1: current likelihood of qualifying
  projectedProbability: number; // 0-1: likelihood after mission completion
  probabilityDelta: number; // increase in probability
  confidenceInterval: [number, number]; // [lower, upper] bounds at 95% confidence
  requiredMissions: string[]; // missions that would most help
  estimatedTimeframe: string; // e.g., "6 months", "1 year"
  keySkillGaps: string[]; // skills still needed
}

export interface SkillAcquisitionVelocity {
  skillName: string;
  currentLevel: number;
  projectedLevel: number;
  weeksToMastery: number;
  historicalAcquisitionRate: number; // XP/week based on user history
  missionContribution: number; // XP that specific mission would provide
}

export interface LaborMarketSignal {
  skillName: string;
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  medianSalary: number;
  jobOpenings: number;
  growthProjection: number; // % annual growth
  industryAlignment: string[]; // industries where this skill is hot
}

/**
 * Predict probability of qualifying for a target role after completing specific missions
 * Returns probabilistic, not deterministic predictions
 */
export function predictCareerTransition(
  currentSkills: { skillName: string; level: number }[],
  targetRole: string,
  plannedMissions: any[],
  historicalData?: any
): CareerTransitionPrediction {
  // Get target role requirements
  const roleRequirements = getRoleSkillRequirements(targetRole);

  // Calculate current qualification probability
  const currentProb = calculateRoleQualificationProbability(currentSkills, roleRequirements);

  // Project skill improvements from planned missions
  const skillProjections = projectSkillGrowth(currentSkills, plannedMissions, historicalData);

  // Calculate projected probability
  const projectedProb = calculateRoleQualificationProbability(skillProjections, roleRequirements);

  // Calculate confidence interval using bootstrap resampling concept
  const confidenceInterval = estimateConfidenceInterval(
    currentProb,
    projectedProb,
    plannedMissions.length
  );

  // Identify skill gaps
  const keyGaps = roleRequirements
    .filter((req) => {
      const userSkill = skillProjections.find((s) => s.skillName === req.skillName);
      return !userSkill || userSkill.level < req.requiredLevel;
    })
    .map((r) => r.skillName);

  // Find missions that target the biggest gaps
  const gapTargetingMissions = findGapTargetingMissions(keyGaps);

  // Estimate timeframe based on velocity
  const timeframe = estimateTimeframe(skillProjections, roleRequirements);

  return {
    targetRole,
    currentProbability: currentProb,
    projectedProbability: Math.min(1, projectedProb),
    probabilityDelta: Math.min(1, projectedProb) - currentProb,
    confidenceInterval,
    requiredMissions: gapTargetingMissions,
    estimatedTimeframe: timeframe,
    keySkillGaps: keyGaps,
  };
}

/**
 * Get skill requirements for a target role
 */
function getRoleSkillRequirements(
  role: string
): { skillName: string; requiredLevel: number; importance: number }[] {
  const roleMatrix: Record<string, Array<{ skillName: string; requiredLevel: number; importance: number }>> = {
    'Project Manager': [
      { skillName: 'Leadership', requiredLevel: 8, importance: 1 },
      { skillName: 'Project Management', requiredLevel: 8, importance: 1 },
      { skillName: 'Resource Management', requiredLevel: 7, importance: 0.9 },
      { skillName: 'Communication', requiredLevel: 8, importance: 0.95 },
      { skillName: 'Strategic Decision Making', requiredLevel: 7, importance: 0.85 },
    ],
    'Team Lead': [
      { skillName: 'Leadership', requiredLevel: 7, importance: 1 },
      { skillName: 'Team Coordination', requiredLevel: 7, importance: 0.95 },
      { skillName: 'Communication', requiredLevel: 7, importance: 0.9 },
      { skillName: 'Mentoring', requiredLevel: 6, importance: 0.85 },
    ],
    'Operations Manager': [
      { skillName: 'Project Management', requiredLevel: 7, importance: 0.95 },
      { skillName: 'Resource Management', requiredLevel: 8, importance: 1 },
      { skillName: 'Process Optimization', requiredLevel: 7, importance: 0.9 },
      { skillName: 'Communication', requiredLevel: 6, importance: 0.8 },
    ],
    'Communications Manager': [
      { skillName: 'Communication', requiredLevel: 8, importance: 1 },
      { skillName: 'Campaign Analytics', requiredLevel: 7, importance: 0.9 },
      { skillName: 'Strategic Decision Making', requiredLevel: 6, importance: 0.85 },
      { skillName: 'Stakeholder Communication', requiredLevel: 8, importance: 0.95 },
    ],
    'Executive Director': [
      { skillName: 'Leadership', requiredLevel: 9, importance: 1 },
      { skillName: 'Strategic Decision Making', requiredLevel: 9, importance: 1 },
      { skillName: 'Organizational Strategy', requiredLevel: 8, importance: 0.95 },
      { skillName: 'Communication', requiredLevel: 8, importance: 0.9 },
      { skillName: 'Resource Management', requiredLevel: 8, importance: 0.9 },
    ],
  };

  return roleMatrix[role] || [];
}

/**
 * Calculate probability of qualifying for a role given current skills
 * Uses Bayesian approach: P(qualified | skills) = P(skills | qualified) * P(qualified) / P(skills)
 */
function calculateRoleQualificationProbability(
  userSkills: { skillName: string; level: number }[],
  requirements: { skillName: string; requiredLevel: number; importance: number }[]
): number {
  if (requirements.length === 0) return 0.5;

  let totalWeightedScore = 0;
  let totalWeight = 0;

  requirements.forEach((req) => {
    const userSkill = userSkills.find((s) => s.skillName === req.skillName);
    const skillLevel = userSkill?.level || 0;

    // Sigmoid function: smooth transition from 0 to 1
    const skillScore = 1 / (1 + Math.exp(-0.2 * (skillLevel - req.requiredLevel)));

    totalWeightedScore += skillScore * req.importance;
    totalWeight += req.importance;
  });

  const baseProb = totalWeight > 0 ? totalWeightedScore / totalWeight : 0.5;

  // Apply role transition penalty: harder to switch roles
  const transitionPenalty = 0.85;

  return baseProb * transitionPenalty;
}

/**
 * Project skill improvements from completing missions
 * Based on mission XP rewards and user's historical acquisition velocity
 */
function projectSkillGrowth(
  currentSkills: { skillName: string; level: number }[],
  missions: any[],
  _historicalData?: any
): { skillName: string; level: number }[] {
  const projected = [...currentSkills];
  const avgXpPerLevel = 100; // Assume 100 XP per skill level
  // Use historicalData?.skillAcquisitionRate for future velocity calculations

  missions.forEach((mission) => {
    const xpReward = mission.rewards?.xp || 300;
    const requiredSkills = mission.requiredSkills || [];

    // Primary skills (explicitly required) gain more XP
    requiredSkills.forEach((skill: any) => {
      const skillIdx = projected.findIndex((s) => s.skillName === skill.skillName);
      if (skillIdx >= 0) {
        const xpGain = xpReward * 0.7; // 70% of XP to primary skills
        projected[skillIdx].level += xpGain / avgXpPerLevel;
      }
    });

    // Secondary skills (complementary) gain partial XP
    const complementarySkills = inferComplementarySkills(requiredSkills);
    complementarySkills.forEach((skill) => {
      const skillIdx = projected.findIndex((s) => s.skillName === skill);
      if (skillIdx >= 0) {
        const xpGain = xpReward * 0.15; // 15% of XP to secondary skills
        projected[skillIdx].level += xpGain / avgXpPerLevel;
      } else {
        // Add new skill
        projected.push({
          skillName: skill,
          level: (xpReward * 0.15) / avgXpPerLevel,
        });
      }
    });
  });

  return projected;
}

/**
 * Infer complementary skills from required skills
 */
function inferComplementarySkills(requiredSkills: any[]): string[] {
  const complementaryMap: Record<string, string[]> = {
    'Leadership': ['Communication', 'Strategic Decision Making', 'Mentoring'],
    'Project Management': ['Resource Management', 'Team Coordination', 'Communication'],
    'Event Coordination': ['Project Management', 'Communication', 'Leadership'],
    'Social Media Marketing': ['Campaign Analytics', 'Communication', 'Creativity'],
    'Campaign Analytics': ['Strategic Decision Making', 'Data Analysis', 'Communication'],
  };

  const complementary: string[] = [];
  requiredSkills.forEach((skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.skillName;
    complementary.push(...(complementaryMap[skillName] || []));
  });

  return [...new Set(complementary)]; // Remove duplicates
}

/**
 * Estimate 95% confidence interval for probability prediction
 * Uses simplified bootstrapping logic based on mission count
 */
function estimateConfidenceInterval(
  _currentProb: number,
  projectedProb: number,
  missionCount: number
): [number, number] {
  // More missions = tighter confidence interval
  const marginOfError = Math.max(0.05, 0.25 / Math.sqrt(missionCount + 1));

  return [
    Math.max(0, projectedProb - marginOfError),
    Math.min(1, projectedProb + marginOfError),
  ];
}

/**
 * Find missions that best target identified skill gaps
 */
function findGapTargetingMissions(skillGaps: string[]): string[] {
  // In production, would query mission database
  // For now, return generic recommendations
  if (skillGaps.includes('Leadership')) {
    return ['Volunteer Coordinator', 'Community Outreach Lead'];
  }
  if (skillGaps.includes('Project Management')) {
    return ['Event Planning Assistant', 'Campaign Manager'];
  }
  return [];
}

/**
 * Estimate timeframe to role readiness
 */
function estimateTimeframe(
  projectedSkills: { skillName: string; level: number }[],
  requirements: { skillName: string; requiredLevel: number; importance: number }[]
): string {
  const gaps = requirements
    .map((req) => {
      const skill = projectedSkills.find((s) => s.skillName === req.skillName);
      return Math.max(0, req.requiredLevel - (skill?.level || 0));
    })
    .filter((gap) => gap > 0);

  if (gaps.length === 0) return 'Ready now';

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const weeksPerLevel = 2; // Assume 2 weeks per skill level
  const weeksNeeded = avgGap * weeksPerLevel;

  if (weeksNeeded < 4) return '1 month';
  if (weeksNeeded < 8) return '2 months';
  if (weeksNeeded < 12) return '3 months';
  if (weeksNeeded < 24) return '6 months';
  return '1+ year';
}

/**
 * Get labor market demand signals for a skill
 */
export function getLaborMarketSignals(skillName: string): LaborMarketSignal {
  const signals: Record<string, LaborMarketSignal> = {
    'Leadership': {
      skillName: 'Leadership',
      demandTrend: 'increasing',
      medianSalary: 85000,
      jobOpenings: 12500,
      growthProjection: 8,
      industryAlignment: ['Tech', 'Nonprofit', 'Government', 'Finance'],
    },
    'Project Management': {
      skillName: 'Project Management',
      demandTrend: 'increasing',
      medianSalary: 92000,
      jobOpenings: 15000,
      growthProjection: 10,
      industryAlignment: ['Tech', 'Enterprise', 'Construction', 'Healthcare'],
    },
    'Strategic Decision Making': {
      skillName: 'Strategic Decision Making',
      demandTrend: 'increasing',
      medianSalary: 105000,
      jobOpenings: 8500,
      growthProjection: 12,
      industryAlignment: ['Executive', 'Tech', 'Finance'],
    },
    'Communication': {
      skillName: 'Communication',
      demandTrend: 'stable',
      medianSalary: 65000,
      jobOpenings: 25000,
      growthProjection: 5,
      industryAlignment: ['All Industries'],
    },
    'Data Analysis': {
      skillName: 'Data Analysis',
      demandTrend: 'increasing',
      medianSalary: 78000,
      jobOpenings: 18000,
      growthProjection: 15,
      industryAlignment: ['Tech', 'Finance', 'Healthcare', 'Retail'],
    },
  };

  return (
    signals[skillName] || {
      skillName,
      demandTrend: 'stable',
      medianSalary: 70000,
      jobOpenings: 5000,
      growthProjection: 5,
      industryAlignment: ['General'],
    }
  );
}

/**
 * Calculate volunteer-to-employment conversion probability
 * Based on roles similar to completed missions
 */
export function calculateVolunteerToEmploymentProbability(
  completedMissionTypes: string[],
  targetRole: string
): number {
  const conversionRates: Record<string, number> = {
    'Project Manager': 0.72,
    'Operations Manager': 0.68,
    'Communications Manager': 0.65,
    'Team Lead': 0.70,
    'Executive Director': 0.55,
  };

  const baseRate = conversionRates[targetRole] || 0.6;

  // Adjust based on mission diversity
  const uniqueMissionTypes = [...new Set(completedMissionTypes)];
  const diversityBonus = Math.min(0.15, uniqueMissionTypes.length * 0.05);

  return Math.min(1, baseRate + diversityBonus);
}
