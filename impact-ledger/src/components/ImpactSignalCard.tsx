import React from 'react';
import { motion } from 'framer-motion';
import styles from './ImpactSignalCard.module.css';

interface ImpactScore {
  scope: number;
  complexity: number;
  autonomy: number;
  outcomes: number;
  verification: number;
  peerEvaluation: number;
}

interface ImpactSignalCardProps {
  overallScore: number;
  scores: ImpactScore;
  anomalyDetected: boolean;
  transparencyRating: number;
}

export const ImpactSignalCard: React.FC<ImpactSignalCardProps> = ({
  overallScore,
  scores,
  anomalyDetected,
  transparencyRating,
}) => {
  const getDimensionLabel = (dimension: string): string => {
    const labels: Record<string, string> = {
      scope: '🌍 Scope',
      complexity: '⚙️ Complexity',
      autonomy: '🎯 Autonomy',
      outcomes: '✅ Outcomes',
      verification: '✓ Verification',
      peerEvaluation: '👥 Peer Eval',
    };
    return labels[dimension] || dimension;
  };

  const getDimensionColor = (value: number): string => {
    if (value >= 80) return '#10b981'; // green
    if (value >= 60) return '#3b82f6'; // blue
    if (value >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const dimensions = Object.entries(scores);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>💎 Impact Signal Strength</h3>
          <p className={styles.subtitle}>
            How effectively your civic contributions are measured
          </p>
        </div>
        {anomalyDetected && (
          <motion.div
            className={styles.anomalyBadge}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ⚠️ Anomaly Detected
          </motion.div>
        )}
      </div>

      {/* Overall Score Circle */}
      <div className={styles.scoreCircleContainer}>
        <div className={styles.scoreCircle}>
          <svg viewBox="0 0 100 100" className={styles.svg}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(107, 114, 128, 0.2)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeDasharray={`${(overallScore / 100) * 282.74} 282.74`}
              initial={{ strokeDasharray: '0 282.74' }}
              animate={{ strokeDasharray: `${(overallScore / 100) * 282.74} 282.74` }}
              transition={{ delay: 0.3, duration: 1.5 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="100" y2="100">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.scoreContent}>
            <motion.p
              className={styles.scoreNumber}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(overallScore)}
            </motion.p>
            <p className={styles.scoreLabel}>Impact Score</p>
          </div>
        </div>

        <div className={styles.transparency}>
          <p className={styles.transparencyLabel}>Transparency Rating</p>
          <div className={styles.transparencyBar}>
            <motion.div
              className={styles.transparencyFill}
              initial={{ width: 0 }}
              animate={{ width: `${transparencyRating}%` }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
          <p className={styles.transparencyValue}>{transparencyRating}%</p>
        </div>
      </div>

      {/* Dimensions Grid */}
      <div className={styles.dimensionsTitle}>Impact Dimensions</div>
      <div className={styles.dimensionsGrid}>
        {dimensions.map(([key, value], idx) => (
          <motion.div
            key={key}
            className={styles.dimension}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <div className={styles.dimensionHeader}>
              <span className={styles.dimensionLabel}>
                {getDimensionLabel(key)}
              </span>
              <span
                className={styles.dimensionScore}
                style={{ color: getDimensionColor(value) }}
              >
                {value}%
              </span>
            </div>
            <div className={styles.dimensionBar}>
              <motion.div
                className={styles.dimensionFill}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 1 }}
                style={{
                  background: `linear-gradient(90deg, ${getDimensionColor(value)} 0%, ${getDimensionColor(value + 10)} 100%)`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Message */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          {anomalyDetected
            ? '⚠️ Your recent claims show unusual patterns. Review them for accuracy.'
            : '✅ Your impact claims are consistent and well-verified.'}
        </p>
      </div>
    </div>
  );
};

export default ImpactSignalCard;
