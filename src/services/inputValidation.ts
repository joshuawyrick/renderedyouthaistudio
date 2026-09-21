
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Enhanced input validation with security focus
export const validateUserInput = (input: string, options: {
  maxLength?: number;
  minLength?: number;
  allowedChars?: RegExp;
  required?: boolean;
  fieldName?: string;
}): ValidationResult => {
  const errors: string[] = [];
  const { maxLength = 500, minLength = 0, allowedChars, required = false, fieldName = 'Input' } = options;

  if (required && (!input || input.trim().length === 0)) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  if (input && input.length > maxLength) {
    errors.push(`${fieldName} must be ${maxLength} characters or less`);
  }

  if (input && input.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters`);
  }

  if (input && allowedChars && !allowedChars.test(input)) {
    errors.push(`${fieldName} contains invalid characters`);
  }

  // Check for potential XSS patterns
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];

  if (input && xssPatterns.some(pattern => pattern.test(input))) {
    errors.push(`${fieldName} contains potentially dangerous content`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (email.length > 254) {
    errors.push('Email address is too long');
  }

  return { isValid: errors.length === 0, errors };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be 128 characters or less');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger password');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateUsername = (username: string): ValidationResult => {
  return validateUserInput(username, {
    maxLength: 30,
    minLength: 3,
    allowedChars: /^[a-zA-Z0-9_-]+$/,
    required: true,
    fieldName: 'Username'
  });
};

export const validateName = (name: string, fieldName: string): ValidationResult => {
  return validateUserInput(name, {
    maxLength: 50,
    minLength: 1,
    allowedChars: /^[a-zA-Z\s'-]+$/,
    required: true,
    fieldName
  });
};

export const validateBio = (bio: string): ValidationResult => {
  return validateUserInput(bio, {
    maxLength: 500,
    fieldName: 'Bio'
  });
};

export const validateSocialHandle = (handle: string, platform: string): ValidationResult => {
  if (!handle) return { isValid: true, errors: [] };
  
  return validateUserInput(handle, {
    maxLength: 30,
    allowedChars: /^[a-zA-Z0-9._-]+$/,
    fieldName: `${platform} handle`
  });
};
