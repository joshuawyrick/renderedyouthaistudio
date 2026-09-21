import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { validateEmail, validatePassword, validateName } from '@/services/inputValidation';
import { sanitizeErrorMessage } from '@/services/enhancedSecurityService';

interface AdultSignupFormProps {
  age: number;
}

const AdultSignupForm = ({ age }: AdultSignupFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { secureSignUp, sanitizeInput } = useSecureAuth();

  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Validate first name
    const firstNameValidation = validateName(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      errors.firstName = firstNameValidation.errors;
    }

    // Validate last name
    const lastNameValidation = validateName(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      errors.lastName = lastNameValidation.errors;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.errors;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ['Passwords do not match'];
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await secureSignUp(
        formData.email.trim(),
        formData.password,
        {
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          account_type: 'creator',
          age_bracket: '18+',
          is_minor: false
        }
      );

      if (error) {
        toast({
          title: "Signup Failed",
          description: sanitizeErrorMessage(error),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome, Creator!",
        description: "Your creator account has been set up. Please check your email for verification.",
      });

      window.location.href = '/creator/dashboard';
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Unexpected Error",
        description: sanitizeErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field]?.[0];
  };

  return (
    <div className="min-h-screen bg-ry-white flex items-center justify-center px-4">
      <RYCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-3xl font-bold text-ry-black mb-2">
            Create Your Creator Account
          </h1>
          <p className="text-gray-600">
            Join our community of talented creators
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ry-black mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                  getFieldError('firstName') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                maxLength={50}
              />
              {getFieldError('firstName') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('firstName')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ry-black mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                  getFieldError('lastName') ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                maxLength={50}
              />
              {getFieldError('lastName') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('lastName')}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ry-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                getFieldError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              maxLength={254}
            />
            {getFieldError('email') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ry-black mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                getFieldError('password') ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              maxLength={128}
            />
            {getFieldError('password') && (
              <div className="text-red-500 text-sm mt-1">
                {validationErrors.password?.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ry-black mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent ${
                getFieldError('confirmPassword') ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              maxLength={128}
            />
            {getFieldError('confirmPassword') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('confirmPassword')}</p>
            )}
          </div>

          <RYButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </RYButton>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Password Requirements:</strong><br />
            • At least 8 characters long<br />
            • Include uppercase and lowercase letters<br />
            • Include at least one number<br />
            • Include at least one special character
          </p>
        </div>
      </RYCard>
    </div>
  );
};

export default AdultSignupForm;
