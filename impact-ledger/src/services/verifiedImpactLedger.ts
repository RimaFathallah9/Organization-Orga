/**
 * Verified Impact Ledger
 * 
 * Blockchain-inspired or tamper-resistant database that:
 * - Issues non-transferable Verified Impact Tokens
 * - Encodes skill metadata
 * - Stores validation signatures from partner organizations
 * - Prevents duplication and fraud
 * - Includes anomaly detection models
 */

export interface VerifiedImpactToken {
  tokenId: string;
  userId: string;
  missionId: string;
  missionTitle: string;
  issuanceDate: string;
  expirationDate?: string;
  organization: string;
  impactSignalStrength: number; // 0-100
  skillsMastered: string[];
  verificationHash: string; // SHA-256 hash for tamper detection
  organizationSignature: string; // Digital signature from org
  nonTransferable: boolean;
  status: 'active' | 'revoked' | 'expired';
  metadata: Record<string, any>;
}

export interface LedgerEntry {
  blockId: string;
  timestamp: string;
  userId: string;
  action: 'issue' | 'verify' | 'revoke' | 'dispute';
  token: VerifiedImpactToken;
  previousHash: string; // Hash of previous block (chain integrity)
  currentHash: string; // Hash of this block
  signatures: Array<{
    organizationId: string;
    signature: string;
    timestamp: string;
  }>;
}

export interface AnomalyDetectionAlert {
  alertId: string;
  userId: string;
  alertType: 'duplicate_claim' | 'suspicious_pattern' | 'verification_mismatch' | 'token_manipulation';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
  action: 'flag' | 'block' | 'investigate';
}

/**
 * Issue a non-transferable Verified Impact Token
 * Creates a ledger entry with cryptographic verification
 */
export function issueVerifiedImpactToken(
  userId: string,
  missionData: {
    id: string;
    title: string;
    organization: string;
    skillsMastered: string[];
    impactSignalStrength: number;
  },
  organizationSignature: string,
  metadata: Record<string, any> = {}
): VerifiedImpactToken {
  const now = new Date().toISOString();
  const tokenId = generateTokenId(userId, missionData.id);

  // Create token object (without hash first, to compute it)
  const tokenWithoutHash: any = {
    tokenId,
    userId,
    missionId: missionData.id,
    missionTitle: missionData.title,
    issuanceDate: now,
    expirationDate: null, // Non-transferable tokens don't expire
    organization: missionData.organization,
    impactSignalStrength: missionData.impactSignalStrength,
    skillsMastered: missionData.skillsMastered,
    organizationSignature,
    nonTransferable: true,
    status: 'active',
    metadata,
  };

  // Compute verification hash
  const verificationHash = computeTokenHash(tokenWithoutHash);

  return {
    ...tokenWithoutHash,
    verificationHash,
  };
}

/**
 * Add token to immutable ledger
 * Creates chain integrity by linking to previous block
 */
export function recordLedgerEntry(
  token: VerifiedImpactToken,
  previousBlockHash: string = 'genesis',
  organizationSignatures: Array<{ organizationId: string; signature: string }> = []
): LedgerEntry {
  const blockId = generateBlockId();
  const timestamp = new Date().toISOString();

  // Create block (without hash first)
  const blockWithoutHash: any = {
    blockId,
    timestamp,
    userId: token.userId,
    action: 'issue',
    token,
    previousHash: previousBlockHash,
    signatures: organizationSignatures.map((sig) => ({
      ...sig,
      timestamp,
    })),
  };

  // Compute block hash
  const currentHash = computeBlockHash(blockWithoutHash);

  return {
    ...blockWithoutHash,
    currentHash,
  };
}

/**
 * Verify token authenticity and chain integrity
 */
