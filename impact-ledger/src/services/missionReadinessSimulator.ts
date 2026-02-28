/**
 * Mission Readiness Simulation Engine
 * 
 * Reinforcement-learning-based scenario simulator where users:
 * - Face real-world leadership challenges
 * - Make strategic decisions
 * - Receive performance feedback
 * - Use simulation performance to refine readiness scores
 */

export interface SimulationScenario {
  scenarioId: string;
  title: string;
  description: string;
  context: string;
  challengeType: 'leadership' | 'crisis' | 'resource-management' | 'team-conflict' | 'strategic';
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=easy, 5=expert
  timeLimit: number; // minutes
  skillsTestedRequired: string[];
}

export interface DecisionPoint {
  pointId: string;
  questionText: string;
  options: Array<{
    optionId: string;
    text: string;
    rationale: string;
    expectedOutcome: string;
    skillsApplied: string[];
  }>;
}

export interface SimulationResult {
  simulationId: string;
  userId: string;
  scenarioId: string;
  timestamp: string;
  decisionsChain: Array<{ pointId: string; chosenOptionId: string; timeTaken: number }>;
  performanceMetrics: {
    score: number; // 0-100
    decisionQuality: number; // 0-100
    timeEfficiency: number; // 0-100
    outcomeSuccess: number; // 0-100
    leadershipDemonstration: number; // 0-100
  };
  feedback: string;
  skillsImproved: Array<{ skillName: string; improvementLevel: number }>;
  readinessAdjustment: number; // -10 to +10 adjustment to readiness score
}

export interface ReadinessAssessment {
  userId: string;
  targetRole: string;
  baseReadinessScore: number; // From verified experience
  simulationBonus: number; // Bonus from simulation performance
  finalReadinessScore: number; // 0-100
  readinessBands: Record<string, number>;
  recommendations: string[];
}

/**
 * Load predefined simulation scenarios
 */
export function getSimulationScenarios(): SimulationScenario[] {
  return [
    {
      scenarioId: 'scenario-001',
      title: 'Budget Crisis Response',
      description: 'Your organization faces a 30% budget cut mid-year. How do you respond?',
      context:
        'You lead a team of 8 people with various projects in flight. Budget has been slashed unexpectedly due to economic downturn.',
      challengeType: 'crisis',
      difficulty: 4,
      timeLimit: 15,
      skillsTestedRequired: ['Strategic Decision Making', 'Resource Management', 'Communication'],
    },
    {
      scenarioId: 'scenario-002',
      title: 'Team Conflict Escalation',
      description: 'Two key team members have a severe conflict affecting project delivery.',
      context:
        'Your team is 2 weeks from a major mission deadline. Your best technical resource is in conflict with your team lead.',
      challengeType: 'team-conflict',
      difficulty: 3,
      timeLimit: 10,
      skillsTestedRequired: ['Leadership', 'Communication', 'Conflict Resolution'],
    },
    {
      scenarioId: 'scenario-003',
      title: 'Strategic Pivot Decision',
      description:
        'Market conditions suggest your organization should pivot its approach. What do you recommend?',
      context:
        'New data shows a significant opportunity in an adjacent market. Current strategy is sound but the opportunity is compelling.',
      challengeType: 'strategic',
      difficulty: 5,
      timeLimit: 20,
      skillsTestedRequired: ['Strategic Decision Making', 'Leadership', 'Risk Assessment'],
    },
  ];
}

/**
 * Get decision points for a scenario
 */
export function getScenarioDecisionPoints(scenarioId: string): DecisionPoint[] {
  const decisionMap: Record<string, DecisionPoint[]> = {
    'scenario-001': [
      {
        pointId: 'dp-001',
        questionText: 'How do you communicate the budget cuts to your team?',
        options: [
          {
            optionId: 'opt-001a',
            text: 'Immediate all-hands meeting with full transparency about impact',
            rationale: 'Builds trust through honest communication',
            expectedOutcome: 'Team appreciates honesty, anxious about futures',
            skillsApplied: ['Communication', 'Leadership'],
          },
          {
            optionId: 'opt-001b',
            text: 'Individual meetings with project leaders first, then team announcement',
            rationale: 'Allows you to prepare key people and gather input',
            expectedOutcome: 'Better prepared response, but may leak information',
            skillsApplied: ['Strategic Thinking', 'Communication'],
          },
          {
            optionId: 'opt-001c',
            text: 'Wait for full guidance from leadership before communicating',
            rationale: 'Ensures you have complete information',
            expectedOutcome: 'Professional but may create uncertainty and rumors',
            skillsApplied: ['Patience', 'Risk Assessment'],
          },
        ],
      },
      {
        pointId: 'dp-002',
        questionText: 'Which projects do you prioritize for continuation?',
        options: [
          {
            optionId: 'opt-002a',
            text: 'Continue highest-impact projects, pause others',
            rationale: 'Maximizes organizational impact',
            expectedOutcome: 'Better overall outcomes, but team demorale on paused projects',
            skillsApplied: ['Strategic Decision Making', 'Resource Management'],
          },
          {
            optionId: 'opt-002b',
            text: 'Reduce all projects proportionally',
            rationale: 'Treats everyone fairly',
            expectedOutcome: 'Fairness but inefficiency, nothing fully completes',
            skillsApplied: ['Fairness', 'Diplomacy'],
          },
          {
            optionId: 'opt-002c',
            text: 'Pause all projects except strategic commitments',
            rationale: 'Maintains key promises to stakeholders',
            expectedOutcome: 'Stakeholder confidence but large layoff/impact internally',
            skillsApplied: ['Strategic Thinking', 'Stakeholder Management'],
          },
        ],
      },
    ],
  };

  return decisionMap[scenarioId] || [];
}

