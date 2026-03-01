import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CivicSkillTree,
  GrowthTrajectoryGraph,
  ImpactSignalCard,
  SkillDeltaForecast,
} from '../components';
import { calculateImpactEffectivenessScore } from '../services/impactEffectivenessModel';
import { analyzeGrowthTrajectory } from '../services/civicGrowthTrajectory';
import styles from './Dashboard.module.css';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNextLevel: number;
  locked: boolean;
  icon: string;
  description: string;
}

interface Mission {
  id: string;
  name: string;
  description: string;
  skillsGained: Record<string, number>;
  organization: string;
  impactScore: number;
  complexity: number;
}

interface TrajectoryData {
  date: string;
  overallLevel: number;
  skillsUnlocked: number;
  totalXp: number;
  missionCount: number;
  phase: string;
}

// Mock data - in production, would come from backend
const mockUserData = {
  id: '123',
  name: 'Leo Chen',
  totalMissionsCompleted: 12,
  totalXpEarned: 4250,
  currentLevel: 8,
  verifiedTokens: 5,
};

const mockSkills: Skill[] = [
  {
    id: 'leadership',
    name: 'Leadership',
    category: 'Soft Skills',
    level: 7,
    maxLevel: 10,
    xp: 2400,
    xpToNextLevel: 3000,
    locked: false,
    icon: '👥',
    description: 'Ability to inspire and guide teams',
  },
  {
    id: 'project-management',
    name: 'Project Management',
    category: 'Professional',
    level: 6,
    maxLevel: 10,
    xp: 1800,
    xpToNextLevel: 2500,
    locked: false,
    icon: '📊',
    description: 'Planning, organizing, and managing projects',
  },
  {
    id: 'community-engagement',
    name: 'Community Engagement',
    category: 'Civic',
    level: 8,
    maxLevel: 10,
    xp: 2800,
    xpToNextLevel: 3500,
    locked: false,
    icon: '🤝',
    description: 'Building and maintained community relationships',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'Technical',
    level: 5,
    maxLevel: 10,
    xp: 1500,
    xpToNextLevel: 2200,
    locked: false,
    icon: '📈',
    description: 'Analyzing and interpreting data',
  },
  {
    id: 'crisis-management',
    name: 'Crisis Management',
    category: 'Professional',
    level: 4,
    maxLevel: 10,
    xp: 900,
    xpToNextLevel: 1800,
    locked: false,
    icon: '🆘',
    description: 'Managing challenging situations',
  },
  {
    id: 'strategic-planning',
    name: 'Strategic Planning',
    category: 'Professional',
    level: 3,
    maxLevel: 10,
    xp: 600,
    xpToNextLevel: 1500,
    locked: false,
    icon: '🎯',
    description: 'Long-term planning and vision setting',
  },
  {
    id: 'innovation',
    name: 'Innovation & Creativity',
    category: 'Soft Skills',
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNextLevel: 1200,
    locked: true,
    icon: '💡',
    description: 'Generating creative solutions',
  },
  {
    id: 'public-speaking',
    name: 'Public Speaking',
    category: 'Soft Skills',
    level: 0,
    maxLevel: 10,
    xp: 0,
    xpToNextLevel: 1000,
    locked: true,
    icon: '🎤',
    description: 'Effective communication at scale',
  },
];

const mockCompletedMissions: Mission[] = [
  {
    id: 'm1',
    name: 'Community Outreach Lead',
    description: 'Led campaign for local food bank',
    skillsGained: { 'Community Engagement': 5, 'Leadership': 3 },
    organization: 'Food Bank Network',
    impactScore: 87,
    complexity: 6,
  },
  {
    id: 'm2',
    name: 'Youth Mentorship Program',
    description: 'Mentored 5 high school students',
    skillsGained: { 'Leadership': 4, 'Communication': 3 },
    organization: 'Education Empowers',
    impactScore: 82,
    complexity: 5,
  },
  {
    id: 'm3',
    name: 'Climate Action Event Coordinator',
    description: 'Organized sustainability workshop',
    skillsGained: { 'Project Management': 4, 'Community Engagement': 3 },
    organization: 'Climate Action Now',
    impactScore: 79,
    complexity: 5,
  },
];

