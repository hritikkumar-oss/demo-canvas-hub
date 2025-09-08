import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  onResend: () => Promise<void>;
  disabled?: boolean;
}

export const OtpForm = ({ email, onVerify, onBack, onResend, disabled }: OtpFormProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');

  // Cooldown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a complete 6-digit code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await onVerify(otp);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await onResend();
      setResendCooldown(60); // 60 second cooldown
      setOtp(''); // Clear current OTP
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Check your email
        </h3>
        <p className="text-sm text-gray-600">
          We sent a verification code to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError('');
            }}
            disabled={loading || disabled}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleVerify}
          className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
          disabled={loading || otp.length !== 6 || disabled}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>

        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full h-12 text-gray-600 hover:text-gray-800"
          disabled={loading || disabled}
        >
          ← Back to email
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          {resendCooldown > 0 ? (
            <span className="text-gray-400">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading || disabled}
              className="text-blue-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend'}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};