/**
 * AI-Powered Evaluation Service
 * Uses simulated AI models to validate, score, and recommend improvements
 * for form submissions, skill matching, and mission compatibility
 */

export interface EvaluationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  recommendations: string[];
  severity: 'error' | 'warning' | 'info';
}

export interface UserProfile {
  email: string;
  password: string;
  name: string;
  location: string;
  userType: 'student' | 'organization';
}

export interface MissionMatch {
  missionId: string;
  userSkills: string[];
  requiredSkills: string[];
  skillGaps: string[];
  matchScore: number;
  developmentPath: string;
}

/**
 * Validates email format and checks for common issues
 */
export const validateEmail = (email: string): EvaluationResult => {
  const feedback: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    feedback.push('Invalid email format');
    score -= 30;
  }

  // Check for disposable email domains (simulation)
  const disposableDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  if (disposableDomains.some(domain => email.toLowerCase().includes(domain))) {
    feedback.push('Disposable email address detected - use a permanent email');
    score -= 20;
    recommendations.push('Use a personal or organizational email address');
  }

  // Check email length
  if (email.length > 254) {
    feedback.push('Email address is too long');
    score -= 15;
  }

  return {
    isValid: score >= 70,
    score: Math.max(0, score),
    feedback,
    recommendations,
    severity: score >= 70 ? 'info' : 'error'
  };
};

/**
 * Evaluates password strength using NIST guidelines
 */
export const evaluatePasswordStrength = (password: string): EvaluationResult => {
  const feedback: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // Length scoring (NIST recommends 12+ characters for high security)
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  else if (password.length < 8) feedback.push('Password must be at least 8 characters');

  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;
  else feedback.push('Add special characters for higher security');

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    feedback.push('Password contains common patterns');
    score -= 20;
    recommendations.push('Avoid common words and number sequences');
  }

  // Entropy calculation (simplified)
  const charsetSize = (password.match(/[a-z]/) ? 26 : 0) +
                     (password.match(/[A-Z]/) ? 26 : 0) +
                     (password.match(/[0-9]/) ? 10 : 0) +
                     (password.match(/[^a-zA-Z0-9]/) ? 32 : 0);
  
  const entropy = password.length * Math.log2(charsetSize);
  if (entropy < 50) {
    recommendations.push('Increase password complexity for better security');
  }

  return {
    isValid: score >= 60,
    score: Math.min(100, Math.max(0, score)),
    feedback,
    recommendations: score < 80 ? [...recommendations, 'Use a passphrase or longer combination'] : [],
    severity: score >= 70 ? 'info' : score >= 60 ? 'warning' : 'error'
  };
};

/**
 * Validates user profile for signup
 */
export const validateUserProfile = (profile: UserProfile): EvaluationResult => {
  const feedback: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Validate email
  const emailEval = validateEmail(profile.email);
  if (!emailEval.isValid) {
    feedback.push(...emailEval.feedback);
    score -= 30;
  }

  // Validate password
  const passwordEval = evaluatePasswordStrength(profile.password);
  if (!passwordEval.isValid) {
    feedback.push(...passwordEval.feedback);
    score -= 30;
  } else if (passwordEval.score < 70) {
    recommendations.push(...passwordEval.recommendations);
  }

  // Validate name
  if (!profile.name || profile.name.trim().length < 2) {
    feedback.push('Name must be at least 2 characters');
    score -= 20;
  }

  if (profile.name && profile.name.match(/[0-9]{3,}/)) {
    feedback.push('Name contains too many consecutive numbers');
    recommendations.push('Use a realistic name');
  }

  // Validate location
  if (!profile.location || profile.location.trim().length < 2) {
    feedback.push('Location is required');
    score -= 15;
  }

  return {
    isValid: score >= 65,
    score: Math.max(0, score),
    feedback,
    recommendations,
    severity: score >= 70 ? 'info' : score >= 60 ? 'warning' : 'error'
  };
};

/**
 * AI-powered skill matching algorithm
 * Evaluates compatibility between user skills and mission requirements
 */
