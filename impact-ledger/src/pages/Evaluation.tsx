import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, CardFooter, Badge, Button } from '../components';
import { mockCompletedMissions } from '../data/mockData';
import styles from './Evaluation.module.css';

export const Evaluation: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [verificationNotes, setVerificationNotes] = useState<string>('');

  const awaitingVerification = mockCompletedMissions.filter((m) => m.status === 'awaiting_verification');
  const verified = mockCompletedMissions.filter((m) => m.status === 'verified');

  const handleVerify = (missionId: string) => {
    alert(`Mission ${missionId} verified! Soulbound token minted on blockchain.`);
    setSelectedMission(null);
    setVerificationNotes('');
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
    <div className={styles.evaluation}>
      {/* Header */}
      <motion.div
        className={styles.header}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1>✅ Impact Verification</h1>
          <p>Verify volunteer contributions and mint Verified Impact Tokens</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{awaitingVerification.length}</div>
            <div className={styles.statLabel}>Pending</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{verified.length}</div>
            <div className={styles.statLabel}>Verified</div>
          </div>
        </div>
      </motion.div>

      {/* Awaiting Verification Section */}
      <motion.div
        className={styles.section}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.sectionTitle}>⏳ Awaiting Verification ({awaitingVerification.length})</h2>

        {awaitingVerification.length > 0 ? (
          <motion.div
            className={styles.missionsGrid}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {awaitingVerification.map((mission) => (
              <motion.div key={mission.id} variants={itemVariants}>
                <Card
                  hoverable
                  interactive={selectedMission === mission.id}
                  onClick={() => setSelectedMission(mission.id)}
                >
                  <CardHeader>
                    <div className={styles.missionHead}>
                      <div>
                        <h3>{mission.title}</h3>
                        <p className={styles.orgName}>{mission.organization}</p>
                      </div>
                      <Badge variant="warning">PENDING</Badge>
                    </div>
                  </CardHeader>

                  <CardBody>
                    <div className={styles.volunteerInfo}>
                      <h4>👤 Volunteer</h4>
                      <p className={styles.volunteerName}>{mission.volunteerName}</p>
                      <p className={styles.volunteerEmail}>{mission.volunteerEmail}</p>
                    </div>

                    <div className={styles.missionDetails}>
                      <div className={styles.detail}>
                        <span className={styles.label}>📅 Completed</span>
                        <span className={styles.value}>
                          {new Date(mission.completedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className={styles.detail}>
                        <span className={styles.label}>⏱️ Duration</span>
                        <span className={styles.value}>{mission.missionDuration}</span>
                      </div>
                    </div>

                    <div className={styles.description}>
                      <h4>📝 Mission Summary</h4>
                      <p>{mission.description}</p>
                    </div>

                    <div className={styles.skillsGained}>
                      <h4>🎓 Skills Verified</h4>
                      <div className={styles.skillsList}>
                        {mission.skillsVerified.map((skill) => (
                          <div key={skill.skillId} className={styles.skillItem}>
                            <span className={styles.skillName}>{skill.skillName}</span>
                            <Badge variant="success">+{skill.levelGained} Levels</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedMission === mission.id && (
                      <motion.div
                        className={styles.verificationForm}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <h4>✍️ Verification Notes (Optional)</h4>
                        <textarea
                          className={styles.textarea}
                          placeholder="Confirm volunteer achievement and add notes..."
                          value={verificationNotes}
                          onChange={(e) => setVerificationNotes(e.target.value)}
                          rows={3}
                        />
                      </motion.div>
                    )}
                  </CardBody>

                  {selectedMission === mission.id && (
                    <CardFooter>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleVerify(mission.id)}
                      >
                        ✅ Verify & Mint Token
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card>
            <CardBody className={styles.emptyState}>
              <p>🎉 All missions verified! No pending reviews.</p>
            </CardBody>
          </Card>
        )}
      </motion.div>

      {/* Already Verified Section */}
      <motion.div
        className={styles.section}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className={styles.sectionTitle}>✅ Previously Verified ({verified.length})</h2>

        <motion.div
          className={styles.missionsGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {verified.map((mission) => (
            <motion.div key={mission.id} variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className={styles.missionHead}>
                    <div>
                      <h3>{mission.title}</h3>
                      <p className={styles.orgName}>{mission.organization}</p>
                    </div>
                    <Badge variant="success">VERIFIED ✓</Badge>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className={styles.volunteerInfo}>
                    <h4>👤 Volunteer</h4>
                    <p className={styles.volunteerName}>{mission.volunteerName}</p>
                  </div>

                  <div className={styles.skillsGained}>
                    <h4>🏆 Skills Gained</h4>
                    <div className={styles.skillsList}>
                      {mission.skillsVerified.map((skill) => (
                        <div key={skill.skillId} className={styles.skillItem}>
                          <span className={styles.skillName}>{skill.skillName}</span>
                          <Badge variant="success">+{skill.levelGained} Levels</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.tokenInfo}>
                    <span className={styles.tokenIcon}>🔐</span>
                    <div>
                      <p className={styles.tokenLabel}>Soulbound Token Minted</p>
                      <p className={styles.tokenHash}>
                        On-chain verification complete
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        className={styles.infoSection}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader>
            <h3>🔐 About Impact Verification</h3>
          </CardHeader>
          <CardBody>
            <div className={styles.infoContent}>
              <div className={styles.infoItem}>
                <div className={styles.infoNumber}>1️⃣</div>
                <div>
                  <h4>Verify Impact</h4>
                  <p>Organization confirms volunteer completed the mission and gained skills</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoNumber}>2️⃣</div>
                <div>
                  <h4>Mint Token</h4>
                  <p>A Soulbound Token (SBT) is automatically minted on Polygon blockchain</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoNumber}>3️⃣</div>
                <div>
                  <h4>Permanent Record</h4>
                  <p>Token is permanently linked to volunteer's wallet, tamper-proof</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoNumber}>4️⃣</div>
                <div>
                  <h4>Career Impact</h4>
                  <p>Verifiable proof of competence that any employer can validate</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
