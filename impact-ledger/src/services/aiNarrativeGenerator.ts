/**
 * AI Reflection & Career Narrative Generator
 * 
 * After each completed mission, automatically generates:
 * - Competency growth report
 * - Quantified contribution summary
 * - STAR-format professional experience description
 * - Optimized LinkedIn-ready bullet points
 * 
 * Narratives grounded in verified data and measurable outcomes
 */

export interface CareerNarrative {
  missionId: string;
  competencyGrowthReport: CompetencyGrowthReport;
  contributionSummary: ContributionSummary;
  starDescription: STARDescription;
  linkedinBulletPoints: string[];
  narrativeIntegrity: NarrativeIntegrityScore;
}

export interface CompetencyGrowthReport {
  skillsDeveloped: Array<{
    skillName: string;
    previousLevel: number;
    newLevel: number;
    growthPercentage: number;
    learningInsights: string;
  }>;
  competencyGaps: Array<{
    skillName: string;
    importance: 'critical' | 'important' | 'nice-to-have';
    recommendation: string;
  }>;
  readinessForNextRole: string;
}

export interface ContributionSummary {
  missionOverview: string;
  keyResponsibilities: string[];
  quantifiedImpact: Array<{
    metric: string;
    value: number | string;
    significance: string;
  }>;
  organizationalBenefit: string;
}

export interface STARDescription {
  situation: string;
  task: string;
  action: string;
  result: string;
  fullNarrative: string;
}

export interface NarrativeIntegrityScore {
  dataGroundedness: number; // 0-100: how much is verified data
  verifiability: number; // 0-100: can claims be verified
  credibility: number; // 0-100: overall credibility
  recommendations: string[];
}

/**
 * Generate comprehensive career narrative from completed mission
 */
export function generateCareerNarrative(
  missionData: {
    id: string;
    title: string;
    description: string;
    organization: string;
    duration: number; // weeks
    teamSize: number;
    measurableOutcomes: Array<{ metric: string; target: number; actual: number; unit: string }>;
    userRole: string;
    skillsAcquired: Array<{ skillName: string; previousLevel: number; newLevel: number }>;
  },
  userProfile: { name: string; title?: string; location?: string }
): CareerNarrative {
  return {
    missionId: missionData.id,
    competencyGrowthReport: generateCompetencyGrowthReport(missionData),
    contributionSummary: generateContributionSummary(missionData),
    starDescription: generateSTARDescription(missionData, userProfile),
    linkedinBulletPoints: generateLinkedInBulletPoints(missionData),
    narrativeIntegrity: assessNarrativeIntegrity(missionData),
  };
}

/**
 * Generate competency growth report
 */
function generateCompetencyGrowthReport(missionData: any): CompetencyGrowthReport {
  const skillsDeveloped = missionData.skillsAcquired.map((skill: any) => ({
    skillName: skill.skillName,
    previousLevel: skill.previousLevel,
    newLevel: skill.newLevel,
    growthPercentage: ((skill.newLevel - skill.previousLevel) / (skill.previousLevel || 1)) * 100,
    learningInsights: generateLearningInsight(skill.skillName, skill.newLevel),
  }));

  // Identify remaining gaps based on mission requirements
  const competencyGaps = identifyRemainingGaps(missionData);

  // Assess readiness for next role
  const readiness = assessRoleReadiness(skillsDeveloped);

  return {
    skillsDeveloped,
    competencyGaps,
    readinessForNextRole: readiness,
  };
}

/**
 * Generate contribution summary with quantified impact
 */
function generateContributionSummary(missionData: any): ContributionSummary {
  const keyResponsibilities = extractKeyResponsibilities(missionData);
  const quantifiedImpact = missionData.measurableOutcomes.map((outcome: any) => ({
    metric: outcome.metric,
    value: `${outcome.actual}/${outcome.target} ${outcome.unit}`,
    significance: assessImpactSignificance(outcome.actual, outcome.target),
  }));

  return {
    missionOverview: generateMissionOverview(missionData),
    keyResponsibilities,
    quantifiedImpact,
    organizationalBenefit: generateOrganizationalBenefit(missionData, quantifiedImpact),
  };
}

/**
 * Generate STAR format description
 * Situation, Task, Action, Result
 */
function generateSTARDescription(missionData: any, _userProfile: any): STARDescription {
  const situation = generateSituation(missionData);
  const task = generateTask(missionData);
  const action = generateAction(missionData);
  const result = generateResult(missionData);

  const fullNarrative = `${situation} ${task} ${action} ${result}`;

  return {
    situation,
    task,
    action,
    result,
    fullNarrative,
  };
}

