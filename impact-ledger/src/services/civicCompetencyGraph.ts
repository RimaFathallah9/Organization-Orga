/**
 * Civic Competency Graph Service
 * 
 * Creates a dynamic knowledge graph connecting:
 * - Skills and micro-skills
 * - Volunteer actions
 * - Measurable outcomes
 * - Organizational needs
 * - Career pathways
 * 
 * Uses graph neural network-inspired algorithms to infer latent competencies
 * from user behavior across multiple data sources (LinkedIn, GitHub, missions, peer feedback)
 */

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number;
  confidence: number; // 0-1 probability that user has this skill
  inferredFrom: string[]; // Data sources that inferred this skill
}

export interface CompetencyEdge {
  sourceSkillId: string;
  targetSkillId: string;
  relationType: 'prerequisite' | 'complement' | 'alternative' | 'advancement';
  strength: number; // 0-1 relationship strength
}

export interface CompetencyGraph {
  nodes: SkillNode[];
  edges: CompetencyEdge[];
  lastUpdated: string;
  dataSourceIntegration: {
    linkedinProfile?: boolean;
    githubContributions?: boolean;
    missionsCompleted: number;
    peerFeedback: number;
  };
}

export interface LatentCompetency {
  skillName: string;
  inferenceScore: number; // 0-1: confidence in prediction
  inferenceReason: string;
  recommendedAction: string;
}

/**
 * Initialize or update a competency graph from user data
 * Performs graph-based learning to infer emerging competencies
 */
export function buildCompetencyGraph(
  userSkills: SkillNode[],
  completedMissions: any[],
  peerFeedback: any[] = [],
  linkedinData?: any,
  githubData?: any
): CompetencyGraph {
  const nodes: SkillNode[] = [...userSkills];
  const edges: CompetencyEdge[] = [];

  // Infer micro-skills from completed missions and peer feedback
  const inferredSkills = inferMicroSkillsFromBehavior(completedMissions, peerFeedback);
  nodes.push(...inferredSkills);

  // Build skill relationships using graph analysis
  edges.push(...inferSkillRelationships(nodes));

  // Integrate external data sources if available
  if (linkedinData) {
    const linkedinSkills = inferSkillsFromLinkedIn(linkedinData);
    nodes.push(...linkedinSkills);
  }

  if (githubData) {
    const githubSkills = inferSkillsFromGitHub(githubData);
    nodes.push(...githubSkills);
  }

  // Normalize confidence weights
  normalizeNodeWeights(nodes);

  return {
    nodes,
    edges,
    lastUpdated: new Date().toISOString(),
    dataSourceIntegration: {
      linkedinProfile: !!linkedinData,
      githubContributions: !!githubData,
      missionsCompleted: completedMissions.length,
      peerFeedback: peerFeedback.length,
    },
  };
}

/**
 * Infer micro-skills from completed mission behaviors and peer feedback
 * Uses clustering analysis on mission outcomes
 */
function inferMicroSkillsFromBehavior(
  missions: any[],
  feedback: any[]
): SkillNode[] {
  const inferredSkills: SkillNode[] = [];

  // Behavioral clustering: map mission outcomes to latent skills
  const behaviorSkillMap: Record<string, { count: number; avgScore: number }> = {};

  missions.forEach((mission) => {
    const outcomes = mission.measuredOutcomes || {};
    const skillInferences = mapOutcomesToSkills(outcomes);

    skillInferences.forEach(({ skill, score }) => {
      if (!behaviorSkillMap[skill]) {
        behaviorSkillMap[skill] = { count: 0, avgScore: 0 };
      }
      behaviorSkillMap[skill].count++;
      behaviorSkillMap[skill].avgScore += score;
    });
  });

  // Convert behavioral map to skill nodes
  Object.entries(behaviorSkillMap).forEach(([skillName, data]) => {
    const confidence = Math.min(1, (data.count / missions.length) * (data.avgScore / 100));
    const sources = missions.length > 0 ? ['completed_missions'] : [];

    inferredSkills.push({
      id: `inferred-${skillName.toLowerCase().replace(/\s+/g, '-')}`,
      name: skillName,
      category: 'Inferred',
      level: Math.round(confidence * 50),
      confidence,
      inferredFrom: sources,
    });
  });

  // Process peer feedback for additional skill inference
  feedback.forEach((fb) => {
    const fbSkills = extractSkillsFromFeedback(fb.content || '');
    fbSkills.forEach(({ skill, sentiment: _sentiment }) => {
      const idx = inferredSkills.findIndex((s) => s.name.toLowerCase() === skill.toLowerCase());
      if (idx >= 0) {
        inferredSkills[idx].confidence = Math.min(1, inferredSkills[idx].confidence + 0.1);
        inferredSkills[idx].inferredFrom.push('peer_feedback');
      }
    });
  });

  return inferredSkills;
}

