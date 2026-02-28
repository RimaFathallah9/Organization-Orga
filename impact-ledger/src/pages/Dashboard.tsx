import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import TunisiaMap from '../components/TunisiaMap';
import styles from './Dashboard.module.css';

const xpData = [
  { month: 'Jan', xp: 120, missions: 2 },
  { month: 'Feb', xp: 180, missions: 3 },
  { month: 'Mar', xp: 150, missions: 2 },
  { month: 'Apr', xp: 220, missions: 4 },
  { month: 'May', xp: 280, missions: 5 },
  { month: 'Jun', xp: 350, missions: 6 }
];

const skillProgress = [
  { name: 'Community Engagement', value: 85 },
  { name: 'Project Management', value: 72 },
  { name: 'Digital Literacy', value: 65 },
  { name: 'Leadership', value: 58 }
];

const impactMetrics = [
  { name: 'Community Served', value: 2450 },
  { name: 'Hours Volunteered', value: 156 },
  { name: 'Skills Unlocked', value: 6 },
  { name: 'Missions Completed', value: 3 }
];

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

export const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <h1 className={styles.title}>Welcome Back, Leo Chen 👋</h1>
          <p className={styles.subtitle}>Here's your civic impact overview for June 2024</p>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        {impactMetrics.map((metric, idx) => (
          <motion.div
            key={metric.name}
            variants={itemVariants}
            className={styles.metricCard}
            whileHover={{ y: -5 }}
          >
            <div className={styles.metricIcon}>
              {idx === 0 && '👥'}
              {idx === 1 && '⏱️'}
              {idx === 2 && '🎓'}
              {idx === 3 && '✅'}
            </div>
            <div className={styles.metricContent}>
              <p className={styles.metricLabel}>{metric.name}</p>
              <p className={styles.metricValue}>{metric.value}</p>
            </div>
            <div className={styles.metricTrend}>↑ 12%</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        {/* XP Progress Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>XP Progress Over Time</h3>
            <span className={styles.period}>Last 6 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={xpData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem'
                }}
              />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorXp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Skills Distribution</h3>
            <span className={styles.period}>Your Proficiency</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={skillProgress}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {skillProgress.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Missions & Skills */}
      <div className={styles.gridSection}>
        {/* Recent Achievements */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recent Achievements 🏆</h3>
          <div className={styles.achievementsList}>
            <div className={styles.achievement}>
              <span className={styles.achievementIcon}>🌟</span>
              <div className={styles.achievementInfo}>
                <p className={styles.achievementTitle}>Community Builder</p>
                <p className={styles.achievementDesc}>Completed 3 community missions</p>
              </div>
            </div>
            <div className={styles.achievement}>
              <span className={styles.achievementIcon}>💡</span>
              <div className={styles.achievementInfo}>
                <p className={styles.achievementTitle}>Digital Innovator</p>
                <p className={styles.achievementDesc}>Mastered digital literacy skills</p>
              </div>
            </div>
            <div className={styles.achievement}>
              <span className={styles.achievementIcon}>🎯</span>
              <div className={styles.achievementInfo}>
                <p className={styles.achievementTitle}>Impact Leader</p>
                <p className={styles.achievementDesc}>Earned 1000+ XP this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Missions */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Recommended for You ✨</h3>
          <div className={styles.missionsList}>
            <div className={styles.missionItem}>
              <div className={styles.missionType}>Local</div>
              <div className={styles.missionDetails}>
                <p className={styles.missionTitle}>Youth Mentorship</p>
                <p className={styles.missionMatch}>89% match</p>
              </div>
              <p className={styles.missionXp}>+150 XP</p>
            </div>
            <div className={styles.missionItem}>
              <div className={styles.missionType}>Hybrid</div>
              <div className={styles.missionDetails}>
                <p className={styles.missionTitle}>Tech Training</p>
                <p className={styles.missionMatch}>76% match</p>
              </div>
              <p className={styles.missionXp}>+120 XP</p>
            </div>
            <div className={styles.missionItem}>
              <div className={styles.missionType}>Remote</div>
              <div className={styles.missionDetails}>
                <p className={styles.missionTitle}>Online Tutoring</p>
                <p className={styles.missionMatch}>85% match</p>
              </div>
              <p className={styles.missionXp}>+160 XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tunisia Map Section */}
      {/* <div className={styles.mapSection}>
        <TunisiaMap />
      </div> */}

      {/* Call to Action */}
      <div className={styles.cta}>
        <h2>Ready to Make an Impact?</h2>
        <p>Explore more opportunities and grow your civic skills</p>
        <button className={styles.ctaButton}>Browse All Missions →</button>
      </div>
    </div>
  );
};
