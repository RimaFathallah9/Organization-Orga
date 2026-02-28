/**
 * Employer Intelligence Interface
 * 
 * Enable organizations to query and discover candidates with:
 * - Verified crisis management experience
 * - High-volatility environment exposure
 * - Specific skill combinations
 * - Impact Signal Strength ranking
 * - Verified competencies filtering
 */

export interface EmployerQuery {
  queryId: string;
  organizationId: string;
  criteria: {
    skillsRequired: Array<{ skillName: string; minLevel: number }>;
    minImpactSignalStrength?: number; // 0-100
    experienceInCrisis?: boolean;
    causePreference?: string[];
    minVerifiedTokens?: number;
  };
  resultsLimit?: number;
  createdDate: string;
}

export interface CandidateProfile {
  userId: string;
  name: string;
  location: string;
  skills: Array<{ skillName: string; level: number }>;
  totalVerifiedTokens: number;
  impactSignalStrength: number; // Composite score
  crisisExperienceCount: number;
  highVolatilityExposure: number; // 0-100
  causesExplored: string[];
  verifiedCompetencies: string[];
  readinessScores: {
    forLeadershipRole: number;
    forCrisisManagement: number;
    forStrategicRole: number;
  };
}

export interface CandidateSearchResult {
  candidateId: string;
  matchScore: number; // 0-100: how well they match criteria
  impactSignalStrength: number;
  skillMatches: Array<{ skillName: string; requiredLevel: number; actualLevel: number }>;
  crisisExperience: {
    incidentCount: number;
    averageImpact: number;
    largestScope: string;
  };
  recommendationReason: string;
  verificationStatus: 'verified' | 'partially_verified' | 'self_reported';
  contactReadiness: 'immediate' | 'available_soon' | 'interested';
}

export interface OrganizationProfile {
  organizationId: string;
  name: string;
  industryFocus: string;
  previousHires: number;
  avgPerformanceRating: number; // 1-5
  verificationTrustworthiness: number; // 0-100
}

/**
 * Parse and execute employer query
 * Natural language: "Find candidates with verified crisis management experience in high-volatility environments"
 */
export function executeEmployerQuery(
  query: EmployerQuery,
  candidateDatabase: CandidateProfile[]
): CandidateSearchResult[] {
  // Filter candidates based on criteria
  const matches = candidateDatabase.filter((candidate) => {
    // Check skills requirement
    const skillMatches = query.criteria.skillsRequired.every((req) => {
      const skill = candidate.skills.find((s) => s.skillName === req.skillName);
      return skill && skill.level >= req.minLevel;
    });

    if (!skillMatches) return false;

    // Check impact signal strength if specified
    if (query.criteria.minImpactSignalStrength) {
      if (candidate.impactSignalStrength < query.criteria.minImpactSignalStrength) {
        return false;
      }
    }

    // Check crisis experience if required
    if (query.criteria.experienceInCrisis) {
      if (candidate.crisisExperienceCount < 1) return false;
    }

    // Check cause preference if specified
    if (query.criteria.causePreference && query.criteria.causePreference.length > 0) {
      const hasCauseMatch = candidate.causesExplored.some((cause) =>
        query.criteria.causePreference!.includes(cause)
      );
      if (!hasCauseMatch) return false;
    }

    // Check minimum verified tokens if specified
    if (query.criteria.minVerifiedTokens) {
      if (candidate.totalVerifiedTokens < query.criteria.minVerifiedTokens) {
        return false;
      }
    }

    return true;
  });

  // Score and rank matches
  const rankedMatches = matches
    .map((candidate) => scoreCandidate(candidate, query.criteria))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, query.resultsLimit || 20);

  return rankedMatches;
}

/**
 * Score a candidate match against query criteria
 */
