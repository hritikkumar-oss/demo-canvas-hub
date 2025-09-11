import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface MagicLinkFormProps {
  onSubmit: (email: string) => Promise<void>;
  disabled?: boolean;
}

export const MagicLinkForm = ({ onSubmit, disabled }: MagicLinkFormProps) => {
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; terms?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { email?: string; terms?: string } = {};
    
    if (!email) {
      newErrors.email = 'Work email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Work email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`h-12 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={errors.email ? 'true' : 'false'}
          disabled={loading || disabled}
          autoComplete="email"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            className="mt-1"
            disabled={loading || disabled}
          />
          <Label
            htmlFor="terms"
            className="text-sm text-gray-600 leading-relaxed cursor-pointer"
          >
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-600" role="alert">
            {errors.terms}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
        disabled={loading || disabled}
        aria-describedby={loading ? 'sending-status' : undefined}
      >
        {loading ? (
          <>
            <span className="sr-only" id="sending-status">Sending magic link</span>
            Sending magic link...
          </>
        ) : (
          'Send magic link'
        )}
      </Button>
    </form>
  );
};