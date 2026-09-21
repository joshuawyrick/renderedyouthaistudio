
import { logSecurityEvent } from './securityService';

interface RateLimitAttempt {
  timestamp: number;
  ip?: string;
  userId?: string;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

class RateLimitService {
  private attempts: Map<string, RateLimitAttempt[]> = new Map();
  private blocked: Map<string, number> = new Map();

  private configs: Record<string, RateLimitConfig> = {
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 5 attempts per 15 min, block for 30 min
    signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 3 attempts per hour, block for 1 hour
    parentVerification: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 24 * 60 * 60 * 1000 }, // 3 attempts per hour, block for 24 hours
    fileUpload: { maxAttempts: 10, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 10 uploads per hour
    passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }
  };

  private getClientIdentifier(userId?: string): string {
    // Use user ID if available, otherwise use a session-based identifier
    if (userId) return `user:${userId}`;
    
    // Generate a session-based identifier for anonymous users
    let sessionId = sessionStorage.getItem('rl_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('rl_session_id', sessionId);
    }
    return `session:${sessionId}`;
  }

  public async checkRateLimit(action: string, userId?: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    const identifier = this.getClientIdentifier(userId);
    const key = `${action}:${identifier}`;
    const config = this.configs[action];
    
    if (!config) {
      console.warn(`No rate limit config found for action: ${action}`);
      return { allowed: true };
    }

    const now = Date.now();
    
    // Check if currently blocked
    const blockedUntil = this.blocked.get(key);
    if (blockedUntil && now < blockedUntil) {
      const retryAfter = Math.ceil((blockedUntil - now) / 1000);
      
      await logSecurityEvent({
        action: 'RATE_LIMIT_BLOCKED',
        resource_type: 'rate_limit',
        metadata: { 
          limitType: action, 
          retryAfter,
          identifier: userId ? 'user' : 'session'
        }
      });
      
      return { allowed: false, retryAfter };
    }

    // Clean old attempts
    const attempts = this.attempts.get(key) || [];
    const validAttempts = attempts.filter(attempt => now - attempt.timestamp < config.windowMs);
    
    // Check if limit exceeded
    if (validAttempts.length >= config.maxAttempts) {
      // Block the user
      this.blocked.set(key, now + config.blockDurationMs);
      
      await logSecurityEvent({
        action: 'RATE_LIMIT_EXCEEDED',
        resource_type: 'rate_limit',
        metadata: { 
          limitType: action, 
          attempts: validAttempts.length,
          maxAttempts: config.maxAttempts,
          identifier: userId ? 'user' : 'session'
        }
      });
      
      return { allowed: false, retryAfter: Math.ceil(config.blockDurationMs / 1000) };
    }

    return { allowed: true };
  }

  public async recordAttempt(action: string, userId?: string): Promise<void> {
    const identifier = this.getClientIdentifier(userId);
    const key = `${action}:${identifier}`;
    const attempts = this.attempts.get(key) || [];
    
    attempts.push({
      timestamp: Date.now(),
      userId
    });
    
    this.attempts.set(key, attempts);
  }

  public async recordSuccess(action: string, userId?: string): Promise<void> {
    const identifier = this.getClientIdentifier(userId);
    const key = `${action}:${identifier}`;
    
    // Clear attempts and blocks on successful action
    this.attempts.delete(key);
    this.blocked.delete(key);
  }

  // Clean up old data periodically
  public cleanup(): void {
    const now = Date.now();
    
    // Clean expired blocks
    for (const [key, blockedUntil] of this.blocked.entries()) {
      if (now >= blockedUntil) {
        this.blocked.delete(key);
      }
    }
    
    // Clean old attempts
    for (const [key, attempts] of this.attempts.entries()) {
      const action = key.split(':')[0];
      const config = this.configs[action];
      if (config) {
        const validAttempts = attempts.filter(attempt => now - attempt.timestamp < config.windowMs);
        if (validAttempts.length === 0) {
          this.attempts.delete(key);
        } else {
          this.attempts.set(key, validAttempts);
        }
      }
    }
  }
}

export const rateLimitService = new RateLimitService();

// Clean up every 5 minutes
setInterval(() => rateLimitService.cleanup(), 5 * 60 * 1000);
