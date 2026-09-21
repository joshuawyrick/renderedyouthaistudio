
import { supabase } from '@/integrations/supabase/client';

export interface SecurityLogEntry {
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
}

export const logSecurityEvent = async (entry: SecurityLogEntry): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Use generic query since security_logs table might not be in types yet
    const { error } = await (supabase as any)
      .from('security_logs')
      .insert({
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        metadata: entry.metadata,
        user_id: user?.id || null,
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Failed to log security event:', error);
      // Fallback to console logging if database logging fails
    }
  } catch (error) {
    console.error('Security logging error:', error);
    // Fallback to console logging
  }
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 25): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Strips potential XSS vectors while leaving the text the person typed intact -
 * including spaces. Use this for anything cleaned on every keystroke.
 */
export const sanitizeText = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

/** Same as sanitizeText, but also trims. Only use on submit, never while typing. */
export const sanitizeInput = (input: string): string => sanitizeText(input).trim();

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateAge = (dateOfBirth: string): { isValid: boolean; age: number } => {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()) 
    ? age - 1 
    : age;

  return {
    isValid: !isNaN(actualAge) && actualAge >= 0 && actualAge <= 120,
    age: actualAge
  };
};

// Enhanced file validation with magic number checking
export const validateFileMagicNumber = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve(false);
        return;
      }
      
      const arrayBuffer = e.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Check magic numbers for common image formats
      const magicNumbers = {
        jpeg: [0xFF, 0xD8, 0xFF],
        png: [0x89, 0x50, 0x4E, 0x47],
        webp: [0x52, 0x49, 0x46, 0x46], // RIFF header for WebP
        svg: [0x3C, 0x3F, 0x78, 0x6D] // <?xml for SVG
      };
      
      // Check if file starts with any valid magic number
      const isValid = Object.values(magicNumbers).some(magic => 
        magic.every((byte, index) => uint8Array[index] === byte)
      );
      
      resolve(isValid);
    };
    
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 20)); // Read first 20 bytes
  });
};
