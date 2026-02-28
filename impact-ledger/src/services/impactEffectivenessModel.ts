/**
 * Impact Effectiveness Model
 * 
 * Weighted scoring system that evaluates real-world contribution quality using:
 * - Scope and scale of initiative
 * - Complexity level
 * - Degree of autonomy
 * - Measurable outcomes
 * - Organizational verification
 * - Peer evaluation
 * 
 * Generates "Impact Signal Strength" score determining credibility weight
 * of each Verified Impact Token
 */

export interface ImpactVerification {
  missionId: string;
  organizationVerified: boolean;
  verificationDate?: string;
  verificationNotes?: string;
  verifierRole: string;
}

export interface MeasurableOutcome {
  metric: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  verified: boolean;
}

export interface ImpactEffectivenessScore {
  missionId: string;
  scopeScore: number; // 0-100
  complexityScore: number; // 0-100
  autonomyScore: number; // 0-100
  outcomeScore: number; // 0-100
  organizationVerificationScore: number; // 0-100
  peerEvaluationScore: number; // 0-100
  compositeImpactSignalStrength: number; // 0-100: overall credibility weight
  tokenWeight: number; // 0-1: multiplier for token value
  credibilityMultiplier: number; // 0-1: adjustment factor based on verification
  breakdown: Record<string, number>;
}

/**
 * Calculate comprehensive impact effectiveness score for a completed mission
 * Takes into account multiple dimensions of contribution quality
 */
export function calculateImpactEffectivenessScore(
  missionData: {
    id: string;
    title: string;
    description: string;
    organization: string;
    location: string;
    teamSize?: number;
    budget?: number;
    duration?: number; // weeks
    measurableOutcomes?: MeasurableOutcome[];
    userResponsibilityLevel?: 'task' | 'project' | 'initiative';
  },
  verification: ImpactVerification,
  peerFeedback: Array<{ score: number; comment: string }> = []
): ImpactEffectivenessScore {
  // Calculate individual dimension scores
  const scopeScore = calculateScopeScore(missionData);
  const complexityScore = calculateComplexityScore(missionData);
  const autonomyScore = calculateAutonomyScore(missionData);
  const outcomeScore = calculateOutcomeScore(missionData.measurableOutcomes || []);
  const orgVerificationScore = calculateOrganizationVerificationScore(verification);
  const peerEvaluationScore = calculatePeerEvaluationScore(peerFeedback);

  // Weighted composite score (Impact Signal Strength)
  const weights = {
    scope: 0.15,
    complexity: 0.20,
    autonomy: 0.15,
    outcome: 0.25,
    orgVerification: 0.15,
    peerEvaluation: 0.10,
  };

  const compositeScore =
    scopeScore * weights.scope +
    complexityScore * weights.complexity +
    autonomyScore * weights.autonomy +
    outcomeScore * weights.outcome +
    orgVerificationScore * weights.orgVerification +
    peerEvaluationScore * weights.peerEvaluation;

  // Calculate token weight (0-1): how much this token is worth
  const tokenWeight = compositeScore / 100;

  // Calculate credibility multiplier based on verification status
  const credibilityMultiplier = calculateCredibilityMultiplier(verification, peerFeedback.length);

  return {
    missionId: missionData.id,
    scopeScore: Math.round(scopeScore),
    complexityScore: Math.round(complexityScore),
    autonomyScore: Math.round(autonomyScore),
    outcomeScore: Math.round(outcomeScore),
    organizationVerificationScore: Math.round(orgVerificationScore),
    peerEvaluationScore: Math.round(peerEvaluationScore),
    compositeImpactSignalStrength: Math.round(compositeScore),
    tokenWeight: Math.round(tokenWeight * 1000) / 1000,
    credibilityMultiplier: Math.round(credibilityMultiplier * 1000) / 1000,
    breakdown: {
      scope: scopeScore,
      complexity: complexityScore,
      autonomy: autonomyScore,
      outcome: outcomeScore,
      orgVerification: orgVerificationScore,
      peerEvaluation: peerEvaluationScore,
    },
  };
}

