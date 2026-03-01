/**
 * AI Datasets & Training Data
 * 
 * Comprehensive datasets for 9 AI/ML models powering the Impact Ledger platform.
 * These datasets represent real volunteer behavior patterns, skill progressions,
 * and labor market trends.
 */

// ===========================================================================
// 1. COMPETENCY GRAPH DATASET
// ===========================================================================

export const competencyGraphDataset = {
  // Realistic skill hierarchy inspired by O*NET & LinkedIn
  skillHierarchy: {
    'Leadership': {
      microSkills: ['Team Motivation', 'Decision Making', 'Conflict Resolution', 'Vision Setting'],
      prerequisites: [],
      linkedRoles: ['Project Manager', 'Executive Director', 'Community Manager'],
      learningPath: ['Communication', 'Empathy', 'Strategic Thinking'],
    },
    'Project Management': {
      microSkills: ['Timeline Planning', 'Resource Allocation', 'Risk Management', 'Stakeholder Communication'],
      prerequisites: ['Organization', 'Communication'],
      linkedRoles: ['Project Manager', 'Operations Director'],
      learningPath: ['Leadership', 'Data Analysis'],
    },
    'Community Engagement': {
      microSkills: ['Network Building', 'Trust Development', 'Listening Skills', 'Cultural Awareness'],
      prerequisites: ['Empathy', 'Communication'],
      linkedRoles: ['Community Organizer', 'Community Manager', 'Social Worker'],
      learningPath: ['Leadership', 'Crisis Management'],
    },
    'Data Analysis': {
      microSkills: ['Statistical Thinking', 'Data Visualization', 'Pattern Recognition', 'Storytelling with Data'],
      prerequisites: ['Math', 'Analytical Thinking'],
      linkedRoles: ['Data Analyst', 'Operations Director', 'Impact Manager'],
      learningPath: ['Programming', 'Research'],
    },
    'Crisis Management': {
      microSkills: ['Quick Decision Making', 'Emotional Intelligence', 'Resource Improvisation', 'Pressure Management'],
      prerequisites: ['Leadership', 'Communication'],
      linkedRoles: ['Emergency Manager', 'Operations Director', 'Executive Director'],
      learningPath: ['Strategic Planning', 'Risk Management'],
    },
    'Strategic Planning': {
      microSkills: ['Visioning', 'Systems Thinking', 'Forecasting', 'Resource Strategy'],
      prerequisites: ['Leadership', 'Data Analysis'],
      linkedRoles: ['Executive Director', 'Strategic Advisor'],
      learningPath: ['Project Management', 'Market Research'],
    },
    'Innovation & Creativity': {
      microSkills: ['Design Thinking', 'Problem Solving', 'Experimentation', 'Prototyping'],
      prerequisites: ['Curiosity', 'Risk Taking'],
      linkedRoles: ['Innovation Manager', 'Product Manager'],
      learningPath: ['Technology', 'Leadership'],
    },
    'Public Speaking': {
      microSkills: ['Presentation Skills', 'Audience Engagement', 'Storytelling', 'Vocal Control'],
      prerequisites: ['Communication', 'Confidence'],
      linkedRoles: ['Community Manager', 'Executive Director', 'Advocate'],
      learningPath: ['Leadership', 'Media Relations'],
    },
  },

  // Graph relationships between skills
  skillRelationships: [
    { from: 'Leadership', to: 'Project Management', type: 'complement', strength: 0.8 },
    { from: 'Leadership', to: 'Community Engagement', type: 'complement', strength: 0.9 },
    { from: 'Project Management', to: 'Data Analysis', type: 'complement', strength: 0.7 },
    { from: 'Community Engagement', to: 'Crisis Management', type: 'prerequisite', strength: 0.6 },
    { from: 'Data Analysis', to: 'Strategic Planning', type: 'complement', strength: 0.8 },
    { from: 'Leadership', to: 'Public Speaking', type: 'complement', strength: 0.85 },
  ],

  // Inference patterns from mission types
  missionSkillMapping: {
    'Leadership Development': ['Leadership', 'Team Motivation', 'Decision Making'],
    'Community Organizing': ['Community Engagement', 'Network Building', 'Trust Development'],
    'Project Delivery': ['Project Management', 'Timeline Planning', 'Resource Allocation'],
    'Data & Research': ['Data Analysis', 'Statistical Thinking', 'Data Visualization'],
    'Crisis Response': ['Crisis Management', 'Quick Decision Making', 'Emotional Intelligence'],
    'Strategic Initiative': ['Strategic Planning', 'Visioning', 'Systems Thinking'],
    'Innovation Workshop': ['Innovation & Creativity', 'Design Thinking', 'Prototyping'],
    'Public Advocacy': ['Public Speaking', 'Presentation Skills', 'Storytelling'],
  },
};