const mockTrajectoryData: TrajectoryData[] = [
  { date: 'Jan', overallLevel: 4, skillsUnlocked: 3, totalXp: 800, missionCount: 2, phase: 'exploration' },
  { date: 'Feb', overallLevel: 5, skillsUnlocked: 4, totalXp: 1200, missionCount: 3, phase: 'exploration' },
  { date: 'Mar', overallLevel: 5, skillsUnlocked: 4, totalXp: 1500, missionCount: 4, phase: 'acceleration' },
  { date: 'Apr', overallLevel: 6, skillsUnlocked: 5, totalXp: 2100, missionCount: 6, phase: 'acceleration' },
  { date: 'May', overallLevel: 7, skillsUnlocked: 6, totalXp: 3200, missionCount: 9, phase: 'acceleration' },
  { date: 'Jun', overallLevel: 8, skillsUnlocked: 6, totalXp: 4250, missionCount: 12, phase: 'mastery' },
];

const rolePredictions = [
  {
    roleName: 'Community Manager',
    currentProbability: 0.72,
    projectedProbability: 0.88,
    delta: 0.16,
    confidenceLower: 0.85,
    confidenceUpper: 0.92,
    timeframe: '2 months',
  },
  {
    roleName: 'Project Manager',
    currentProbability: 0.65,
    projectedProbability: 0.81,
    delta: 0.16,
    confidenceLower: 0.76,
    confidenceUpper: 0.86,
    timeframe: '3 months',
  },
  {
    roleName: 'Executive Director',
    currentProbability: 0.48,
    projectedProbability: 0.62,
    delta: 0.14,
    confidenceLower: 0.55,
    confidenceUpper: 0.69,
    timeframe: '6 months',
  },
  {
    roleName: 'Operations Director',
    currentProbability: 0.55,
    projectedProbability: 0.74,
    delta: 0.19,
    confidenceLower: 0.68,
    confidenceUpper: 0.80,
    timeframe: '4 months',
  },
];


