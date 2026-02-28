import React from 'react';
import styles from './SkillBar.module.css';

interface SkillBarProps {
  name: string;
  level: number;
  maxLevel?: number;
  xp?: number;
  maxXp?: number;
  category?: string;
  className?: string;
}

export const SkillBar: React.FC<SkillBarProps> = ({
  name,
  level,
  maxLevel = 50,
  xp = 0,
  maxXp = 100,
  category,
  className = '',
}) => {
  const progressPercent = (level / maxLevel) * 100;
  const xpPercent = (xp / maxXp) * 100;

  return (
    <div className={`${styles.skillBar} ${className}`}>
      <div className={styles.header}>
        <div className={styles.nameSection}>
          <h4 className={styles.name}>{name}</h4>
          {category && <span className={styles.category}>{category}</span>}
        </div>
        <span className={styles.level}>
          Lvl {level}/{maxLevel}
        </span>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressOuter}>
          <div
            className={styles.progressBar}
            style={{
              width: `${progressPercent}%`,
            }}
          />
        </div>
        <span className={styles.percentage}>{Math.round(progressPercent)}%</span>
      </div>

      {maxXp > 0 && (
        <div className={styles.xpContainer}>
          <span className={styles.xpLabel}>XP Progress</span>
          <div className={styles.xpOuter}>
            <div
              className={styles.xpBar}
              style={{
                width: `${xpPercent}%`,
              }}
            />
          </div>
          <span className={styles.xpValue}>
            {xp}/{maxXp}
          </span>
        </div>
      )}
    </div>
  );
};