/**
 * Execute simulation: process user decisions and generate outcome
 */
export function executeSimulation(
  userId: string,
  scenarioId: string,
  decisionsChain: Array<{ pointId: string; chosenOptionId: string; timeTaken: number }>,
  userSkillLevels: Record<string, number> = {}
): SimulationResult {
  const scenario = getSimulationScenarios().find((s) => s.scenarioId === scenarioId);
  if (!scenario) {
    throw new Error(`Scenario ${scenarioId} not found`);
  }

  // Evaluate decision quality
  const decisionEvaluations = evaluateDecisions(scenarioId, decisionsChain, userSkillLevels);

  // Calculate performance metrics
  const performanceMetrics = calculatePerformanceMetrics(
    decisionsChain,
    decisionEvaluations,
    scenario.difficulty,
    scenario.timeLimit
  );

  // Determine which skills improved
  const skillsImproved = determineSkillImprovement(
    decisionEvaluations,
    scenario.skillsTestedRequired
  );

  // Calculate readiness adjustment
  const readinessAdjustment = calculateReadinessAdjustment(performanceMetrics, scenario.difficulty);

  // Generate contextual feedback
  const feedback = generateSimulationFeedback(performanceMetrics, decisionEvaluations);

  return {
    simulationId: `SIM-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    userId,
    scenarioId,
    timestamp: new Date().toISOString(),
    decisionsChain,
    performanceMetrics,
    feedback,
    skillsImproved,
    readinessAdjustment,
  };
}

/**
 * Evaluate quality of decisions made
 */
function evaluateDecisions(
  scenarioId: string,
  decisionsChain: Array<{ pointId: string; chosenOptionId: string; timeTaken: number }>,
  userSkillLevels: Record<string, number>
): Array<{ pointId: string; decisionQuality: number; optionQuality: number }> {
  const decisionPoints = getScenarioDecisionPoints(scenarioId);
  const evaluations: Array<{ pointId: string; decisionQuality: number; optionQuality: number }> =
    [];

  decisionsChain.forEach((decision) => {
    const point = decisionPoints.find((p) => p.pointId === decision.pointId);
    if (!point) return;

    const option = point.options.find((o) => o.optionId === decision.chosenOptionId);
    if (!option) return;

    // Determine option quality (1-5 scale, 5 is best)
    let optionQuality = 3; // Default to neutral
    if (option.optionId.includes('a')) optionQuality = 4; // 'a' options tend to be better strategic choices
    if (option.optionId.includes('c')) optionQuality = 2;

    // Adjust based on user's relevant skills
    const relevantSkills = option.skillsApplied;
    const avgSkillLevel =
      relevantSkills.reduce((sum, skill) => sum + (userSkillLevels[skill] || 5), 0) /
      relevantSkills.length;

    const skillAdjustment = (avgSkillLevel - 5) / 10; // ±0.5 adjustment based on skills
    const decisionQuality = Math.max(1, Math.min(5, optionQuality + skillAdjustment));

    evaluations.push({
      pointId: decision.pointId,
      decisionQuality: decisionQuality * 20, // Convert to 0-100 scale
      optionQuality: optionQuality * 20,
    });
  });

  return evaluations;
}

/**
 * Calculate performance metrics
 */
function calculatePerformanceMetrics(
  decisionsChain: any[],
  evaluations: any[],
  difficulty: number,
  _timeLimit: number
): SimulationResult['performanceMetrics'] {
  const avgDecisionQuality =
    evaluations.reduce((sum, e) => sum + e.decisionQuality, 0) / evaluations.length || 50;

  // Calculate time efficiency
  const totalTimeTaken = decisionsChain.reduce((sum, d) => sum + d.timeTaken, 0);
  const timePerDecision = totalTimeTaken / decisionsChain.length;
  const timeEfficiency = Math.max(0, Math.min(100, 100 - (timePerDecision - 2) * 10));

  // Calculate outcome success based on decision quality and difficulty
  const outcomeSuccess = Math.min(100, avgDecisionQuality * (difficulty / 5));

  // Leadership demonstration (based on communication and strategic choices)
  const leadershipDemonstration = avgDecisionQuality * 0.9 + timeEfficiency * 0.1;

  // Overall score
  const score =
    (avgDecisionQuality * 0.3 +
      timeEfficiency * 0.2 +
      outcomeSuccess * 0.3 +
      leadershipDemonstration * 0.2) *
    (difficulty / 3); // Scale by difficulty

  return {
    score: Math.round(Math.min(100, score)),
    decisionQuality: Math.round(avgDecisionQuality),
    timeEfficiency: Math.round(timeEfficiency),
    outcomeSuccess: Math.round(outcomeSuccess),
    leadershipDemonstration: Math.round(leadershipDemonstration),
  };
}

/**
 * Determine which skills improved based on performance
 */
function determineSkillImprovement(
  evaluations: any[],
  skillsRequired: string[]
): Array<{ skillName: string; improvementLevel: number }> {
  const avgDecisionQuality =
    evaluations.reduce((sum, e) => sum + e.decisionQuality, 0) / evaluations.length;

  // Skills improve if performance was above average
  return skillsRequired.map((skill) => ({
    skillName: skill,
    improvementLevel: avgDecisionQuality > 60 ? 1 : avgDecisionQuality > 40 ? 0.5 : 0,
  }));
}

/**
 * Calculate readiness score adjustment based on performance
 */
function calculateReadinessAdjustment(metrics: any, difficulty: number): number {
  const performanceScore =
    (metrics.score + metrics.leadershipDemonstration) / 2;

  let adjustment = 0;

  if (performanceScore >= 80) {
    adjustment = 8 + difficulty; // Up to +13 for excellent performance on hard scenarios
  } else if (performanceScore >= 60) {
    adjustment = 4 + difficulty / 2; // Up to +6
  } else if (performanceScore < 40) {
    adjustment = -5; // Small penalty for poor performance
  }

  return adjustment;
}

/**
 * Generate contextual feedback
 */
function generateSimulationFeedback(metrics: any, _evaluations: any[]): string {
  if (metrics.score >= 85) {
    return 'Excellent decision-making. You demonstrated strong strategic thinking and leadership presence in this scenario.';
  } else if (metrics.score >= 70) {
    return 'Good performance. You made solid decisions with clear rationale. Consider devel developing more strategic depth.';
  } else if (metrics.score >= 50) {
    return 'Mixed results. Some decisions were sound, others could be improved. Recommend focused skill development.';
  } else {
    return 'This scenario revealed areas for growth. Review your decisions and consider how different approaches might have changed outcomes.';
  }
}

/**
 * Calculate overall readiness assessment after simulation
 */
export function calculateReadinessAssessment(
  userId: string,
  targetRole: string,
  baseReadinessScore: number,
  simulationResults: SimulationResult[]
): ReadinessAssessment {
  const avgSimulationBonus =
    simulationResults.reduce((sum, r) => sum + r.readinessAdjustment, 0) /
    (simulationResults.length || 1);

  const simulationBonus = Math.round(avgSimulationBonus);
  const finalScore = Math.min(100, baseReadinessScore + simulationBonus);

  // Calculate readiness bands
  const readinessBands: Record<string, number> = {
    leadership: baseReadinessScore * 0.3 + (simulationBonus || 0) * 0.7,
    decisionMaking: baseReadinessScore * 0.4 + (simulationBonus || 0) * 0.6,
    crisisManagement: Math.max(0, finalScore - 10),
    resourceManagement: baseReadinessScore * 0.35 + (simulationBonus || 0) * 0.65,
    teamManagement: baseReadinessScore * 0.4 + (simulationBonus || 0) * 0.6,
  };

  // Generate recommendations
  const lowestSkillEntry = Object.entries(readinessBands).reduce((min: [string, number], curr: [string, number]) =>
    curr[1] < min[1] ? curr : min
  );
  const lowestSkillName = lowestSkillEntry[0];

  const recommendations: string[] = [];
  if (finalScore < 60) {
    recommendations.push('Recommend additional skill development before pursuing target role.');
  } else if (finalScore < 75) {
    recommendations.push(`Focus on developing ${lowestSkillName} for better role readiness.`);
  } else {
    recommendations.push(`You are well-prepared for ${targetRole}. Consider pursuing opportunities.`);
  }

  return {
    userId,
    targetRole,
    baseReadinessScore,
    simulationBonus,
    finalReadinessScore: Math.round(finalScore),
    readinessBands,
    recommendations,
  };
}

/**
 * Get primary skill category for a role
 */
// Note: Skill category determined dynamically based on role requirements
// This function is not currently used in the readiness calculation
/*
function _getSkillCategoryForRole(role: string): string[] {
  const roleMap: Record<string, string[]> = {
    'Project Manager': ['Resource Management', 'Strategic Decision Making', 'Leadership'],
    'Executive Director': ['Leadership', 'Strategic Decision Making', 'Crisis Management'],
    'Team Lead': ['Leadership', 'Team Management', 'Communication'],
  };

  return roleMap[role] || ['Leadership', 'Decision Making'];
}
*/