export const Dashboard = () => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Calculate impact score from AI Impact Effectiveness Model
  // This uses real mission data with proper algorithms
  const impactScore = useMemo(() => {
    const firstMission = mockCompletedMissions[0];
    const scores = calculateImpactEffectivenessScore(
      {
        id: firstMission.id,
        title: firstMission.name,
        description: firstMission.description,
        organization: firstMission.organization,
        location: 'Tunis, Tunisia',
        teamSize: 3,
        budget: 5000, // USD
        duration: 12, // weeks
        measurableOutcomes: [
          { 
            metric: 'Community Members Served', 
            targetValue: 100, 
            actualValue: 145, // exceeded target
            unit: 'people', 
            verified: true 
          },
          {
            metric: 'Skills Transferred',
            targetValue: 50,
            actualValue: 78,
            unit: 'hours',
            verified: true
          }
        ],
        userResponsibilityLevel: 'initiative', // Full project ownership
      },
      {
        missionId: firstMission.id,
        organizationVerified: true,
        verificationDate: new Date().toISOString(),
        verificationNotes: 'Verified through site monitoring',
        verifierRole: 'Organization Manager',
      },
      [
        { score: 4.8, comment: 'Excellent leadership and execution' },
        { score: 4.6, comment: 'Brought team together effectively' }
      ]
    );
    return scores;
  }, []);

  // Get growth trajectory analysis
  const trajectoryAnalysis = useMemo(() => {
    return analyzeGrowthTrajectory(
      'user-' + mockUserData.id,
      mockCompletedMissions.map(() => ({
        completedDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
        skillsGained: { 'Leadership': 2, 'Project Management': 1.5 },
        organizationVerified: true,
      })),
      { 'Leadership': 7, 'Project Management': 6, 'Community': 8, 'Data Analysis': 5 }
    );
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className={styles.dashboard}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div className={styles.header} variants={itemVariants}>
        <div>
          <h1 className={styles.title}>Welcome Back, {mockUserData.name} 👋</h1>
          <p className={styles.subtitle}>
            Your Civic Operating System - Track impact, forecast career growth
          </p>
        </div>
      </motion.div>

      {/* Core Dashboard Stats */}
      <motion.div className={styles.statsGrid} variants={itemVariants}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Missions</p>
            <p className={styles.statValue}>{mockUserData.totalMissionsCompleted}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Level</p>
            <p className={styles.statValue}>{mockUserData.currentLevel}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎖️</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Verified Tokens</p>
            <p className={styles.statValue}>{mockUserData.verifiedTokens}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💎</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total XP</p>
            <p className={styles.statValue}>{mockUserData.totalXpEarned}</p>
          </div>
        </div>
      </motion.div>

      {/* Impact Signal + Trajectory Row */}
      <motion.div className={styles.twoColumnRow} variants={itemVariants}>
        <ImpactSignalCard
          overallScore={impactScore.compositeImpactSignalStrength}
          scores={{
            scope: impactScore.scopeScore,
            complexity: impactScore.complexityScore,
            autonomy: impactScore.autonomyScore,
            outcomes: impactScore.outcomeScore,
            verification: impactScore.organizationVerificationScore,
            peerEvaluation: impactScore.peerEvaluationScore,
          }}
          anomalyDetected={false}
          transparencyRating={92}
        />
      </motion.div>

      {/* Growth Trajectory */}
      <motion.div variants={itemVariants}>
        <GrowthTrajectoryGraph
          data={mockTrajectoryData}
          currentPhase={trajectoryAnalysis.growthPhase as any}
          velocityPerMonth={trajectoryAnalysis.skillVelocity}
          consistencyScore={trajectoryAnalysis.completionConsistency}
        />
      </motion.div>

      {/* Civic Skill Tree */}
      <motion.div variants={itemVariants}>
        <CivicSkillTree
          skills={mockSkills}
          onSkillClick={setSelectedSkill}
        />
      </motion.div>

      {/* Skill Delta Forecast */}
      <motion.div variants={itemVariants}>
        <SkillDeltaForecast
          predictions={rolePredictions}
          plannedMissions={['Community Leadership Program', 'Crisis Response Training']}
        />
      </motion.div>

      {/* Verified Impact Tokens */}
      <motion.div className={styles.tokensSection} variants={itemVariants}>
        <div className={styles.tokensHeader}>
          <h3 className={styles.tokensTitle}>🏆 Verified Impact Tokens</h3>
          <p className={styles.tokensSubtitle}>Non-transferable credentials from completed missions</p>
        </div>
        <div className={styles.tokensList}>
          {mockCompletedMissions.map((mission, idx) => (
            <motion.div
              key={mission.id}
              className={styles.tokenCard}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={styles.tokenIcon}>🎖️</div>
              <div className={styles.tokenContent}>
                <h4 className={styles.tokenName}>{mission.name}</h4>
                <p className={styles.tokenOrg}>{mission.organization}</p>
                <div className={styles.tokenMeta}>
                  <span className={styles.tokenScore}>Impact: {mission.impactScore}</span>
                  <span className={styles.tokenDate}>Jun 2024</span>
                </div>
              </div>
              <div className={styles.tokenStatus}>✓ Verified</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Skill Details Modal */}
      {selectedSkill && (
        <motion.div
          className={styles.skillModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedSkill(null)}
        >
          <motion.div
            className={styles.skillModalContent}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedSkill(null)}
            >
              ✕
            </button>
            <div className={styles.skillModalHeader}>
              <h2>{selectedSkill.name}</h2>
              <p>{selectedSkill.description}</p>
            </div>
            <div className={styles.skillModalMeta}>
              <div>
                <p className={styles.metaLabel}>Category</p>
                <p className={styles.metaValue}>{selectedSkill.category}</p>
              </div>
              <div>
                <p className={styles.metaLabel}>Level</p>
                <p className={styles.metaValue}>
                  {selectedSkill.level}/{selectedSkill.maxLevel}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