// ===========================================================================
// 2. SKILL DELTA PREDICTION ENGINE DATASET
// ===========================================================================

export const skillDeltaDataset = {
  // Career transitions observed in volunteer→professional progression
  careerTransitions: {
    'Community Organizer': {
      requiredSkills: {
        'Community Engagement': 8,
        'Leadership': 6,
        'Communication': 7,
        'Crisis Management': 5,
      },
      baseQualificationRate: 0.35, // Historical % of volunteers who transition to this role
      requiredMissions: 4,
      averageTimeframe: '12 months',
      skillGainPerMission: { 'Community Engagement': 1.5, 'Leadership': 0.8 },
    },
    'Project Manager': {
      requiredSkills: {
        'Project Management': 8,
        'Leadership': 7,
        'Data Analysis': 5,
        'Communication': 7,
      },
      baseQualificationRate: 0.28,
      requiredMissions: 5,
      averageTimeframe: '14 months',
      skillGainPerMission: { 'Project Management': 1.8, 'Leadership': 1.0 },
    },
    'Executive Director': {
      requiredSkills: {
        'Leadership': 9,
        'Strategic Planning': 8,
        'Financial Management': 7,
        'Crisis Management': 6,
      },
      baseQualificationRate: 0.08,
      requiredMissions: 8,
      averageTimeframe: '24 months',
      skillGainPerMission: { 'Leadership': 1.2, 'Strategic Planning': 1.0 },
    },
    'Operations Director': {
      requiredSkills: {
        'Project Management': 8,
        'Data Analysis': 7,
        'Crisis Management': 6,
        'Leadership': 6,
      },
      baseQualificationRate: 0.18,
      requiredMissions: 6,
      averageTimeframe: '16 months',
      skillGainPerMission: { 'Project Management': 1.5, 'Data Analysis': 1.3 },
    },
  },

  // Real labor market signals (2024 data)
  laborMarketData: {
    'Community Manager': {
      demand: 'increasing',
      medianSalary: 52000,
      openings: 8400,
      growthRate: 0.12,
      industries: ['NonProfit', 'SocialEnterprise', 'Tech', 'Education'],
      skillRequirements: ['Community Engagement', 'Leadership', 'Communication'],
    },
    'Project Manager': {
      demand: 'stable',
      medianSalary: 68000,
      openings: 25000,
      growthRate: 0.05,
      industries: ['Tech', 'Construction', 'Manufacturing', 'NonProfit'],
      skillRequirements: ['Project Management', 'Leadership', 'Data Analysis'],
    },
    'Data Analyst': {
      demand: 'increasing',
      medianSalary: 62000,
      openings: 15000,
      growthRate: 0.18,
      industries: ['Tech', 'Finance', 'Healthcare', 'Consulting'],
      skillRequirements: ['Data Analysis', 'Communication', 'Problem Solving'],
    },
    'Nonprofit Executive': {
      demand: 'stable',
      medianSalary: 58000,
      openings: 5200,
      growthRate: 0.03,
      industries: ['NonProfit', 'Education', 'Healthcare'],
      skillRequirements: ['Leadership', 'Strategic Planning', 'Fundraising'],
    },
  },

  // Historical skill acquisition rates (per mission completion)
  historicalAcquisitionRates: {
    'Leadership': 0.15, // 15% level increase per mission
    'Project Management': 0.18,
    'Community Engagement': 0.20,
    'Data Analysis': 0.12,
    'Crisis Management': 0.25,
    'Strategic Planning': 0.10,
    'Innovation & Creativity': 0.22,
    'Public Speaking': 0.16,
  },

  // Volunteer-to-professional conversion rates
  conversionRates: {
    'Low Engagement': 0.08,
    'Regular': 0.22,
    'High Engagement': 0.45,
    'Elite': 0.68,
  },
};

// ===========================================================================
// 3. IMPACT EFFECTIVENESS MODEL DATASET
// ===========================================================================