export const calculateMissionMatch = (
  userSkills: string[],
  requiredSkills: string[],
  userLocation: string,
  missionLocation: string,
  userXP: number
): MissionMatch => {
  const skillGaps: string[] = [];
  let matchScore = 0;

  // Skill matching (40% weight)
  const skillMatches = requiredSkills.filter(req =>
    userSkills.some(user => user.toLowerCase().includes(req.toLowerCase()))
  );
  const skillMatchPercentage = (skillMatches.length / Math.max(1, requiredSkills.length)) * 100;
  matchScore += skillMatchPercentage * 0.4;

  // Identify skill gaps
  skillGaps.push(
    ...requiredSkills.filter(req =>
      !userSkills.some(user => user.toLowerCase().includes(req.toLowerCase()))
    )
  );

  // Location preference (20% weight)
  const locationMatch = userLocation.toLowerCase() === missionLocation.toLowerCase();
  if (locationMatch) matchScore += 20;
  else if (missionLocation.toLowerCase() === 'remote') matchScore += 15;

  // Experience level bonus (10% weight)
  if (userXP > 1000) matchScore += 10;
  else if (userXP > 500) matchScore += 5;

  // Growth potential bonus (30% weight - prioritize missions that fill skill gaps)
  if (skillGaps.length > 0 && skillGaps.length <= 3) {
    matchScore += 20; // High potential to grow with focused gaps
  } else if (skillGaps.length === 0) {
    matchScore += 10; // Maintenance mission
  }

  // Generate development path
  let developmentPath = '';
  if (skillGaps.length > 0) {
    developmentPath = `Master ${skillGaps.slice(0, 2).join(' and ')} to advance your career`;
  } else {
    developmentPath = 'Leveraging your existing skills for impact';
  }

  return {
    missionId: '',
    userSkills,
    requiredSkills,
    skillGaps,
    matchScore: Math.round(Math.min(100, Math.max(0, matchScore))),
    developmentPath
  };
};

/**
 * Generates personalized recommendations for mission applications
 */
export const generateMissionRecommendations = (
  matchScore: number,
  skillGaps: string[]
): string[] => {
  const recommendations: string[] = [];

  if (matchScore >= 85) {
    recommendations.push('✨ Excellent match! This mission aligns perfectly with your profile');
    recommendations.push('⚡ This is a great opportunity to earn XP and verified impact tokens');
  } else if (matchScore >= 70) {
    recommendations.push('🎯 Good match! You have most required skills');
    recommendations.push('📚 This mission will help you develop new competencies');
  } else if (matchScore >= 50) {
    recommendations.push('💪 Growth opportunity! Consider this if you want a challenge');
    recommendations.push('🚀 Completing this mission will significantly boost your skill gaps');
  } else {
    recommendations.push('💡 Consider building these skills first:', skillGaps.join(', '));
  }

  return recommendations;
};

/**
 * Evaluates form submission quality
 */
export const evaluateFormQuality = (formData: Record<string, any>): EvaluationResult => {
  const feedback: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check for empty fields
  const emptyFields = Object.entries(formData)
    .filter(([_, value]) => !value || (typeof value === 'string' && value.trim() === ''))
    .map(([key, _]) => key);

  if (emptyFields.length > 0) {
    feedback.push(`Missing required fields: ${emptyFields.join(', ')}`);
    score -= emptyFields.length * 15;
  }

  // Check data validation
  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (value.length < 2) {
        feedback.push(`${key} is too short`);
        score -= 10;
      }
      if (value.match(/^\d+$/)) {
        feedback.push(`${key} should not be only numbers`);
        score -= 5;
        recommendations.push(`Review the content of ${key}`);
      }
    }
  });

  return {
    isValid: score >= 70,
    score: Math.max(0, score),
    feedback,
    recommendations,
    severity: score >= 70 ? 'info' : 'warning'
  };
};

/**
 * Real-time validation orchestrator
 */
export const performRealTimeValidation = (field: string, value: string): EvaluationResult => {
  switch (field) {
    case 'email':
      return validateEmail(value);
    case 'password':
      return evaluatePasswordStrength(value);
    default:
      return { isValid: true, score: 100, feedback: [], recommendations: [], severity: 'info' };
  }
};
