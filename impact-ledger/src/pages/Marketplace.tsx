import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardFooter, Badge, Button } from '../components';
import { mockMissions, mockUserProfile, mockSkillsTree } from '../data/mockData';
import { calculateMissionMatch, generateMissionRecommendations } from '../services/aiEvaluationService';
import styles from './Marketplace.module.css';

export const Marketplace: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'remote' | 'hybrid' | 'local'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'match' | 'xp' | 'recent'>('match');
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [savedMissions, setSavedMissions] = useState<Set<string>>(new Set());

  // Get user skills from mock data
  const userSkills = mockSkillsTree
    .filter(s => s.unlocked)
    .map(s => s.name);

  // Calculate match scores for all missions using AI
  const missionsWithMatch = mockMissions.map(mission => {
    const match = calculateMissionMatch(
      userSkills,
      mission.requiredSkills.map(s => s.skillName),
      mockUserProfile.location,
      mission.location,
      mockUserProfile.totalXpEarned
    );
    return {
      ...mission,
      aiMatchScore: match.matchScore,
      skillGaps: match.skillGaps,
      developmentPath: match.developmentPath
    };
  });

  // Filter missions
  let filteredMissions = missionsWithMatch
    .filter(m => filterType === 'all' ? true : m.type.toLowerCase() === filterType)
    .filter(m => searchTerm === '' ? true : 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Sort missions
  if (sortBy === 'match') {
    filteredMissions = filteredMissions.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  } else if (sortBy === 'xp') {
    filteredMissions = filteredMissions.sort((a, b) => b.rewards.xp - a.rewards.xp);
  }

  const handleApply = (missionId: string) => {
    const mission = missionsWithMatch.find(m => m.id === missionId);
    if (mission) {
      alert(`✅ Applied to: ${mission.title}\n\n${mission.developmentPath}`);
      setSelectedMission(null);
    }
  };

  const toggleSaveMission = (missionId: string) => {
    const newSaved = new Set(savedMissions);
    if (newSaved.has(missionId)) {
      newSaved.delete(missionId);
    } else {
      newSaved.add(missionId);
    }
    setSavedMissions(newSaved);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className={styles.marketplace}>
      {/* Header */}
      <motion.div
        className={styles.header}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1>🎯 Mission Marketplace</h1>
          <p>Find missions that match your skills and amplify your impact</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statBadge}>
            <span className={styles.statNumber}>{filteredMissions.length}</span>
            <span className={styles.statLabel}>Matching Missions</span>
          </div>
          <div className={styles.statBadge}>
            <span className={styles.statNumber}>⚡ AI-Powered</span>
            <span className={styles.statLabel}>Smart Matching</span>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className={styles.filterSection}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardBody className={styles.filterContent}>
            {/* Search Bar */}
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="🔍 Search missions, organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>📍 Location Preference</label>
              <div className={styles.filterButtons}>
                {['all', 'remote', 'hybrid', 'local'].map((type) => (
                  <button
                    key={type}
                    className={`${styles.filterBtn} ${
                      filterType === type ? styles.active : ''
                    }`}
                    onClick={() =>
                      setFilterType(type as 'all' | 'remote' | 'hybrid' | 'local')
                    }
                  >
                    {type === 'all' ? '✨ All' : `${type.charAt(0).toUpperCase()}${type.slice(1)}`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>🔤 Sort By</label>
              <div className={styles.filterButtons}>
                {[
                  { value: 'match' as const, label: '🎯 Best Match' },
                  { value: 'xp' as const, label: '⚡ Most XP' },
                  { value: 'recent' as const, label: '✨ Recent' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`${styles.filterBtn} ${
                      sortBy === option.value ? styles.active : ''
                    }`}
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Missions Grid */}
      <motion.div
        className={styles.missionsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredMissions.length > 0 ? (
          filteredMissions.map((mission) => {
            const recommendations = generateMissionRecommendations(mission.aiMatchScore, mission.skillGaps);
            const isSaved = savedMissions.has(mission.id);
            
            return (
              <motion.div key={mission.id} variants={itemVariants}>
                <Card
                  hoverable
                  interactive={selectedMission === mission.id}
                  onClick={() => setSelectedMission(mission.id)}
                >
                  <CardHeader>
                    <div className={styles.missionHeader}>
                      <div className={styles.missionTitle}>
                        <h3>{mission.title}</h3>
                        <p className={styles.organization}>{mission.organization}</p>
                      </div>
                      <div
                        className={`${styles.matchScore} ${
                          mission.aiMatchScore >= 85
                            ? styles.scoreHigh
                            : mission.aiMatchScore >= 70
                              ? styles.scoreMid
                              : styles.scoreLow
                        }`}
                      >
                        <div className={styles.scoreValue}>🤖 {mission.aiMatchScore}%</div>
                        <div className={styles.scoreLabel}>AI Match</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody>
                    <p className={styles.description}>{mission.description}</p>

                    {/* Development Path from AI */}
                    <div className={styles.developmentPath}>
                      <span className={styles.pathIcon}>📈</span>
                      <p>{mission.developmentPath}</p>
                    </div>

                    {/* Skill Gaps */}
                    {mission.skillGaps.length > 0 && (
                      <div className={styles.skillGaps}>
                        <h4>Skill Gap Analysis</h4>
                        <div className={styles.skillTags}>
                          {mission.skillGaps.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              📚 {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={styles.details}>
                      <div className={styles.detail}>
                        <span className={styles.icon}>📍</span>
                        <span>{mission.location}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.icon}>⏱️</span>
                        <span>{mission.duration}</span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.icon}>🗓️</span>
                        <span>
                          Starts{' '}
                          {new Date(mission.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className={styles.skillsRequired}>
                      <h4>🎓 Skills Needed</h4>
                      <div className={styles.skillTags}>
                        {mission.requiredSkills.map((req) => (
                          <Badge key={req.skillId} variant="secondary">
                            {req.skillName} (Lvl {req.requiredLevel}+)
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className={styles.rewards}>
                      <div className={styles.rewardItem}>
                        <span className={styles.rewardIcon}>⚡</span>
                        <div>
                          <div className={styles.rewardValue}>{mission.rewards.xp} XP</div>
                          <div className={styles.rewardLabel}>Experience</div>
                        </div>
                      </div>
                      <div className={styles.rewardItem}>
                        <span className={styles.rewardIcon}>🏆</span>
                        <div>
                          <div className={styles.rewardValue}>{mission.rewards.tokens} Token</div>
                          <div className={styles.rewardLabel}>Verified Impact</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className={styles.recommendations}>
                      <h4>💡 AI Recommendations</h4>
                      {recommendations.map((rec, idx) => (
                        <div key={idx} className={styles.recommendation}>
                          {rec}
                        </div>
                      ))}
                    </div>
                  </CardBody>

                  <CardFooter>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleApply(mission.id)}
                    >
                      Apply Now
                    </Button>
                    <button
                      className={styles.saveButton}
                      onClick={() => toggleSaveMission(mission.id)}
                      title={isSaved ? 'Remove from saved' : 'Save for later'}
                    >
                      {isSaved ? '❤️' : '🤍'}
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className={styles.noResults}>
            <p>📭 No missions found. Try adjusting your filters!</p>
          </div>
        )}
      </motion.div>

      {/* Tips Section */}
      <motion.div
        className={styles.tipsSection}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <h3>💡 Tips for Success</h3>
          </CardHeader>
          <CardBody>
            <div className={styles.tips}>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>✨</span>
                <p>Higher match scores indicate missions closely aligned with your goals</p>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>🚀</span>
                <p>Starting new challenges builds skills and unlocks career opportunities</p>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipIcon}>🔐</span>
                <p>Completing missions earns you cryptographically verified proof of impact</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