export function verifyTokenAuthenticity(
  token: VerifiedImpactToken,
  ledgerEntry: LedgerEntry
): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check token hash integrity
  const computedHash = computeTokenHash(token);
  if (computedHash !== token.verificationHash) {
    issues.push('Token has been tampered with. Hash mismatch detected.');
  }

  // Check token status
  if (token.status === 'revoked') {
    issues.push('Token has been revoked.');
  }

  // Check non-transferability (should never be transferred)
  if (!token.nonTransferable) {
    issues.push('Token does not have non-transferable flag.');
  }

  // Verify at least one organization signature
  if (ledgerEntry.signatures.length === 0) {
    issues.push('No organization signatures present.');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Detect duplicate token claims (fraud prevention)
 */
export function detectDuplicateClaims(
  userId: string,
  missionId: string,
  existingTokens: VerifiedImpactToken[]
): AnomalyDetectionAlert | null {
  // Check if user already has token for this mission
  const duplicate = existingTokens.find(
    (token) => token.userId === userId && token.missionId === missionId && token.status === 'active'
  );

  if (duplicate) {
    return {
      alertId: generateAlertId(),
      userId,
      alertType: 'duplicate_claim',
      severity: 'high',
      description: `User attempted to claim the same mission (${missionId}) twice. Duplicate detected.`,
      timestamp: new Date().toISOString(),
      action: 'block',
    };
  }

  return null;
}

/**
 * Detect suspicious patterns in user's token acquisition
 * Flags potential gaming or manipulation
 */
export function detectSuspiciousPatterns(
  userId: string,
  userTokens: VerifiedImpactToken[]
): AnomalyDetectionAlert[] {
  const alerts: AnomalyDetectionAlert[] = [];

  // Check for rapid token acquisition (more than 2 tokens per week)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recentTokens = userTokens.filter((t) => t.issuanceDate > oneWeekAgo && t.status === 'active');

  if (recentTokens.length > 2) {
    alerts.push({
      alertId: generateAlertId(),
      userId,
      alertType: 'suspicious_pattern',
      severity: 'medium',
      description: `User acquired ${recentTokens.length} verified tokens in the past week. Rapid acquisition detected.`,
      timestamp: new Date().toISOString(),
      action: 'investigate',
    });
  }

  // Check for tokens without measurable outcomes (high risk)
  const noOutcomeTokens = userTokens.filter(
    (t) => (!t.metadata.measurableOutcomes || Object.keys(t.metadata.measurableOutcomes).length === 0) &&
      t.status === 'active'
  );

  if (noOutcomeTokens.length > userTokens.length * 0.5) {
    alerts.push({
      alertId: generateAlertId(),
      userId,
      alertType: 'verification_mismatch',
      severity: 'medium',
      description: `More than 50% of user's tokens lack measurable outcomes. Manual review recommended.`,
      timestamp: new Date().toISOString(),
      action: 'investigate',
    });
  }

  // Check for all tokens from same organization (potential collusion)
  const orgs = [...new Set(userTokens.map((t) => t.organization))];
  if (userTokens.length > 3 && orgs.length === 1) {
    alerts.push({
      alertId: generateAlertId(),
      userId,
      alertType: 'suspicious_pattern',
      severity: 'high',
      description: `All user tokens are from a single organization. Possible collusion detected.`,
      timestamp: new Date().toISOString(),
      action: 'investigate',
    });
  }

  return alerts;
}

/**
 * Revoke a token in case of fraud or dispute
 * Records revocation in ledger for audit trail
 */
export function revokeToken(
  token: VerifiedImpactToken,
  reason: string,
  revokerSignature: string
): VerifiedImpactToken {
  const revokedToken = {
    ...token,
    status: 'revoked' as const,
    metadata: {
      ...token.metadata,
      revocationReason: reason,
      revocationDate: new Date().toISOString(),
      revokerSignature,
    },
  };

  // Recompute hash after revocation
  revokedToken.verificationHash = computeTokenHash(revokedToken);

  return revokedToken;
}

/**
 * Query ledger for all tokens issued to a user
 */
export function getUserTokenHistory(
  userId: string,
  ledger: LedgerEntry[]
): VerifiedImpactToken[] {
  return ledger
    .filter((entry) => entry.userId === userId && entry.action === 'issue')
    .map((entry) => entry.token);
}

/**
 * Compute SHA-256-like hash for token (simplified)
 * In production, would use actual crypto library
 */
function computeTokenHash(token: any): string {
  const tokenString = JSON.stringify(token, Object.keys(token).sort());
  return hashString(tokenString);
}

/**
 * Compute SHA-256-like hash for ledger block
 */
function computeBlockHash(block: any): string {
  const blockString = JSON.stringify(block, Object.keys(block).sort());
  return hashString(blockString);
}

/**
 * Simple hash function (in production, use crypto.subtle.digest)
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Generate unique token ID
 */
function generateTokenId(userId: string, missionId: string): string {
  return `TOKEN-${userId.slice(0, 6)}-${missionId.slice(0, 6)}-${Date.now()}`;
}

/**
 * Generate unique block ID
 */
function generateBlockId(): string {
  return `BLOCK-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate unique alert ID
 */
function generateAlertId(): string {
  return `ALERT-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Verify chain integrity of entire ledger
 */
export function verifyLedgerIntegrity(ledger: LedgerEntry[]): {
  isIntact: boolean;
  brokenLinks: string[];
} {
  const brokenLinks: string[] = [];

  for (let i = 1; i < ledger.length; i++) {
    const currentBlock = ledger[i];
    const previousBlock = ledger[i - 1];

    if (currentBlock.previousHash !== previousBlock.currentHash) {
      brokenLinks.push(
        `Chain broken between block ${i - 1} and ${i}: Expected ${previousBlock.currentHash}, got ${currentBlock.previousHash}`
      );
    }

    // Verify current block's hash
    const computedHash = computeBlockHash(currentBlock);
    if (computedHash !== currentBlock.currentHash) {
      brokenLinks.push(`Block ${i} hash mismatch. Potential tampering detected.`);
    }
  }

  return {
    isIntact: brokenLinks.length === 0,
    brokenLinks,
  };
}