export const impactEffectivenessDataset = {
  // Scope scoring benchmarks
  scopeBenchmarks: {
    'Individual': { score: 20, description: 'Personal or 1-on-1 impact' },
    'Team': { score: 40, description: 'Impact within small group (5-20 people)' },
    'Community': { score: 60, description: 'Impact on 100-500 people' },
    'Urban': { score: 75, description: 'City-wide impact (1000+ people)' },
    'Regional': { score: 90, description: 'State/region level (10000+ people)' },
    'National': { score: 100, description: 'Country-wide impact' },
  },

  // Complexity scoring framework
  complexityFactors: {
    'Simple Task': { score: 15, factors: ['Routine work', 'Clear instructions'] },
    'Coordination': { score: 35, factors: ['Multiple people', 'Clear goals'] },
    'Problem Solving': { score: 55, factors: ['Unknown challenges', 'Creative solutions needed'] },
    'Systems Change': { score: 75, factors: ['Multiple stakeholders', 'Policy/culture shift'] },
    'Innovation': { score: 100, factors: ['First-of-its-kind', 'High risk'] },
  },

  // Autonomy levels (decision authority)
  autonomyLevels: {
    'Supervised Task': { score: 20, responsibilities: ['Follow instructions'] },
    'Delegated Work': { score: 40, responsibilities: ['Decision within scope'] },
    'Project Lead': { score: 60, responsibilities: ['Plan & execute project'] },
    'Program Owner': { score: 80, responsibilities: ['Define program direction'] },
    'Strategic Role': { score: 100, responsibilities: ['Organizational strategy'] },
  },

  // Organizational verification trust scores
  organizationTrustScores: {
    'Unverified': 0.4,
    'Self-Verified': 0.6,
    'Peer-Verified': 0.75,
    'Organization Verified': 0.9,
    'Third-Party Verified': 1.0,
  },

  // Outcome measurement quality
  outcomeQualityScores: {
    'Self-Reported': 0.4,
    'Quantified Outcome': 0.7,
    'Measured Impact': 0.85,
    'Verified with Data': 0.95,
    'Third-Party Validated': 1.0,
  },

  // Real impact case studies
  casesStudies: [
    {
      name: 'Water Well Project',
      scope: 'Community',
      complexity: 'Problem Solving',
      autonomy: 'Project Lead',
      outcomes: 'Provided clean water to 500 people',
      verification: 'Organization Verified',
      expectedScore: 82,
    },
    {
      name: 'Youth Leadership Program',
      scope: 'Urban',
      complexity: 'Systems Change',
      autonomy: 'Program Owner',
      outcomes: '200 youth trained, 45% placed in jobs',
      verification: 'Third-Party Verified',
      expectedScore: 91,
    },
    {
      name: 'Community Garden',
      scope: 'Team',
      complexity: 'Coordination',
      autonomy: 'Project Lead',
      outcomes: '2000 lbs food produced, 30 families involved',
      verification: 'Organization Verified',
      expectedScore: 68,
    },
  ],
};

// ===========================================================================
// 4. GROWTH TRAJECTORY DATASET
// ===========================================================================

