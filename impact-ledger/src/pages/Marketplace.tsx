import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardFooter, Badge, Button } from '../components';
import { mockMissions } from '../data/mockData';
import styles from './Marketplace.module.css';

export const Marketplace: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'remote' | 'hybrid' | 'local'>('all');
  const [selectedMission, setSelectedMission] = useState<string | null>(null);

  const filteredMissions =
    filterType === 'all'
      ? mockMissions
      : mockMissions.filter((m) => m.type.toLowerCase() === filterType);

  const handleApply = (missionId: string) => {
    alert(`Applied to mission: ${missionId}`);
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
            <span className={styles.statNumber}>{mockMissions.length}</span>
            <span className={styles.statLabel}>Active Missions</span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className={styles.filterSection}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardBody className={styles.filterContent}>
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
          filteredMissions.map((mission) => (
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
                        mission.matchScore >= 80
                          ? styles.scoreHigh
                          : mission.matchScore >= 60
                            ? styles.scoreMid
                            : styles.scoreLow
                      }`}
                    >
                      <div className={styles.scoreValue}>{mission.matchScore}%</div>
                      <div className={styles.scoreLabel}>Match</div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody>
                  <p className={styles.description}>{mission.description}</p>

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
                </CardBody>

                <CardFooter>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleApply(mission.id)}
                  >
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No missions found for this filter</p>
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
