import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './SkillDeltaForecast.module.css';

interface RolePrediction {
  roleName: string;
  currentProbability: number;
  projectedProbability: number;
  delta: number;
  confidenceLower: number;
  confidenceUpper: number;
  timeframe: string;
}

interface SkillDeltaForecastProps {
  predictions: RolePrediction[];
  plannedMissions: string[];
}

export const SkillDeltaForecast: React.FC<SkillDeltaForecastProps> = ({
  predictions,
  plannedMissions,
}) => {
  const [selectedRole, setSelectedRole] = useState<RolePrediction | null>(
    predictions[0] || null
  );

  const chartData = predictions.map(p => ({
    role: p.roleName,
    current: Math.round(p.currentProbability * 100),
    projected: Math.round(p.projectedProbability * 100),
  }));

  const getDeltaColor = (delta: number): string => {
    if (delta > 0) return '#10b981'; // green
    if (delta < 0) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const getDeltaLabel = (delta: number): string => {
    if (delta > 0) return `+${(delta * 100).toFixed(1)}%`;
    return `${(delta * 100).toFixed(1)}%`;
  };

  const CustomTooltip = (props: any) => {
    if (props.active && props.payload) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipRole}>{props.payload[0]?.payload?.role}</p>
          <p style={{ color: '#3b82f6' }}>
            Current: {props.payload[0]?.value}%
          </p>
          <p style={{ color: '#10b981' }}>
            Projected: {props.payload[1]?.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>📊 Skill Delta Forecast</h3>
          <p className={styles.subtitle}>
            How your career probability changes with planned missions
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Planned Missions</p>
          <p className={styles.metricValue}>{plannedMissions.length}</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Avg Impact</p>
          <p className={styles.metricValue}>
            {predictions.length > 0
              ? (
                  (predictions.reduce((sum, p) => sum + p.delta, 0) /
                    predictions.length) *
                  100
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Best Opportunity</p>
          <p className={styles.metricValue}>
            {predictions.length > 0
              ? predictions.reduce((max, p) => (p.delta > max.delta ? p : max))
                  .roleName
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartContainer}>
        <h4 className={styles.chartTitle}>Role Probability Comparison</h4>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(209, 213, 219, 0.2)" />
            <XAxis dataKey="role" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="current"
              fill="url(#currentGrad)"
              name="Current Probability"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="projected"
              fill="url(#projectedGrad)"
              name="Projected Probability"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Role Details */}
      <div className={styles.rolesContainer}>
        <h4 className={styles.rolesTitle}>Role-by-Role Forecast</h4>
        <div className={styles.rolesList}>
          {predictions.map((prediction, idx) => (
            <motion.div
              key={prediction.roleName}
              className={`${styles.roleCard} ${
                selectedRole?.roleName === prediction.roleName
                  ? styles.selected
                  : ''
              }`}
              onClick={() => setSelectedRole(prediction)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <div className={styles.roleHeader}>
                <h5 className={styles.roleName}>{prediction.roleName}</h5>
                <div
                  className={styles.deltaBadge}
                  style={{
                    background: getDeltaColor(prediction.delta),
                    color: 'white',
                  }}
                >
                  {getDeltaLabel(prediction.delta)}
                </div>
              </div>

              <div className={styles.roleMetrics}>
                <div className={styles.metricSmall}>
                  <span className={styles.metricSmallLabel}>Current</span>
                  <span className={styles.metricSmallValue}>
                    {Math.round(prediction.currentProbability * 100)}%
                  </span>
                </div>
                <div className={styles.metricSmall}>
                  <span className={styles.metricSmallLabel}>Projected</span>
                  <span className={styles.metricSmallValue}>
                    {Math.round(prediction.projectedProbability * 100)}%
                  </span>
                </div>
                <div className={styles.metricSmall}>
                  <span className={styles.metricSmallLabel}>Timeframe</span>
                  <span className={styles.metricSmallValue}>
                    {prediction.timeframe}
                  </span>
                </div>
              </div>

              {selectedRole?.roleName === prediction.roleName && (
                <motion.div
                  className={styles.roleDetails}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.confidenceInterval}>
                    <p className={styles.confidenceLabel}>
                      95% Confidence Interval
                    </p>
                    <p className={styles.confidenceRange}>
                      {Math.round(prediction.confidenceLower * 100)}% -{' '}
                      {Math.round(prediction.confidenceUpper * 100)}%
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className={styles.insights}>
        <div className={styles.insightCard}>
          <p className={styles.insightTitle}>💡 Key Insight</p>
          <p className={styles.insightText}>
            Complete the{' '}
            <strong>
              {plannedMissions.length > 0
                ? plannedMissions.join(', ')
                : 'available missions'}
            </strong>{' '}
            to unlock new career opportunities and increase your role
            qualifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillDeltaForecast;