function scoreCandidate(
  candidate: CandidateProfile,
  criteria: EmployerQuery['criteria']
): CandidateSearchResult {
  let matchScore = 50; // baseline

  // Skill match scoring
  const skillScores: Array<{ skillName: string; requiredLevel: number; actualLevel: number }> =
    [];

  criteria.skillsRequired.forEach((requirement) => {
    const skill = candidate.skills.find((s) => s.skillName === requirement.skillName);
    const actualLevel = skill?.level || 0;

    skillScores.push({
      skillName: requirement.skillName,
      requiredLevel: requirement.minLevel,
      actualLevel,
    });

    // Add points for exceeding requirement
    if (actualLevel > requirement.minLevel) {
      matchScore += ((actualLevel - requirement.minLevel) / 10) * 5;
    } else if (actualLevel === requirement.minLevel) {
      matchScore += 5;
    } else {
      matchScore -= 5;
    }
  });

  // Impact signal strength (high strength = more credible)
  matchScore += (candidate.impactSignalStrength / 100) * 15;

  // Crisis experience bonus
  if (criteria.experienceInCrisis && candidate.crisisExperienceCount > 0) {
    matchScore += Math.min(10, candidate.crisisExperienceCount * 2);
  }

  // Volatility exposure
  matchScore += (candidate.highVolatilityExposure / 100) * 10;

  // Normalize to 0-100
  matchScore = Math.max(0, Math.min(100, matchScore));

  // Determine contact readiness
  const contactReadiness = determineContactReadiness(candidate);

  return {
    candidateId: candidate.userId,
    matchScore,
    impactSignalStrength: candidate.impactSignalStrength,
    skillMatches: skillScores,
    crisisExperience: {
      incidentCount: candidate.crisisExperienceCount,
      averageImpact: 75, // Placeholder
      largestScope: 'Regional initiative',
    },
    recommendationReason: generateRecommendationReason(candidate, criteria),
    verificationStatus: determineVerificationStatus(candidate),
    contactReadiness,
  };
}

/**
 * Generate a human-readable reason for the candidate recommendation
 */
function generateRecommendationReason(
  candidate: CandidateProfile,
  criteria: EmployerQuery['criteria']
): string {
  const strengths: string[] = [];

  // Identify key strengths
  if (candidate.impactSignalStrength > 80) {
    strengths.push('exceptionally strong track record');
  }
  if (candidate.crisisExperienceCount > 0) {
    strengths.push(`${candidate.crisisExperienceCount} verified crisis management experiences`);
  }
  if (candidate.highVolatilityExposure > 70) {
    strengths.push('extensive high-volatility environment exposure');
  }

  const requiredSkills = criteria.skillsRequired
    .map((s) => s.skillName)
    .slice(0, 2)
    .join(' and ');

  if (strengths.length > 0) {
    return `Strong match: ${strengths.join(', ')}. Demonstrated competence in ${requiredSkills}.`;
  }

  return `Qualified candidate with solid experience in ${requiredSkills}.`;
}

/**
 * Determine verification status
 */
function determineVerificationStatus(
  candidate: CandidateProfile
): 'verified' | 'partially_verified' | 'self_reported' {
  const verifiedTokenRatio = candidate.totalVerifiedTokens / Math.max(1, candidate.totalVerifiedTokens);

  if (verifiedTokenRatio > 0.8 && candidate.impactSignalStrength > 70) {
    return 'verified';
  } else if (candidate.totalVerifiedTokens > 0) {
    return 'partially_verified';
  } else {
    return 'self_reported';
  }
}

/**
 * Determine contact readiness
 */
function determineContactReadiness(candidate: CandidateProfile): 'immediate' | 'available_soon' | 'interested' {
  // Placeholder logic - in production would check availability
  if (candidate.totalVerifiedTokens >= 5) {
    return 'immediate';
  } else if (candidate.readinessScores.forLeadershipRole > 70) {
    return 'available_soon';
  } else {
    return 'interested';
  }
}

/**
 * Advanced query: Parse natural language employer request
 * Example: "Find crisis management leaders with environmental cause experience, impact strength > 75"
 */
export function parseNaturalLanguageQuery(
  queryText: string,
  organizationId: string
): EmployerQuery {
  const query: EmployerQuery = {
    queryId: `QUERY-${Date.now()}`,
    organizationId,
    criteria: {
      skillsRequired: [],
    },
    createdDate: new Date().toISOString(),
  };

  // Simple keyword-based parsing
  const textLower = queryText.toLowerCase();

  // Detect crisis/volatility keywords
  if (
    textLower.includes('crisis') ||
    textLower.includes('volatility') ||
    textLower.includes('emergency')
  ) {
    query.criteria.experienceInCrisis = true;
  }

  // Detect cause keywords
  if (textLower.includes('environment')) query.criteria.causePreference = ['Environment, Climate'];
  if (textLower.includes('education')) query.criteria.causePreference = ['Education'];
  if (textLower.includes('health')) query.criteria.causePreference = ['Health'];

  // Extract minimum impact signal strength
  const strengthMatch = queryText.match(/strength\s*[>>=]\s*(\d+)/i);
  if (strengthMatch) {
    query.criteria.minImpactSignalStrength = parseInt(strengthMatch[1]);
  }

  // Extract skill requirements
  const skills = ['leadership', 'communication', 'strategic', 'management', 'coordination'];
  skills.forEach((skill) => {
    if (textLower.includes(skill)) {
      const skillName = capitalizeSkillName(skill);
      query.criteria.skillsRequired.push({
        skillName,
        minLevel: extractMinLevel(queryText, skill) || 6,
      });
    }
  });

  return query;
}

