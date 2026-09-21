
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityService';

export interface EnhancedSecurityLogEntry {
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  ip_address?: string;
}

export const logEnhancedSecurityEvent = async (entry: EnhancedSecurityLogEntry): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get IP address (in production, this would come from server)
    const ipAddress = entry.ip_address || 'unknown';
    
    // Enhanced logging with severity and additional metadata
    const enhancedEntry = {
      ...entry,
      metadata: {
        ...entry.metadata,
        severity: entry.severity || 'medium',
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      }
    };

    const { error } = await (supabase as any)
      .from('security_logs')
      .insert({
        action: enhancedEntry.action,
        resource_type: enhancedEntry.resource_type,
        resource_id: enhancedEntry.resource_id,
        metadata: enhancedEntry.metadata,
        user_id: user?.id || null,
        ip_address: ipAddress,
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Failed to log enhanced security event:', error);
      // Fallback to basic security logging
      await logSecurityEvent(entry);
    }

    // Critical events should also be sent to monitoring
    if (entry.severity === 'critical') {
      console.error('CRITICAL SECURITY EVENT:', enhancedEntry);
      // In production, this would send to monitoring service
    }
  } catch (error) {
    console.error('Enhanced security logging error:', error);
    // Fallback to basic security logging
    await logSecurityEvent(entry);
  }
};

// Enhanced file validation with virus scanning simulation
export const performAdvancedFileValidation = async (file: File): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  // Basic validations from existing service
  const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Invalid file type');
  }

  if (file.size > 25 * 1024 * 1024) {
    errors.push('File too large');
  }

  // Enhanced validations
  if (file.name.length > 255) {
    errors.push('Filename too long');
  }

  // Check for suspicious file extensions in name
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.js', '.vbs'];
  if (suspiciousExtensions.some(ext => file.name.toLowerCase().includes(ext))) {
    errors.push('Suspicious file extension detected');
  }

  // Simulate virus scanning (in production, integrate with real AV service)
  const simulateVirusScan = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      // Random simulation - in production this would be real scanning
      const isClean = Math.random() > 0.001; // 99.9% clean rate for simulation
      resolve(isClean);
    }, 100);
  });

  const isVirusFree = await simulateVirusScan;
  if (!isVirusFree) {
    errors.push('File failed security scan');
    await logEnhancedSecurityEvent({
      action: 'MALICIOUS_FILE_DETECTED',
      resource_type: 'file',
      severity: 'critical',
      metadata: { filename: file.name, size: file.size, type: file.type }
    });
  }

  return { isValid: errors.length === 0, errors };
};

// Monitor failed authentication attempts
export const monitorAuthFailures = async (email: string, reason: string): Promise<void> => {
  await logEnhancedSecurityEvent({
    action: 'AUTH_FAILURE',
    resource_type: 'authentication',
    severity: 'medium',
    metadata: { 
      email: email.toLowerCase(),
      failure_reason: reason,
      attempts_today: await getFailureCountToday(email)
    }
  });
};

// Get failure count for today (simplified version)
const getFailureCountToday = async (email: string): Promise<number> => {
  // In production, query the security_logs table
  // For now, use localStorage as a simple counter
  const today = new Date().toDateString();
  const key = `auth_failures_${today}_${email}`;
  const count = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, (count + 1).toString());
  return count + 1;
};

// Clean sensitive data from error messages
export const sanitizeErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred';
  
  const message = typeof error === 'string' ? error : error.message || 'Unknown error';
  
  // Remove sensitive information from error messages
  const sensitivePatterns = [
    /user_id:\s*[a-f0-9-]+/gi,
    /email:\s*[^\s]+@[^\s]+/gi,
    /token:\s*[a-zA-Z0-9_-]+/gi,
    /password/gi,
    /authentication/gi
  ];

  let sanitized = message;
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });

  // Generic error messages for common cases
  if (sanitized.toLowerCase().includes('duplicate') || sanitized.toLowerCase().includes('unique')) {
    return 'This information is already in use. Please try different values.';
  }

  if (sanitized.toLowerCase().includes('invalid') && sanitized.toLowerCase().includes('credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }

  if (sanitized.toLowerCase().includes('rate limit')) {
    return 'Too many attempts. Please wait before trying again.';
  }

  return sanitized;
};