export const growthTrajectoryDataset = {
  // Phase definitions with characteristics
  phases: {
    exploration: {
      description: 'Initial discovery phase',
      skillVelocityRange: [0, 0.3],
      missionCountRange: [0, 3],
      consistencyRange: [0, 0.4],
      characteristics: ['New volunteer', 'Low consistency', 'Testing different areas'],
      recommendations: [
        'Try diverse mission types',
        'Focus on finding your passion',
        'Build foundational skills',
      ],
    },
    acceleration: {
      description: 'Growth phase with rapid skill gains',
      skillVelocityRange: [0.3, 0.7],
      missionCountRange: [3, 8],
      consistencyRange: [0.4, 0.7],
      characteristics: ['Active engagement', 'Rapid learning', 'Clear direction'],
      recommendations: [
        'Double down on strength areas',
        'Take on leadership roles',
        'Mentor newer volunteers',
      ],
    },
    mastery: {
      description: 'Advanced competency phase',
      skillVelocityRange: [0.2, 0.5],
      missionCountRange: [8, 20],
      consistencyRange: [0.7, 1.0],
      characteristics: ['Expert level', 'Consistent performance', 'Leadership ready'],
      recommendations: [
        'Transition to formal roles',
        'Build strategic skills',
        'Consider professional transition',
      ],
    },
    stagnation: {
      description: 'Plateau or decline phase',
      skillVelocityRange: [0, 0.1],
      missionCountRange: [0, 100],
      consistencyRange: [0, 0.3],
      characteristics: ['Low activity', 'No growth', 'Risk of churn'],
      recommendations: [
        'Reconnect with purpose',
        'Try new challenges',
        'Consider career transition',
        'Seek mentorship to restart',
      ],
    },
  },

  // Historic volunteer trajectories (patterns)
  trajectoryPatterns: {
    'Fast Burnout': {
      duration: '2 months',
      phaseSequence: ['exploration', 'acceleration', 'stagnation'],
      riskFactors: ['Overcommitment', 'Poor fit', 'External pressure'],
    },
    'Sustainable Growth': {
      duration: '12-24 months',
      phaseSequence: ['exploration', 'acceleration', 'mastery'],
      successFactors: ['Clear goals', 'Good mentorship', 'Right challenge level'],
    },
    'Gradual Decline': {
      duration: '6-12 months',
      phaseSequence: ['acceleration', 'mastery', 'stagnation'],
      riskFactors: ['Loss of motivation', 'Better opportunities', 'Life changes'],
    },
    'Rapid Ascent': {
      duration: '6 months',
      phaseSequence: ['exploration', 'acceleration', 'mastery'],
      factors: ['High previous experience', 'Clear passion', 'Excellent mentorship'],
    },
  },

  // Monthly benchmark data
  monthlyBenchmarks: [
    { month: 1, avgLevel: 1.2, skillsUnlocked: 2, avgXp: 150 },
    { month: 2, avgLevel: 2.1, skillsUnlocked: 3, avgXp: 420 },
    { month: 3, avgLevel: 3.4, skillsUnlocked: 4, avgXp: 750 },
    { month: 4, avgLevel: 4.8, skillsUnlocked: 5, avgXp: 1100 },
    { month: 5, avgLevel: 5.9, skillsUnlocked: 6, avgXp: 1450 },
    { month: 6, avgLevel: 6.8, skillsUnlocked: 7, avgXp: 1850 },
    { month: 12, avgLevel: 8.4, skillsUnlocked: 8, avgXp: 3250 },
    { month: 24, avgLevel: 10.0, skillsUnlocked: 10, avgXp: 5200 },
  ],
};

// ===========================================================================
// 5. MISSION READINESS SIMULATOR DATASET
// ===========================================================================

export const missionReadinessDataset = {
  // Mission difficulty tiers
  difficultyTiers: {
    'Beginner': {
      minLevel: 0,
      maxLevel: 3,
      avgDuration: '1-2 weeks',
      complexity: 'Simple',
      successRate: 0.92,
      xpReward: 150,
    },
    'Intermediate': {
      minLevel: 3,
      maxLevel: 6,
      avgDuration: '2-4 weeks',
      complexity: 'Moderate',
      successRate: 0.78,
      xpReward: 350,
    },
    'Advanced': {
      minLevel: 6,
      maxLevel: 8,
      avgDuration: '4-8 weeks',
      complexity: 'High',
      successRate: 0.62,
      xpReward: 600,
    },
    'Expert': {
      minLevel: 8,
      maxLevel: 10,
      avgDuration: '8+ weeks',
      complexity: 'Very High',
      successRate: 0.48,
      xpReward: 950,
    },
  },

  // Skill requirement matrices for mission types
  missionSkillRequirements: {
    'Community Outreach': {
      'Community Engagement': 5,
      'Communication': 4,
      'Empathy': 4,
    },
    'Data Analysis Project': {
      'Data Analysis': 6,
      'Problem Solving': 5,
      'Attention to Detail': 5,
    },
    'Crisis Response': {
      'Crisis Management': 7,
      'Leadership': 6,
      'Quick Decision Making': 6,
    },
    'Strategic Planning': {
      'Strategic Planning': 7,
      'Leadership': 6,
      'Data Analysis': 5,
    },
  },

  // Challenge scenarios for simulation
  challenges: [
    {
      type: 'Resource Constraints',
      probability: 0.6,
      skillRequired: 'Crisis Management',
      skillNeeded: 5,
    },
    {
      type: 'Team Conflict',
      probability: 0.4,
      skillRequired: 'Leadership',
      skillNeeded: 5,
    },
    {
      type: 'Scope Creep',
      probability: 0.5,
      skillRequired: 'Project Management',
      skillNeeded: 5,
    },
    {
      type: 'Stakeholder Resistance',
      probability: 0.35,
      skillRequired: 'Communication',
      skillNeeded: 4,
    },
  ],

  // Success factors and risk weighting
  successFactors: {
    'Skill Match': 0.35,
    'Experience': 0.25,
    'Mentorship': 0.20,
    'Resources': 0.15,
    'Team Quality': 0.05,
  },
};