/**
 * Get organization intelligence report
 */
export function generateOrganizationIntelligenceReport(
  organizationId: string,
  hireHistory: Array<{
    candidateId: string;
    impactSignalStrength: number;
    performanceRating: number;
    retentionMonths: number;
  }>,
  candidatePipeline: CandidateProfile[]
): OrganizationProfile & { recommendations: string[] } {
  const avgPerformance =
    hireHistory.length > 0
      ? hireHistory.reduce((sum, h) => sum + h.performanceRating, 0) / hireHistory.length
      : 3.5;

  const avgTokenStrength =
    hireHistory.length > 0
      ? hireHistory.reduce((sum, h) => sum + h.impactSignalStrength, 0) / hireHistory.length
      : 70;

  // Calculate trustworthiness (how well they identify quality candidates)
  const trustworthiness = Math.min(
    100,
    (avgPerformance / 5) * 70 + (avgTokenStrength / 100) * 30
  );

  // Recommendations
  const recommendations: string[] = [];

  if (avgPerformance < 3.5) {
    recommendations.push('Consider refining candidate selection criteria');
  }

  if (candidatePipeline.length < 5) {
    recommendations.push('Build larger candidate pipeline for better selection');
  }

  const highQualityCandidates = candidatePipeline.filter((c) => c.impactSignalStrength > 75);
  if (highQualityCandidates.length === 0) {
    recommendations.push('No high-impact candidates available. Consider expanding search criteria.');
  } else {
    recommendations.push(
      `${highQualityCandidates.length} high-quality candidates available in pipeline.`
    );
  }

  return {
    organizationId,
    name: 'Sample Organization',
    industryFocus: 'Nonprofit',
    previousHires: hireHistory.length,
    avgPerformanceRating: Math.round(avgPerformance * 10) / 10,
    verificationTrustworthiness: Math.round(trustworthiness),
    recommendations,
  };
}

/**
 * Get fairness audit for hiring process
 */
export function auditHiringFairness(
  searchResults: CandidateSearchResult[],
  selectedCandidates: string[]
): {
  fairnessScore: number;
  potentialBias: string[];
  underrepresentedCauses: string[];
  recommendations: string[];
} {
  // Simple fairness analysis
  const fairnessScore =
    selectedCandidates.length > 0 ? (selectedCandidates.length / searchResults.length) * 100 : 0;

  const potentialBias: string[] = [];
  const lowMatchSelected = selectedCandidates.some((candidateId) => {
    const candidate = searchResults.find((r) => r.candidateId === candidateId);
    return candidate && candidate.matchScore < 60;
  });

  if (lowMatchSelected) {
    potentialBias.push('Some selected candidates have lower match scores. Verify selection criteria.');
  }

  const allSameCause = searchResults.every((r) => r.skillMatches[0]?.skillName === searchResults[0].skillMatches[0]?.skillName);
  if (allSameCause) {
    potentialBias.push('All results focus on same skill area. Consider broadening search.');
  }

  return {
    fairnessScore: Math.round(fairnessScore),
    potentialBias,
    underrepresentedCauses: ['Education', 'Healthcare'],
    recommendations: [
      'Review hiring criteria for potential unconscious bias',
      'Ensure diverse cause backgrounds in selection',
      'Document decision rationale for transparency',
    ],
  };
}

/**
 * Helper: Capitalize skill names
 */
function capitalizeSkillName(skill: string): string {
  const map: Record<string, string> = {
    leadership: 'Leadership',
    communication: 'Communication',
    strategic: 'Strategic Decision Making',
    management: 'Project Management',
    coordination: 'Team Coordination',
  };
  return map[skill] || skill;
}

/**
 * Helper: Extract minimum level from query
 */
function extractMinLevel(queryText: string, skill: string): number | null {
  const regex = new RegExp(`${skill}\\s*[>>=]*\\s*(\\d+)`, 'i');
  const match = queryText.match(regex);
  return match ? parseInt(match[1]) : null;
}
