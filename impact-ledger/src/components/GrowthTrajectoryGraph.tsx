import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import styles from './GrowthTrajectoryGraph.module.css';

interface TrajectoryData {
  date: string;
  overallLevel: number;
  skillsUnlocked: number;
  totalXp: number;
  missionCount: number;
  phase: string; // 'exploration', 'acceleration', 'mastery', 'stagnation'
}

interface GrowthTrajectoryGraphProps {
  data: TrajectoryData[];
  currentPhase: 'exploration' | 'acceleration' | 'mastery' | 'stagnation';
  velocityPerMonth: number;
  consistencyScore: number;
}

export const GrowthTrajectoryGraph: React.FC<GrowthTrajectoryGraphProps> = ({
  data,
  currentPhase,
  velocityPerMonth,
  consistencyScore,
}) => {
  const phaseDisplay = {
    exploration: { icon: '🔍', label: 'Exploration', color: '#3b82f6' },
    acceleration: { icon: '⚡', label: 'Acceleration', color: '#10b981' },
    mastery: { icon: '🏆', label: 'Mastery', color: '#f59e0b' },
    stagnation: { icon: '⏸️', label: 'Stagnation', color: '#ef4444' },
  };

  const phaseInfo = phaseDisplay[currentPhase];

  const CustomTooltip = (props: any) => {
    if (props.active && props.payload) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipDate}>{props.payload[0]?.payload?.date}</p>
          {props.payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>📈 Growth Trajectory</h3>
          <p className={styles.subtitle}>
            Your civic development over time
          </p>
        </div>

        <div className={styles.phaseIndicator}>
          <div className={styles.phaseBadge} style={{ borderLeft: `4px solid ${phaseInfo.color}` }}>
            <span className={styles.phaseIcon}>{phaseInfo.icon}</span>
            <div>
              <p className={styles.phaseLabel}>{phaseInfo.label}</p>
              <p className={styles.phaseDesc}>Current growth phase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Velocity</p>
          <p className={styles.metricValue}>{velocityPerMonth.toFixed(2)}</p>
          <p className={styles.metricUnit}>skills/month</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Consistency</p>
          <p className={styles.metricValue}>{consistencyScore}%</p>
          <p className={styles.metricUnit}>score</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Total Points</p>
          <p className={styles.metricValue}>
            {data.length > 0 ? data[data.length - 1].totalXp : 0}
          </p>
          <p className={styles.metricUnit}>XP earned</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricLabel}>Missions</p>
          <p className={styles.metricValue}>
            {data.length > 0 ? data[data.length - 1].missionCount : 0}
          </p>
          <p className={styles.metricUnit}>completed</p>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(209, 213, 219, 0.2)" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area
              type="monotone"
              dataKey="overallLevel"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorLevel)"
              name="Overall Level"
              isAnimationActive
            />
            <Area
              type="monotone"
              dataKey="skillsUnlocked"
              stroke="#34d399"
              fillOpacity={1}
              fill="url(#colorXp)"
              name="Skills Unlocked"
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Phase Insights */}
      <div className={styles.insights}>
        {currentPhase === 'exploration' && (
          <div className={styles.insightCard}>
            <p className={styles.insightTitle}>🔍 Exploring Your Path</p>
            <p>You're in the exploration phase. Try diverse missions to discover what resonates with you.</p>
          </div>
        )}
        {currentPhase === 'acceleration' && (
          <div className={styles.insightCard}>
            <p className={styles.insightTitle}>⚡ Building Momentum</p>
            <p>Great progress! Your skill growth is accelerating. Keep completing higher-complexity missions.</p>
          </div>
        )}
        {currentPhase === 'mastery' && (
          <div className={styles.insightCard}>
            <p className={styles.insightTitle}>🏆 Mastery Territory</p>
            <p>You've achieved deep expertise. Consider mentoring others or taking on leadership roles.</p>
          </div>
        )}
        {currentPhase === 'stagnation' && (
          <div className={styles.insightCard}>
            <p className={styles.insightTitle}>⏸️ Time to Diversify</p>
            <p>Your growth has plateaued in current areas. Explore new causes or skill categories to reignite progress.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthTrajectoryGraph;
