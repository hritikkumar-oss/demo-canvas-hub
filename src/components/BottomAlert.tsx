import React, { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomAlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  visible: boolean;
  autoDismiss?: number | false;
  onClose: () => void;
  placement?: 'bottom-center' | 'bottom-left' | 'bottom-right';
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-[hsl(var(--alert-success-bg))]',
    titleColor: 'text-[hsl(var(--alert-success-title))]',
    bodyColor: 'text-[hsl(var(--alert-success-body))]',
    iconColor: 'text-[hsl(var(--alert-success-icon))]',
    role: 'status' as const,
    ariaLive: 'polite' as const,
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-[hsl(var(--alert-error-bg))]',
    titleColor: 'text-[hsl(var(--alert-error-title))]',
    bodyColor: 'text-[hsl(var(--alert-error-body))]',
    iconColor: 'text-[hsl(var(--alert-error-icon))]',
    role: 'alert' as const,
    ariaLive: 'assertive' as const,
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-[hsl(var(--alert-warning-bg))]',
    titleColor: 'text-[hsl(var(--alert-warning-title))]',
    bodyColor: 'text-[hsl(var(--alert-warning-body))]',
    iconColor: 'text-[hsl(var(--alert-warning-icon))]',
    role: 'alert' as const,
    ariaLive: 'assertive' as const,
  },
  info: {
    icon: Info,
    bgColor: 'bg-[hsl(var(--alert-info-bg))]',
    titleColor: 'text-[hsl(var(--alert-info-title))]',
    bodyColor: 'text-[hsl(var(--alert-info-body))]',
    iconColor: 'text-[hsl(var(--alert-info-icon))]',
    role: 'status' as const,
    ariaLive: 'polite' as const,
  },
};

const placementConfig = {
  'bottom-center': 'left-1/2 -translate-x-1/2',
  'bottom-left': 'left-4 sm:left-6',
  'bottom-right': 'right-4 sm:right-6',
};

export const BottomAlert: React.FC<BottomAlertProps> = ({
  variant,
  title,
  message,
  visible,
  autoDismiss = variant === 'success' || variant === 'info' ? 6 : false,
  onClose,
  placement = 'bottom-center',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const alertRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const startTimeRef = useRef<number>();
  const remainingTimeRef = useRef<number>(0);

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 180);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Auto-dismiss logic
  useEffect(() => {
    if (!visible || autoDismiss === false) return;

    const startTimer = (duration: number) => {
      startTimeRef.current = Date.now();
      remainingTimeRef.current = duration;
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);
    };

    startTimer(autoDismiss * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, autoDismiss, onClose]);

  // Pause/resume on hover
  const handleMouseEnter = () => {
    if (autoDismiss === false || !timerRef.current) return;
    
    isPausedRef.current = true;
    const elapsed = Date.now() - (startTimeRef.current || 0);
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    if (autoDismiss === false || !isPausedRef.current) return;
    
    isPausedRef.current = false;
    if (remainingTimeRef.current > 0) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onClose();
      }, remainingTimeRef.current);
    }
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, onClose]);

  // Focus management
  useEffect(() => {
    if (visible && alertRef.current) {
      const focusableElements = alertRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      firstFocusable?.focus();
    }
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 sm:bottom-16 z-50 w-full max-w-[92vw] sm:max-w-md transition-all duration-200',
        placementConfig[placement],
        'px-4 sm:px-0'
      )}
    >
      <div
        ref={alertRef}
        role={config.role}
        aria-live={config.ariaLive}
        aria-atomic="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative rounded-xl p-4 shadow-lg border border-white/50 dark:border-black/10',
          'transition-all duration-200',
          config.bgColor,
          isAnimating 
            ? 'animate-[bottom-alert-enter_240ms_cubic-bezier(0.2,0.9,0.2,1)] opacity-100 translate-y-0' 
            : 'animate-[bottom-alert-exit_180ms_ease-out] opacity-0 translate-y-2'
        )}
        style={{
          boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
        }}
      >
        <div className="flex items-start gap-3">
          {/* Icon Container */}
          <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <IconComponent 
              className={cn('w-5 h-5', config.iconColor)} 
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-semibold text-base leading-tight mb-1',
              config.titleColor
            )}>
              {title}
            </h3>
            <p className={cn(
              'text-sm leading-relaxed line-clamp-3',
              config.bodyColor
            )}>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={cn(
              'flex-shrink-0 w-10 h-10 flex items-center justify-center',
              'rounded-full hover:bg-black/5 dark:hover:bg-white/10',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
              'focus:ring-gray-500 dark:focus:ring-gray-400',
              config.bodyColor
            )}
            aria-label="Close notification"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};