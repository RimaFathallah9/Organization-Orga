import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './CivicSkillTree.module.css';

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

interface CivicSkillTreeProps {
  skills: Skill[];
  onSkillClick?: (skill: Skill) => void;
}

export const CivicSkillTree: React.FC<CivicSkillTreeProps> = ({
  skills,
  onSkillClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(skills.map(s => s.category)));
  const filteredSkills = selectedCategory 
    ? skills.filter(s => s.category === selectedCategory)
    : skills;

  const unlockedSkills = filteredSkills.filter(s => !s.locked);
  const lockedSkills = filteredSkills.filter(s => s.locked);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🌳 Civic Skill Tree</h2>
      
      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <button
          className={`${styles.categoryBtn} ${selectedCategory === null ? styles.active : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Skills
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Unlocked Skills */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>✨ Unlocked Skills ({unlockedSkills.length})</h3>
        <div className={styles.skillGrid}>
          {unlockedSkills.map((skill, idx) => (
            <motion.div
              key={skill.id}
              className={`${styles.skillCard} ${styles.unlocked}`}
              onClick={() => onSkillClick?.(skill)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}
            >
              <div className={styles.skillIcon}>{skill.icon}</div>
              
              <div className={styles.skillContent}>
                <h4 className={styles.skillName}>{skill.name}</h4>
                <p className={styles.skillCategory}>{skill.category}</p>
                
                {/* Level Display */}
                <div className={styles.levelBadge}>
                  Lvl {skill.level}
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className={styles.xpContainer}>
                <div className={styles.xpBar}>
                  <motion.div
                    className={styles.xpFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.xp / skill.xpToNextLevel) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                </div>
                <span className={styles.xpText}>
                  {skill.xp}/{skill.xpToNextLevel}
                </span>
              </div>

              <p className={styles.skillDescription}>{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Skills */}
      {lockedSkills.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>🔒 Locked Skills ({lockedSkills.length})</h3>
          <p className={styles.lockedHint}>Complete missions to unlock new competencies</p>
          <div className={styles.skillGrid}>
            {lockedSkills.map((skill, idx) => (
              <motion.div
                key={skill.id}
                className={`${styles.skillCard} ${styles.locked}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className={styles.skillIcon}>{skill.icon}</div>
                
                <div className={styles.skillContent}>
                  <h4 className={styles.skillName}>{skill.name}</h4>
                  <p className={styles.skillCategory}>{skill.category}</p>
                </div>

                <div className={styles.lockedBadge}>🔐 Locked</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CivicSkillTree;
