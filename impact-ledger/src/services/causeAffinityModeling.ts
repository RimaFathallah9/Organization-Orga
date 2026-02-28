/**
 * Cause Affinity & Motivation Modeling
 * 
 * Using embedding analysis and clustering:
 * - Identify thematic cause alignment
 * - Match users based on skill AND intrinsic motivation
 * - Detect long-term passion patterns
 */

export interface CauseProfile {
  userId: string;
  primaryCause: string;
  secondaryCauses: string[];
  causeAffinityScores: Record<string, number>; // Cause -> alignment score (0-100)
  motivationType: 'intrinsic' | 'extrinsic' | 'blended';
  passionIntensity: number; // 0-100: how passionate user is
  passionStability: number; // 0-100: consistency of passion over time
  engagementPattern: 'sustained' | 'opportunistic' | 'episodic';
}

export interface CauseCluster {
  clusterId: string;
  themeName: string;
  description: string;
  relatedCauses: string[];
  thematicEmbedding: number[]; // Simplified embedding vector
  userCount: number;
}

export interface MotivationSignal {
  userId: string;
  signalType: 'cause_alignment' | 'skill_growth' | 'mission_repeat' | 'peer_influence' | 'impact_seeking';
  strength: number; // 0-100: signal strength
  evidence: string;
  timestamp: string;
}

export interface PassionTrajectory {
  userId: string;
  timeWindow: '3months' | '6months' | '1year' | 'lifetime';
  trendDirection: 'increasing' | 'stable' | 'decreasing' | 'cyclical';
  passionScores: Array<{ timestamp: string; score: number }>;
  insights: string;
}

/**
 * Build cause affinity profile from user behavior
 */
export function buildCauseAffinityProfile(
  userId: string,
  completedMissions: Array<{
    organization: string;
    missionTags: string[];
    description: string;
    userRating?: number;
    reflections?: string;
  }>,
  _userSkills: Array<{ skillName: string; level: number }> = []
): CauseProfile {
  // Extract cause signals from mission history
  const causeSignals = extractCauseSignals(completedMissions);

  // Calculate affinity scores
  const affinityScores = calculateCauseAffinityScores(causeSignals);

  // Determine motivation type
  const motivationType = determineMotivationType(completedMissions, _userSkills);

  // Calculate passion metrics
  const { passionIntensity, passionStability } = calculatePassionMetrics(
    completedMissions,
    causeSignals
  );

  // Determine engagement pattern
  const engagementPattern = analyzeEngagementPattern(completedMissions);

  // Find primary cause
  const sortedCauses = Object.entries(affinityScores).sort(([, a], [, b]) => b - a);
  const primaryCause = sortedCauses[0]?.[0] || 'Community Service';
  const secondaryCauses = sortedCauses.slice(1, 3).map(([cause]) => cause);

  return {
    userId,
    primaryCause,
    secondaryCauses,
    causeAffinityScores: affinityScores,
    motivationType,
    passionIntensity,
    passionStability,
    engagementPattern,
  };
}

/**
 * Extract cause-related signals from missions
 */
function extractCauseSignals(
  missions: Array<{ organization: string; missionTags: string[]; description: string; userRating?: number }>
): Record<string, number> {
  const causeMap: Record<string, string[]> = {
    'Environment & Climate': ['climate', 'environment', 'sustainability', 'conservation', 'green', 'carbon'],
    'Education & Youth': ['education', 'youth', 'school', 'training', 'learning', 'student'],
    'Health & Wellness': ['health', 'medical', 'wellness', 'mental health', 'disease', 'hospital'],
    'Social Justice': ['justice', 'equity', 'discrimination', 'inequality', 'rights', 'civil rights'],
    'Poverty & Hunger': ['poverty', 'hunger', 'food', 'homeless', 'economic hardship', 'welfare'],
    'Community Development': ['community', 'neighborhood', 'infrastructure', 'urban', 'rural development'],
    'Technology & Innovation': ['tech', 'technology', 'innovation', 'digital', 'ai', 'coding'],
    'Governance & Civic': ['governance', 'civic', 'democracy', 'policy', 'political', 'voting'],
  };

  const signalCounts: Record<string, number> = {};

  missions.forEach((mission) => {
    const text = `${mission.description} ${mission.missionTags.join(' ')}`.toLowerCase();
    let matchingCause: string | null = null;
    let maxMatches = 0;

    Object.entries(causeMap).forEach(([cause, keywords]) => {
      const matches = keywords.filter((keyword) => text.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        matchingCause = cause;
      }
    });

    if (matchingCause) {
      signalCounts[matchingCause] = (signalCounts[matchingCause] || 0) + 1;
    }
  });

  return signalCounts;
}

/**
 * Cluster causes into thematic groups
 */