/**
 * Calculate scope score based on initiative size and reach
 * Considers team size, budget, and geographic scope
 */
function calculateScopeScore(missionData: any): number {
  let score = 30; // baseline

  // Team size impact
  const teamSize = missionData.teamSize || 1;
  if (teamSize >= 50) score += 30;
  else if (teamSize >= 20) score += 25;
  else if (teamSize >= 10) score += 20;
  else if (teamSize >= 5) score += 15;
  else if (teamSize > 1) score += 10;

  // Budget impact (higher budget = higher scope)
  const budget = missionData.budget || 0;
  if (budget >= 100000) score += 20;
  else if (budget >= 50000) score += 15;
  else if (budget >= 10000) score += 10;
  else if (budget >= 1000) score += 5;

  // Duration impact
  const duration = missionData.duration || 1; // weeks
  if (duration >= 26) score += 10; // 6+ months
  else if (duration >= 12) score += 8;
  else if (duration >= 4) score += 5;

  return Math.min(100, score);
}

/**
 * Calculate complexity score based on task difficulty and skill requirements
 */
function calculateComplexityScore(missionData: any): number {
  let score = 20; // baseline

  // Responsibility level
  if (missionData.userResponsibilityLevel === 'initiative') score += 40;
  else if (missionData.userResponsibilityLevel === 'project') score += 30;
  else if (missionData.userResponsibilityLevel === 'task') score += 15;

  // Description complexity (heuristic: longer description often = more complex)
  const descriptionLength = missionData.description?.length || 0;
  if (descriptionLength > 500) score += 15;
  else if (descriptionLength > 200) score += 10;
  else if (descriptionLength > 100) score += 5;

  // Assume required skills contribute to complexity
  score += 10;

  return Math.min(100, score);
}

/**
 * Calculate autonomy score based on decision-making authority
 */
function calculateAutonomyScore(missionData: any): number {
  let score = 20; // baseline

  // Responsibility level indicates autonomy
  if (missionData.userResponsibilityLevel === 'initiative') score += 50;
  else if (missionData.userResponsibilityLevel === 'project') score += 35;
  else if (missionData.userResponsibilityLevel === 'task') score += 15;

  // Team structure (leading others = more autonomy)
  const teamSize = missionData.teamSize || 1;
  if (teamSize >= 10) score += 15;
  else if (teamSize >= 5) score += 10;
  else if (teamSize > 1) score += 5;

  return Math.min(100, score);
}

/**
 * Calculate outcome score based on measurable results achieved
 */
function calculateOutcomeScore(measurableOutcomes: MeasurableOutcome[]): number {
  if (measurableOutcomes.length === 0) return 30; // No metrics = moderate score

  let totalAchievementRate = 0;
  let verifiedCount = 0;

  measurableOutcomes.forEach((outcome) => {
    const achievementRate = Math.min(1, outcome.actualValue / outcome.targetValue);
    totalAchievementRate += achievementRate;

    if (outcome.verified) verifiedCount++;
  });

  const avgAchievementRate = totalAchievementRate / measurableOutcomes.length;
  const verificationBonus = (verifiedCount / measurableOutcomes.length) * 20; // up to 20 points

  return Math.round(avgAchievementRate * 80 + verificationBonus);
}

/**
 * Calculate organization verification score
 */
function calculateOrganizationVerificationScore(verification: ImpactVerification): number {
  let score = 0;

  if (verification.organizationVerified) {
    score += 80; // Base score for verification

    // Additional points for detailed verification
    if (verification.verificationNotes && verification.verificationNotes.length > 50) {
      score += 15;
    }

    // Points based on verifier authority
    const authorityBonus: Record<string, number> = {
      'Executive Director': 15,
      'Manager': 10,
      'Coordinator': 5,
      'Peer': 2,
    };

    score += authorityBonus[verification.verifierRole] || 5;
  } else {
    score = 20; // Low score for unverified
  }

  return Math.min(100, score);
}