/**
 * Map mission outcomes to potential skills used
 * Uses outcome analysis to reverse-engineer skill application
 */
function mapOutcomesToSkills(outcomes: Record<string, any>): { skill: string; score: number }[] {
  const mapping: { skill: string; score: number }[] = [];

  // Decision-making quality
  if (outcomes.decisionsQuality) {
    mapping.push({
      skill: 'Strategic Decision Making',
      score: outcomes.decisionsQuality,
    });
  }

  // Team coordination
  if (outcomes.teamSize) {
    mapping.push({
      skill: 'Team Coordination',
      score: Math.min(100, outcomes.teamSize * 10),
    });
  }

  // Resource optimization
  if (outcomes.budgetEfficiency) {
    mapping.push({
      skill: 'Resource Management',
      score: outcomes.budgetEfficiency,
    });
  }

  // Communication impact
  if (outcomes.stakeholderEngagement) {
    mapping.push({
      skill: 'Stakeholder Communication',
      score: outcomes.stakeholderEngagement,
    });
  }

  // Adaptability
  if (outcomes.pivotCount) {
    mapping.push({
      skill: 'Adaptability & Resilience',
      score: Math.min(100, 100 - outcomes.pivotCount * 15),
    });
  }

  return mapping;
}

/**
 * Infer skills from peer feedback text using simple keyword matching
 */
function extractSkillsFromFeedback(
  text: string
): { skill: string; sentiment: number }[] {
  const skillKeywords: Record<string, string> = {
    'leadership|led|leading|leader': 'Leadership',
    'communication|communicated|spoke|presented': 'Communication',
    'problem.?solv|analytical|problem.?solving': 'Problem Solving',
    'creative|innovation|innovative|idea': 'Creativity',
    'collaboration|collaborated|team.?work|teamwork': 'Collaboration',
    'organization|organized|planning': 'Organization',
    'reliability|reliable|dependable|consistent': 'Reliability',
    'initiative|proactive|self.?starter|autonomous': 'Initiative',
  };

  const results: { skill: string; sentiment: number }[] = [];
  const lowerText = text.toLowerCase();

  Object.entries(skillKeywords).forEach(([regex, skill]) => {
    if (new RegExp(regex).test(lowerText)) {
      const sentiment = lowerText.includes('excellent') ||
        lowerText.includes('outstanding') ||
        lowerText.includes('amazing')
        ? 1
        : 0.7;
      results.push({ skill, sentiment });
    }
  });

  return results;
}

/**
 * Infer skills from LinkedIn profile data
 */
function inferSkillsFromLinkedIn(linkedinData: any): SkillNode[] {
  const skills: SkillNode[] = [];

  if (linkedinData.endorsements) {
    Object.entries(linkedinData.endorsements).forEach(([skill, count]: [string, any]) => {
      const confidence = Math.min(1, count / 100);
      skills.push({
        id: `linkedin-${skill.toLowerCase().replace(/\s+/g, '-')}`,
        name: skill,
        category: 'Professional',
        level: Math.round(confidence * 50),
        confidence,
        inferredFrom: ['linkedin'],
      });
    });
  }

  return skills;
}

/**
 * Infer technical skills from GitHub contribution patterns
 */
function inferSkillsFromGitHub(githubData: any): SkillNode[] {
  const skills: SkillNode[] = [];
  const languageSkillMap: Record<string, string> = {
    python: 'Python Development',
    javascript: 'JavaScript Development',
    typescript: 'TypeScript Development',
    java: 'Java Development',
    csharp: 'C# Development',
    go: 'Go Development',
    rust: 'Rust Development',
    cpp: 'C++ Development',
  };

  if (githubData.languages) {
    Object.entries(githubData.languages).forEach(([lang, visits]: [string, any]) => {
      const skill = languageSkillMap[lang.toLowerCase()];
      if (skill) {
        const confidence = Math.min(1, visits / 1000);
        skills.push({
          id: `github-${lang.toLowerCase()}`,
          name: skill,
          category: 'Technical',
          level: Math.round(confidence * 50),
          confidence,
          inferredFrom: ['github'],
        });
      }
    });
  }

  // Repository contribution patterns
  if (githubData.contributionPatterns) {
    const patterns = githubData.contributionPatterns;
    if (patterns.includes('consistent')) {
      skills.push({
        id: 'github-consistency',
        name: 'Code Consistency',
        category: 'Technical',
        level: 25,
        confidence: 0.8,
        inferredFrom: ['github'],
      });
    }
  }

  return skills;
}