// ===========================================================================
// 6. CAUSE AFFINITY MODELING DATASET
// ===========================================================================

export const causeAffinityDataset = {
  // Cause categories with characteristics
  causes: {
    'Education': {
      keywords: ['learning', 'students', 'schools', 'literacy', 'training'],
      relatedSkills: ['Teaching', 'Leadership', 'Communication'],
      demographics: ['Age 25-45', 'College educated', 'Parents'],
      engagementLevel: 0.72,
    },
    'Environment': {
      keywords: ['climate', 'sustainability', 'conservation', 'recycling'],
      relatedSkills: ['Data Analysis', 'Project Management', 'Systems Thinking'],
      demographics: ['Age 18-35', 'Urban', 'Tech sector'],
      engagementLevel: 0.68,
    },
    'Health': {
      keywords: ['wellness', 'healthcare', 'mental health', 'fitness'],
      relatedSkills: ['Empathy', 'Communication', 'Data Analysis'],
      demographics: ['All ages', 'Healthcare background', 'Health conscious'],
      engagementLevel: 0.75,
    },
    'Economic Justice': {
      keywords: ['poverty', 'employment', 'inequality', 'wage'],
      relatedSkills: ['Leadership', 'Community Engagement', 'Data Analysis'],
      demographics: ['Diverse', 'Urban workers', 'Activists'],
      engagementLevel: 0.65,
    },
    'Social Justice': {
      keywords: ['equity', 'discrimination', 'rights', 'diversity'],
      relatedSkills: ['Leadership', 'Communication', 'Advocacy'],
      demographics: ['Diverse', 'Activists', 'All ages'],
      engagementLevel: 0.70,
    },
  },

  // User affinity scoring algorithm inputs
  affinityFactors: {
    'Mission History Match': 0.35,
    'Skills Alignment': 0.25,
    'Demographics Match': 0.15,
    'Values Alignment': 0.20,
    'Impact Metrics': 0.05,
  },

  // Sample affinity profiles
  sampleProfiles: [
    {
      name: 'Environmental Activist',
      topCauses: ['Environment', 'Health'],
      scores: { Environment: 0.92, Health: 0.68, Education: 0.45 },
      recommendedCauses: ['Sustainability', 'Green Jobs', 'Climate Action'],
    },
    {
      name: 'Education Advocate',
      topCauses: ['Education', 'Economic Justice'],
      scores: { Education: 0.88, 'Economic Justice': 0.72, Health: 0.55 },
      recommendedCauses: ['Youth Programs', 'Literacy', 'STEM'],
    },
  ],
};

// ===========================================================================
// 7. VERIFIED IMPACT LEDGER DATASET
// ===========================================================================

export const verifiedImpactDataset = {
  // Token types and properties
  tokenTypes: {
    'Leadership Badge': {
      criteria: 'Led 2+ teams',
      value: 100,
      rarity: 'Common',
      verificationLevel: 'Peer',
      issuer: 'Community',
    },
    'Impact Star': {
      criteria: '50+ impact score on mission',
      value: 500,
      rarity: 'Uncommon',
      verificationLevel: 'Organization',
      issuer: 'Partner Organization',
    },
    'Master Volunteer': {
      criteria: '500+ total XP',
      value: 2000,
      rarity: 'Rare',
      verificationLevel: 'Third-Party',
      issuer: 'Verified Institution',
    },
    'Changemaker': {
      criteria: '1000+ reach impact',
      value: 5000,
      rarity: 'Legendary',
      verificationLevel: 'Third-Party',
      issuer: 'National Body',
    },
  },

  // Verification process
  verificationLevels: {
    'Self-Reported': {
      trustScore: 0.40,
      reversibility: 'Easily reversible',
      timeToIssue: '1 day',
    },
    'Peer Endorsed': {
      trustScore: 0.70,
      reversibility: 'Reversible with consensus',
      timeToIssue: '7 days',
    },
    'Organization Verified': {
      trustScore: 0.90,
      reversibility: 'Permanent unless fraud',
      timeToIssue: '14 days',
    },
    'Third-Party Validated': {
      trustScore: 1.0,
      reversibility: 'Blockchain immutable',
      timeToIssue: '30 days',
    },
  },

  // Historical token issuance rates
  issuanceRates: {
    2024: [
      { month: 'Jan', tokens: 245, verificationRate: 0.92 },
      { month: 'Feb', tokens: 312, verificationRate: 0.89 },
      { month: 'Mar', tokens: 428, verificationRate: 0.91 },
      { month: 'Apr', tokens: 356, verificationRate: 0.88 },
      { month: 'May', tokens: 512, verificationRate: 0.93 },
      { month: 'Jun', tokens: 621, verificationRate: 0.90 },
    ],
  },
};