/**
 * Generate LinkedIn-ready bullet points
 */
function generateLinkedInBulletPoints(missionData: any): string[] {
  const bullets: string[] = [];

  // Lead with impact
  const topOutcome = missionData.measurableOutcomes[0];
  if (topOutcome) {
    bullets.push(
      `• Led initiative resulting in ${topOutcome.actual} ${topOutcome.unit} (vs. target of ${topOutcome.target})`
    );
  }

  // Skills developed
  const skills = missionData.skillsAcquired.slice(0, 3).map((s: any) => s.skillName);
  if (skills.length > 0) {
    bullets.push(`• Developed expertise in ${skills.join(', ')}`);
  }

  // Team impact
  if (missionData.teamSize > 1) {
    bullets.push(
      `• Collaborated with ${missionData.teamSize} team members to deliver ${missionData.title}`
    );
  }

  // Methods or frameworks used
  const frameworks = inferFrameworks(missionData);
  if (frameworks.length > 0) {
    bullets.push(`• Applied ${frameworks.join(', ')} frameworks to achieve results`);
  }

  // Growth metrics
  if (missionData.skillsAcquired.length > 0) {
    const avgGrowth = (
      missionData.skillsAcquired.reduce((sum: number, s: any) => sum + (s.newLevel - s.previousLevel), 0) /
      missionData.skillsAcquired.length
    ).toFixed(1);
    bullets.push(`• Increased professional competency by ${avgGrowth} skill levels`);
  }

  return bullets.filter((b) => b.length > 0).slice(0, 5); // Max 5 bullets
}

/**
 * Helper: Generate learning insight for skill
 */
function generateLearningInsight(skillName: string, newLevel: number): string {
  const insights: Record<string, string> = {
    'Leadership': `Developed ability to guide teams and make strategic decisions at Level ${newLevel}.`,
    'Project Management': `Mastered project execution and milestone tracking at Level ${newLevel}.`,
    'Communication': `Enhanced ability to articulate vision and engage stakeholders at Level ${newLevel}.`,
    'Strategic Decision Making': `Improved capacity for complex analysis and strategic foresight at Level ${newLevel}.`,
  };

  return insights[skillName] || `Achieved proficiency in ${skillName} at Level ${newLevel}.`;
}

/**
 * Identify remaining skill gaps
 */
function identifyRemainingGaps(missionData: any): Array<any> {
  // Simplified logic: assume certain skills are important for next level
  const skillRequirements: Record<string, number> = {
    'Leadership': 8,
    'Project Management': 8,
    'Communication': 7,
    'Strategic Decision Making': 7,
  };

  const gaps: Array<any> = [];

  Object.entries(skillRequirements).forEach(([skill, requiredLevel]) => {
    const acquired = missionData.skillsAcquired.find((s: any) => s.skillName === skill);
    const currentLevel = acquired ? acquired.newLevel : 0;

    if (currentLevel < requiredLevel) {
      gaps.push({
        skillName: skill,
        importance: currentLevel < requiredLevel - 3 ? 'critical' : 'important',
        recommendation: `Continue developing ${skill} through targeted missions to reach Level ${requiredLevel}.`,
      });
    }
  });

  return gaps;
}

/**
 * Assess readiness for next role
 */
function assessRoleReadiness(skillsDeveloped: any[]): string {
  const avgLevel = skillsDeveloped.reduce((sum, s) => sum + s.newLevel, 0) / skillsDeveloped.length;

  if (avgLevel >= 8) {
    return 'Ready for senior roles (Team Lead, Manager). Consider applying for leadership positions.';
  } else if (avgLevel >= 6) {
    return 'Ready for mid-level roles (Senior Coordinator, Project Lead). Continue skill development.';
  } else if (avgLevel >= 4) {
    return 'Well-positioned for early-career roles. Recommend additional mission experience.';
  } else {
    return 'Foundation level achieved. Recommend targeted skill development before role transition.';
  }
}

/**
 * Extract key responsibilities from mission
 */
function extractKeyResponsibilities(missionData: any): string[] {
  // Parse from description
  const desc = missionData.description.toLowerCase();
  const responsibilities: string[] = [];

  if (desc.includes('lead')) responsibilities.push('Led team initiatives');
  if (desc.includes('coordin')) responsibilities.push('Coordinated stakeholders');
  if (desc.includes('manag')) responsibilities.push('Managed resources and budget');
  if (desc.includes('plan')) responsibilities.push('Planned and executed strategy');
  if (desc.includes('evaluat')) responsibilities.push('Evaluated outcomes and metrics');

  return responsibilities.length > 0 ? responsibilities : ['Completed project deliverables'];
}