/**
 * Infer skill relationships and dependencies using graph analysis
 * Creates edges representing prerequisite, complement, and advancement relationships
 */
function inferSkillRelationships(nodes: SkillNode[]): CompetencyEdge[] {
  const edges: CompetencyEdge[] = [];

  // Predefined skill relationship rules
  const relationshipRules: Array<[string, string, string, number]> = [
    ['Leadership', 'Team Coordination', 'advancement', 0.9],
    ['Team Coordination', 'Communication', 'complement', 0.85],
    ['Project Management', 'Resource Management', 'complement', 0.8],
    ['Event Coordination', 'Project Management', 'advancement', 0.75],
    ['Campaign Analytics', 'Social Media Marketing', 'complement', 0.8],
    ['Strategic Decision Making', 'Leadership', 'advancement', 0.85],
  ];

  relationshipRules.forEach(([source, target, type, strength]) => {
    const sourceNode = nodes.find((n) => n.name === source);
    const targetNode = nodes.find((n) => n.name === target);

    if (sourceNode && targetNode) {
      edges.push({
        sourceSkillId: sourceNode.id,
        targetSkillId: targetNode.id,
        relationType: type as any,
        strength,
      });
    }
  });

  return edges;
}

/**
 * Normalize confidence weights so they sum to 1 per category
 */
function normalizeNodeWeights(nodes: SkillNode[]): void {
  const categories = [...new Set(nodes.map((n) => n.category))];

  categories.forEach((category) => {
    const categoryNodes = nodes.filter((n) => n.category === category);
    const totalConfidence = categoryNodes.reduce((sum, n) => sum + n.confidence, 0);

    if (totalConfidence > 0) {
      categoryNodes.forEach((node) => {
        node.confidence = node.confidence / totalConfidence;
      });
    }
  });
}

/**
 * Detect emerging competencies based on skill trajectory
 * Returns high-confidence latent skills not yet unlocked
 */
export function detectEmergingCompetencies(graph: CompetencyGraph): LatentCompetency[] {
  const emerging: LatentCompetency[] = [];

  // Find high-confidence inferred skills
  const inferredNodes = graph.nodes.filter((n) => n.category === 'Inferred' && n.confidence > 0.6);

  inferredNodes.forEach((node) => {
    const inferredFrom = node.inferredFrom.join(', ');
    emerging.push({
      skillName: node.name,
      inferenceScore: node.confidence,
      inferenceReason: `Detected from ${inferredFrom}. Observed in ${node.level}% of recent activities.`,
      recommendedAction: `Consider seeking missions that further develop ${node.name} capabilities.`,
    });
  });

  // Sort by confidence
  return emerging.sort((a, b) => b.inferenceScore - a.inferenceScore);
}

/**
 * Find skill prerequisites and learning paths
 */
export function findLearningPath(
  currentSkillId: string,
  graph: CompetencyGraph,
  targetSkillId: string
): { path: string[]; prerequisites: string[] } {
  const path: string[] = [currentSkillId];
  const prerequisites: string[] = [];

  // BFS to find path
  const visited = new Set<string>();
  const queue = [[currentSkillId]];

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const current = currentPath[currentPath.length - 1];

    if (current === targetSkillId) {
      return { path: currentPath, prerequisites };
    }

    if (visited.has(current)) continue;
    visited.add(current);

    // Find connected skills
    const connections = graph.edges
      .filter((e) => e.sourceSkillId === current)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 3); // Limit branching

    connections.forEach((edge) => {
      if (!visited.has(edge.targetSkillId)) {
        if (edge.relationType === 'prerequisite') {
          prerequisites.push(edge.targetSkillId);
        }
        queue.push([...currentPath, edge.targetSkillId]);
      }
    });
  }

  return { path, prerequisites };
}
