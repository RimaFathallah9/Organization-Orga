import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateUserProfile, evaluatePasswordStrength, validateEmail } from '../services/aiEvaluationService';
import styles from './Signup.module.css';

interface SignupProps {
  onSignupSuccess: () => void;
  onBackToLogin: () => void;
}

type UserType = 'student' | 'organization';

export default function Signup({ onSignupSuccess, onBackToLogin }: SignupProps) {
  const [userType, setUserType] = useState<UserType>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldValidations, setFieldValidations] = useState<Record<string, any>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time AI validation
    if (name === 'email' && value) {
      const validation = validateEmail(value);
      setFieldValidations(prev => ({ ...prev, email: validation }));
    } else if (name === 'password' && value) {
      const validation = evaluatePasswordStrength(value);
      setFieldValidations(prev => ({ ...prev, password: validation }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate with AI service
    const profileEval = validateUserProfile({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      location: formData.location,
      userType
    });

    if (!profileEval.isValid) {
      setError(profileEval.feedback[0] || 'Please fix the errors below');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('❌ Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('❌ Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        location: formData.location,
        organization: formData.organization || 'Unspecified',
        role: userType,
        signupTime: new Date().toISOString(),
        verified: true,
        allocationScore: profileEval.score
      }));
      onSignupSuccess();
      setLoading(false);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className={styles.signupContainer}>
      <motion.div
        className={styles.signupCard}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className={styles.header}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.logo}>🎯</div>
          <h1 className={styles.title}>Join Impact Ledger</h1>
          <p className={styles.subtitle}>Build your civic impact portfolio</p>
        </motion.div>

        {/* User Type Toggle */}
        <motion.div
          className={styles.typeToggle}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            type="button"
            className={`${styles.typeButton} ${userType === 'student' ? styles.active : ''}`}
            onClick={() => setUserType('student')}
          >
            <span className={styles.icon}>👤</span>
            <span>Volunteer/Student</span>
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${userType === 'organization' ? styles.active : ''}`}
            onClick={() => setUserType('organization')}
          >
            <span className={styles.icon}>🏢</span>
            <span>Organization</span>
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Name */}
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="name" className={styles.label}>
              {userType === 'student' ? 'Full Name' : 'Organization Name'}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={userType === 'student' ? 'John Doe' : 'Your Organization'}
              className={styles.input}
              required
            />
          </motion.div>

          {/* Organization Field (only for students) */}
          {userType === 'student' && (
            <motion.div
              className={styles.formGroup}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="organization" className={styles.label}>Organization / Affiliation</label>
              <input
                id="organization"
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="e.g., Tech For Good NGO"
                className={styles.input}
              />
            </motion.div>
          )}

          {/* Location */}
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: userType === 'student' ? 0.3 : 0.25 }}
          >
            <label htmlFor="location" className={styles.label}>Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              className={styles.input}
              required
            />
          </motion.div>

          {/* Email */}
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: userType === 'student' ? 0.35 : 0.3 }}
          >
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className={`${styles.input} ${fieldValidations.email && !fieldValidations.email.isValid ? styles.inputError : ''}`}
              required
            />
            {fieldValidations.email && !fieldValidations.email.isValid && (
              <div className={styles.validationFeedback}>
                {fieldValidations.email.feedback[0]}
              </div>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: userType === 'student' ? 0.4 : 0.35 }}
          >
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="At least 8 characters"
              className={`${styles.input} ${fieldValidations.password && !fieldValidations.password.isValid ? styles.inputError : ''}`}
              required
            />
            {fieldValidations.password && (
              <div className={styles.validationFeedback}>
                {fieldValidations.password.isValid ? '✅ Strong password' : `⚠️ ${fieldValidations.password.feedback[0]}`}
              </div>
            )}
            {fieldValidations.password && fieldValidations.password.score && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar} style={{ width: `${fieldValidations.password.score}%` }}></div>
              </div>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            className={styles.formGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: userType === 'student' ? 0.45 : 0.4 }}
          >
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className={styles.input}
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className={styles.validationFeedback} style={{ color: '#ff6b6b' }}>
                ❌ Passwords do not match
              </div>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className={styles.validationFeedback} style={{ color: '#51cf66' }}>
                ✅ Passwords match
              </div>
            )}
          </motion.div>

          {error && (
            <motion.div
              className={styles.error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {/* Terms Agreement */}
          <motion.div
            className={styles.termsContainer}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: userType === 'student' ? 0.5 : 0.45 }}
          >
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className={styles.checkbox}
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: userType === 'student' ? 0.55 : 0.5 }}
            type="submit"
            disabled={loading || !agreedToTerms}
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: userType === 'student' ? 0.55 : 0.5 }}
        >
          <p>Already have an account? <button className={styles.link} onClick={onBackToLogin}>Sign in</button></p>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.backgroundBlob}
        animate={{
          y: ['0px', '20px', '0px'],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}