/**
 * Assess impact significance
 */
function assessImpactSignificance(actual: number, target: number): string {
  const percentage = (actual / target) * 100;

  if (percentage >= 150) return 'Exceptional: Exceeded target by 50%+';
  if (percentage >= 125) return 'Excellent: Exceeded target by 25%+';
  if (percentage >= 100) return 'On Target: Met or exceeded goal';
  if (percentage >= 75) return 'Good: Achieved 75%+ of goal';
  return 'Completed: Achieved measurable progress';
}

/**
 * Generate mission overview
 */
function generateMissionOverview(missionData: any): string {
  return `Developed and executed ${missionData.title} for ${missionData.organization} over ${missionData.duration} weeks, managing a team of ${missionData.teamSize} members.`;
}

/**
 * Generate organizational benefit statement
 */
function generateOrganizationalBenefit(
  missionData: any,
  quantifiedImpact: any[]
): string {
  if (quantifiedImpact.length === 0) {
    return `Contributed to organizational growth and mission delivery.`;
  }

  const topImpact = quantifiedImpact[0];
  return `Delivered measurable value: ${topImpact.value} ${topImpact.metric}, directly supporting ${missionData.organization}'s strategic objectives.`;
}

/**
 * Generate STAR: Situation
 */
function generateSituation(missionData: any): string {
  return `When ${missionData.organization} needed ${missionData.title.toLowerCase()},`;
}

/**
 * Generate STAR: Task
 */
function generateTask(missionData: any): string {
  return `I took on the responsibility to ${missionData.userRole} and manage multiple work streams.`;
}

/**
 * Generate STAR: Action
 */
function generateAction(missionData: any): string {
  const skills = missionData.skillsAcquired.slice(0, 2).map((s: any) => s.skillName.toLowerCase());
  return `I applied my expertise in ${skills.join(' and ')} to develop a comprehensive strategy and execute it over ${missionData.duration} weeks.`;
}

/**
 * Generate STAR: Result
 */
function generateResult(missionData: any): string {
  const primaryOutcome = missionData.measurableOutcomes[0];
  if (primaryOutcome) {
    return `As a result, we achieved ${primaryOutcome.actual} ${primaryOutcome.unit}, exceeding our target of ${primaryOutcome.target} and delivering significant value.`;
  }
  return `As a result, we successfully delivered the project and strengthened organizational capacity.`;
}

/**
 * Infer frameworks used
 */
function inferFrameworks(missionData: any): string[] {
  const frameworks: string[] = [];

  const desc = missionData.description.toLowerCase();
  if (desc.includes('agile') || desc.includes('sprint')) frameworks.push('Agile');
  if (desc.includes('lean')) frameworks.push('Lean');
  if (desc.includes('scrum')) frameworks.push('Scrum');
  if (desc.includes('design think')) frameworks.push('Design Thinking');
  if (desc.includes('goal') || desc.includes('okr')) frameworks.push('Goal Setting');

  return frameworks;
}

/**
 * Assess narrative integrity
 */
function assessNarrativeIntegrity(missionData: any): NarrativeIntegrityScore {
  let groundedness = 0;
  let verifiability = 0;
  const recommendations: string[] = [];

  // Check data completeness
  if (missionData.measurableOutcomes && missionData.measurableOutcomes.length > 0) {
    groundedness += 50;
    verifiability += 40;
  } else {
    recommendations.push('Add measurable outcomes to strengthen narrative credibility.');
  }

  if (missionData.organization) {
    groundedness += 20;
    verifiability += 30;
  }

  if (missionData.skillsAcquired && missionData.skillsAcquired.length > 0) {
    groundedness += 20;
    verifiability += 20;
  }

  if (missionData.teamSize > 1) {
    verifiability += 10;
  }

  if (groundedness < 60) {
    recommendations.push('Request organizational verification to enhance narrative credibility.');
  }

  const credibility =
    (groundedness * 0.5 + verifiability * 0.5 + (recommendations.length === 0 ? 20 : 0)) / 100;

  return {
    dataGroundedness: Math.min(100, groundedness),
    verifiability: Math.min(100, verifiability),
    credibility: Math.round(credibility * 100),
    recommendations,
  };
}