// Note: This function is calculated but not currently used in the current implementation
/*
function _clusterCauses(_causeSignals: Record<string, number>): Record<string, string[]> {
  const clusters: Record<string, string[]> = {
    'social_welfare': ['Community Development', 'Poverty & Hunger', 'Social Justice'],
    'personal_development': ['Education & Youth', 'Health & Wellness'],
    'global_impact': ['Environment & Climate', 'Governance & Civic'],
    'innovation': ['Technology & Innovation'],
  };

  return clusters;
}
*/

/**
 * Calculate affinity score for each cause (0-100)
 */
function calculateCauseAffinityScores(
  causeSignals: Record<string, number>
): Record<string, number> {
  const scores: Record<string, number> = {};
  const totalSignals = Object.values(causeSignals).reduce((a, b) => a + b, 0);

  if (totalSignals === 0) {
    return { 'General Community Service': 50 };
  }

  Object.entries(causeSignals).forEach(([cause, count]) => {
    scores[cause] = Math.round((count / totalSignals) * 100);
  });

  return scores;
}

/**
 * Determine user's motivation type
 */
function determineMotivationType(
  missions: Array<any>,
  _userSkills: Array<{ skillName: string; level: number }>
): 'intrinsic' | 'extrinsic' | 'blended' {
  // Intrinsic: missions chosen for personal growth/meaning
  // Extrinsic: missions chosen for credentials/advancement
  // Blended: both motivations present

  const skillGrowthMissions = missions.filter(
    (m) => m.skillsGained && Object.keys(m.skillsGained).length > 0
  ).length;
  const credentialMissions = missions.filter(
    (m) => m.verifiedToken === true
  ).length;

  const skillRatio = skillGrowthMissions / (missions.length || 1);
  const credentialRatio = credentialMissions / (missions.length || 1);

  if (skillRatio > 0.6 && credentialRatio < 0.4) return 'intrinsic';
  if (credentialRatio > 0.6 && skillRatio < 0.4) return 'extrinsic';
  return 'blended';
}

/**
 * Calculate passion intensity and stability
 */
function calculatePassionMetrics(
  missions: Array<any>,
  causeSignals: Record<string, number>
): { passionIntensity: number; passionStability: number } {
  // Passion intensity: how strongly user commits to causes
  const totalMissions = missions.length;
  const focusedMissions = Math.max(...Object.values(causeSignals), 1);
  const passionIntensity = Math.min(100, (focusedMissions / totalMissions) * 100 + 20);

  // Passion stability: consistency in cause selection
  const causeDistribution = Object.values(causeSignals);
  const avgCauseCount = causeDistribution.reduce((a, b) => a + b, 0) / causeDistribution.length;
  const variance =
    causeDistribution.reduce((sum, count) => sum + Math.pow(count - avgCauseCount, 2), 0) /
    causeDistribution.length;
  const stdDev = Math.sqrt(variance);

  // Lower stdDev = higher consistency
  const passionStability = Math.max(0, 100 - stdDev * 10);

  return { passionIntensity: Math.round(passionIntensity), passionStability: Math.round(passionStability) };
}

/**
 * Analyze user's engagement pattern with causes
 */
function analyzeEngagementPattern(
  missions: Array<any>
): 'sustained' | 'opportunistic' | 'episodic' {
  if (missions.length < 2) return 'opportunistic';

  // Sort by date
  const sortedMissions = [...missions].sort(
    (a, b) => new Date(a.completedDate).getTime() - new Date(b.completedDate).getTime()
  );

  // Calculate time gaps between missions
  const gaps: number[] = [];
  for (let i = 1; i < sortedMissions.length; i++) {
    const gap =
      (new Date(sortedMissions[i].completedDate).getTime() -
        new Date(sortedMissions[i - 1].completedDate).getTime()) /
      (1000 * 60 * 60 * 24); // Convert to days
    gaps.push(gap);
  }

  if (gaps.length === 0) return 'opportunistic';

  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const gapVariance =
    gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
  const gapStdDev = Math.sqrt(gapVariance);

  // Sustained: frequent and consistent (low gap, low variance)
  if (avgGap < 30 && gapStdDev < 20) return 'sustained';
  // Episodic: sporadic and variable (high gap, high variance)
  if (avgGap > 60 && gapStdDev > 30) return 'episodic';
  // Opportunistic: moderate and variable
  return 'opportunistic';
}

/**
 * Find users with similar cause affinity for community building
 */
