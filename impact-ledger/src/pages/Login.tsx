import { useState } from 'react';
import { motion } from 'framer-motion';
import { validateEmail, evaluatePasswordStrength } from '../services/aiEvaluationService';
import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: () => void;
  onSignupClick?: () => void;
}

export default function Login({ onLoginSuccess, onSignupClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailValidation, setEmailValidation] = useState<any>(null);
  const [passwordValidation, setPasswordValidation] = useState<any>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value) {
      const validation = validateEmail(value);
      setEmailValidation(validation);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      const validation = evaluatePasswordStrength(value);
      setPasswordValidation(validation);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate with AI service
    const emailEval = validateEmail(email);
    const passwordEval = evaluatePasswordStrength(password);

    if (!emailEval.isValid) {
      setError(`Invalid email: ${emailEval.feedback[0]}`);
      return;
    }

    if (!passwordEval.isValid) {
      setError(`Weak password: ${passwordEval.feedback[0]}`);
      return;
    }

    setLoading(true);

    // Simulate login with AI verification
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        role: 'student',
        loginTime: new Date().toISOString(),
        verified: true 
      }));
      onLoginSuccess();
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

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1 + 0.2, duration: 0.4 }
    })
  };

  return (
    <div className={styles.loginContainer}>
      <motion.div
        className={styles.loginCard}
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
          <h1 className={styles.title}>Impact Ledger</h1>
          <p className={styles.subtitle}>Verify your civic impact</p>
        </motion.div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <motion.div
            className={styles.formGroup}
            custom={0}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="your@email.com"
              className={`${styles.input} ${emailValidation && !emailValidation.isValid ? styles.inputError : ''}`}
              required
            />
            {emailValidation && !emailValidation.isValid && (
              <div className={styles.validationFeedback}>
                {emailValidation.feedback[0]}
              </div>
            )}
          </motion.div>

          <motion.div
            className={styles.formGroup}
            custom={1}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
          >
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter your password"
              className={`${styles.input} ${passwordValidation && !passwordValidation.isValid ? styles.inputError : ''}`}
              required
            />
            {passwordValidation && (
              <div className={styles.validationFeedback}>
                {passwordValidation.isValid ? '✅ Strong password' : `⚠️ ${passwordValidation.feedback[0]}`}
              </div>
            )}
            {passwordValidation && passwordValidation.score && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar} style={{ width: `${passwordValidation.score}%` }}></div>
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

          <motion.button
            custom={2}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            type="submit"
            disabled={loading}
            className={styles.submitButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <motion.div
          className={styles.footer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <p>Don't have an account? <button type="button" onClick={onSignupClick} className={styles.link}>Sign up</button></p>
        </motion.div>

        <motion.div
          className={styles.demoHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className={styles.hintText}>Demo: Use any email and password (6+ chars)</p>
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