/**
 * Calculate peer evaluation score from peer feedback
 */
function calculatePeerEvaluationScore(peerFeedback: Array<{ score: number; comment: string }>): number {
  if (peerFeedback.length === 0) return 40; // Neutral if no feedback

  const avgScore = peerFeedback.reduce((sum, fb) => sum + fb.score, 0) / peerFeedback.length;

  // Normalize to 0-100 scale if feedback scores are 1-5
  const normalizedScore = avgScore > 5 ? avgScore : avgScore * 20;

  // Feedback count bonus: more feedback = more credible
  const feedbackBonus = Math.min(20, peerFeedback.length * 2);

  return Math.min(100, normalizedScore + feedbackBonus);
}

/**
 * Calculate credibility multiplier based on verification status
 * Prevents unverified claims from inflating token value
 */
function calculateCredibilityMultiplier(
  verification: ImpactVerification,
  peerFeedbackCount: number
): number {
  let multiplier = 0.5; // Unverified starts at 0.5x

  if (verification.organizationVerified) {
    multiplier = 1.0; // Full multiplier for org verification
  }

  // Add peer verification boost
  if (peerFeedbackCount >= 3) {
    multiplier = Math.min(1.2, multiplier + 0.1);
  } else if (peerFeedbackCount >= 1) {
    multiplier = Math.min(1.1, multiplier + 0.05);
  }

  return multiplier;
}

/**
 * Detect anomalous impact claims (potential fraud/inflation)
 */
export function detectAnomalousImpactClaims(
  userMissions: Array<{ score: ImpactEffectivenessScore; outcomes: MeasurableOutcome[] }>
): { isAnomalous: boolean; riskScore: number; flaggedItems: string[] } {
  const flaggedItems: string[] = [];
  let riskScore = 0;

  // Check for statistical outliers
  const scores = userMissions.map((m) => m.score.compositeImpactSignalStrength);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const stdDev = Math.sqrt(
    scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length
  );

  userMissions.forEach((mission) => {
    const zScore = Math.abs((mission.score.compositeImpactSignalStrength - avgScore) / (stdDev || 1));

    if (zScore > 3) {
      flaggedItems.push(`Outlier score detected: ${mission.score.missionId}`);
      riskScore += 15;
    }

    // Check for outcome inflation
    mission.outcomes.forEach((outcome) => {
      if (outcome.actualValue > outcome.targetValue * 2) {
        flaggedItems.push(`Potential outcome inflation in ${mission.score.missionId}`);
        riskScore += 10;
      }
    });
  });

  // Check for unverified high-impact claims
  userMissions.forEach((mission) => {
    if (
      mission.score.compositeImpactSignalStrength > 80 &&
      mission.score.organizationVerificationScore < 30
    ) {
      flaggedItems.push(`High impact claim without verification: ${mission.score.missionId}`);
      riskScore += 20;
    }
  });

  return {
    isAnomalous: riskScore > 20,
    riskScore: Math.min(100, riskScore),
    flaggedItems,
  };
}

/**
 * Generate impact narrative based on effectiveness score
 */
export function generateImpactNarrative(score: ImpactEffectivenessScore): string {
  const strength = score.compositeImpactSignalStrength;

  if (strength >= 85) {
    return `This mission demonstrates exceptional impact across all dimensions. The verified outcomes, high autonomy, and organizational endorsement create a strong signal of transformative contribution.`;
  } else if (strength >= 70) {
    return `This mission shows strong impact with solid outcomes and verification. The contribution demonstrates both scope and meaningful results.`;
  } else if (strength >= 50) {
    return `This mission represents a meaningful contribution with moderate impact. The verified outcomes support the credibility of the experience.`;
  } else {
    return `This mission demonstrates participation and contribution. Additional verification and outcome measurement would strengthen the impact signal.`;
  }
}