export function findSimilarCauseMatches(
  userProfile: CauseProfile,
  otherProfiles: CauseProfile[],
  matchThreshold: number = 0.6
): Array<{ userId: string; affinitySimilarity: number; sharedCauses: string[] }> {
  const matches: Array<any> = [];

  otherProfiles.forEach((other) => {
    // Calculate cause overlap
    const userCauses = Object.keys(userProfile.causeAffinityScores);
    const otherCauses = Object.keys(other.causeAffinityScores);
    const sharedCauses = userCauses.filter((cause) => otherCauses.includes(cause));

    if (sharedCauses.length > 0) {
      // Calculate Jaccard similarity
      const unionSize = new Set([...userCauses, ...otherCauses]).size;
      const similarity = sharedCauses.length / unionSize;

      if (similarity > matchThreshold) {
        matches.push({
          userId: other.userId,
          affinitySimilarity: Math.round(similarity * 100),
          sharedCauses,
        });
      }
    }
  });

  return matches.sort((a, b) => b.affinitySimilarity - a.affinitySimilarity);
}

/**
 * Track passion trajectory over time
 */
export function calculatePassionTrajectory(
  userId: string,
  missionHistory: Array<{ completedDate: string; cause?: string }>,
  timeWindow: '3months' | '6months' | '1year' | 'lifetime' = '1year'
): PassionTrajectory {
  const windowDays: Record<string, number> = {
    '3months': 90,
    '6months': 180,
    '1year': 365,
    'lifetime': 10000,
  };

  const daysToInclude = windowDays[timeWindow];
  const cutoffDate = new Date(Date.now() - daysToInclude * 24 * 60 * 60 * 1000);

  // Filter missions within time window
  const relevantMissions = missionHistory.filter(
    (m) => new Date(m.completedDate) >= cutoffDate
  );

  if (relevantMissions.length === 0) {
    return {
      userId,
      timeWindow,
      trendDirection: 'stable',
      passionScores: [],
      insights: 'No missions in this time period.',
    };
  }

  // Calculate passion score at regular intervals
  const intervals = 4; // Calculate 4 time points
  const passionScores: Array<{ timestamp: string; score: number }> = [];

  for (let i = 0; i < intervals; i++) {
    const intervalDate = new Date(cutoffDate.getTime() + (daysToInclude / intervals) * i * 24 * 60 * 60 * 1000);
    const missionsUpToDate = relevantMissions.filter((m) => new Date(m.completedDate) <= intervalDate);

    const score = Math.min(100, missionsUpToDate.length * 15 + 10); // Simple scoring
    passionScores.push({
      timestamp: intervalDate.toISOString(),
      score,
    });
  }

  // Determine trend
  if (passionScores.length >= 2) {
    const firstScore = passionScores[0].score;
    const lastScore = passionScores[passionScores.length - 1].score;

    let trendDirection: 'increasing' | 'stable' | 'decreasing' | 'cyclical' = 'stable';
    if (lastScore > firstScore * 1.2) trendDirection = 'increasing';
    else if (lastScore < firstScore * 0.8) trendDirection = 'decreasing';
    else trendDirection = 'stable';

    return {
      userId,
      timeWindow,
      trendDirection,
      passionScores,
      insights: `User shows ${trendDirection} engagement with their causes over the past ${timeWindow}.`,
    };
  }

  return {
    userId,
    timeWindow,
    trendDirection: 'stable',
    passionScores,
    insights: 'Limited data for trend analysis.',
  };
}

/**
 * Detect motivation signals
 */
export function detectMotivationSignals(
  userId: string,
  recentMissions: Array<any>,
  userProfile: CauseProfile,
  _communityActivity: Array<any> = []
): MotivationSignal[] {
  const signals: MotivationSignal[] = [];

  // Signal 1: Cause alignment
  if (userProfile.passionIntensity > 70) {
    signals.push({
      userId,
      signalType: 'cause_alignment',
      strength: userProfile.passionIntensity,
      evidence: `Strong alignment with ${userProfile.primaryCause}`,
      timestamp: new Date().toISOString(),
    });
  }

  // Signal 2: Skill growth seeking
  const skillGrowthMissions = recentMissions.filter((m) => m.skillsGained).length;
  if (skillGrowthMissions > recentMissions.length * 0.7) {
    signals.push({
      userId,
      signalType: 'skill_growth',
      strength: 80,
      evidence: `${skillGrowthMissions} of last ${recentMissions.length} missions focused on skill development`,
      timestamp: new Date().toISOString(),
    });
  }

  // Signal 3: Mission repeat (loyalty)
  const missionOrgs = recentMissions.map((m) => m.organization);
  const orgCounts = Object.values(
    missionOrgs.reduce((acc: Record<string, number>, org) => {
      acc[org] = (acc[org] || 0) + 1;
      return acc;
    }, {})
  ) as number[];

  if (Math.max(...orgCounts) > 1) {
    signals.push({
      userId,
      signalType: 'mission_repeat',
      strength: 70,
      evidence: 'User has returned to work with same organization multiple times',
      timestamp: new Date().toISOString(),
    });
  }

  return signals;
}