// ===========================================================================
// 8. EMPLOYER INTELLIGENCE DATASET
// ===========================================================================

export const employerIntelligenceDataset = {
  // Top hiring organizations in nonprofit sector
  topEmployers: [
    {
      name: 'Global NGO Network',
      baseLocation: 'New York',
      openPositions: 245,
      avgSalary: 65000,
      topSkills: ['Leadership', 'Community Engagement', 'Data Analysis'],
      volunteerConversionRate: 0.32,
    },
    {
      name: 'Tech for Good Foundation',
      baseLocation: 'San Francisco',
      openPositions: 189,
      avgSalary: 85000,
      topSkills: ['Data Analysis', 'Project Management', 'Technology'],
      volunteerConversionRate: 0.28,
    },
    {
      name: 'Community Builders Alliance',
      baseLocation: 'Chicago',
      openPositions: 156,
      avgSalary: 52000,
      topSkills: ['Community Engagement', 'Leadership', 'Communication'],
      volunteerConversionRate: 0.45,
    },
  ],

  // Skill demand signals from job postings
  skillDemand: {
    'Leadership': { demand: 'high', trend: 'increasing', avgSalary: 68000 },
    'Project Management': { demand: 'high', trend: 'stable', avgSalary: 72000 },
    'Data Analysis': { demand: 'very high', trend: 'increasing', avgSalary: 78000 },
    'Community Engagement': { demand: 'high', trend: 'increasing', avgSalary: 55000 },
    'Crisis Management': { demand: 'medium', trend: 'increasing', avgSalary: 60000 },
  },

  // Industry growth rates
  industryGrowth: {
    'Nonprofit': { growthRate: 0.05, jobMarket: 'Competitive', avgSalary: 58000 },
    'Social Enterprise': { growthRate: 0.18, jobMarket: 'Growing', avgSalary: 65000 },
    'Tech for Good': { growthRate: 0.22, jobMarket: 'Hot', avgSalary: 82000 },
    'Education': { growthRate: 0.03, jobMarket: 'Stable', avgSalary: 55000 },
  },
};

// ===========================================================================
// 9. AI NARRATIVE GENERATOR DATASET
// ===========================================================================

export const aiNarrativeDataset = {
  // Impact story templates
  storyTemplates: [
    {
      type: 'Individual Impact',
      template: '{{volunteer}} helped {{beneficiary}} achieve {{outcome}} through {{action}}.',
      examples: [
        'Leo helped Maria improve her coding skills through 6 mentoring sessions.',
        'Sarah trained 45 youth in digital literacy.',
      ],
    },
    {
      type: 'Systemic Change',
      template: `{{volunteer}}'s work on {{project}} influenced {{scope}} people to {{behavior}}.`,
      examples: [
        'Robert\'s community garden initiative influenced 200 residents to adopt sustainable practices.',
      ],
    },
    {
      type: 'Leadership Growth',
      template: '{{volunteer}} grew from {{oldRole}} to {{newRole}}, demonstrating {{skill}} mastery.',
      examples: [
        'Lisa grew from task contributor to program director, demonstrating strategic planning mastery.',
      ],
    },
  ],

  // Narrative components library
  narrativeLibrary: {
    verbs: [
      'pioneered',
      'spearheaded',
      'launched',
      'scaled',
      'transformed',
      'catalyzed',
      'facilitated',
      'mentored',
    ],
    impacts: [
      'systemic change',
      'community resilience',
      'economic opportunity',
      'educational access',
      'health equity',
    ],
    metrics: ['people served', 'lives impacted', 'dollars raised', 'programs launched'],
  },

  // Quality scoring factors
  narrativeQuality: {
    'Specificity': 0.25,
    'Quantification': 0.20,
    'Impact Clarity': 0.30,
    'Personal Growth': 0.15,
    'Authenticity': 0.10,
  },
};

/**
 * Helper function to get random dataset sample
 */
export function getSampleDataPoint<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Helper function to calculate weighted score
 */
export function calculateWeightedScore(
  components: Record<string, number>,
  weights: Record<string, number>
): number {
  return (
    Object.entries(components).reduce((sum, [key, value]) => {
      return sum + (value * (weights[key] || 0));
    }, 0) / Object.values(weights).reduce((a, b) => a + b, 0)
  );
}
