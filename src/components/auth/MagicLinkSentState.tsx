import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

interface MagicLinkSentStateProps {
  email: string;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
}

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 1) return email;
  
  const maskedLocal = localPart[0] + '*'.repeat(Math.max(0, localPart.length - 1));
  return `${maskedLocal}@${domain}`;
};

export const MagicLinkSentState = ({ email, onResend, onChangeEmail }: MagicLinkSentStateProps) => {
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    
    setIsResending(true);
    try {
      await onResend();
      setCooldown(30);
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = maskEmail(email);

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Check your inbox
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          We sent a magic sign-in link to <strong>{maskedEmail}</strong>. 
          Click the link in your email to sign in.
        </p>
        <p className="text-sm text-gray-500">
          Didn't receive it? Check spam or click "Resend magic link".
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          variant="outline"
          className="w-full"
          aria-describedby={cooldown > 0 ? 'resend-cooldown' : undefined}
        >
          {isResending ? (
            'Sending...'
          ) : cooldown > 0 ? (
            <>
              Resend magic link ({cooldown}s)
              <span className="sr-only" id="resend-cooldown">
                Resend available in {cooldown} seconds
              </span>
            </>
          ) : (
            'Resend magic link'
          )}
        </Button>

        <Button
          onClick={onChangeEmail}
          variant="ghost"
          className="w-full text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Change email
        </Button>
      </div>
    </div>
  );
};