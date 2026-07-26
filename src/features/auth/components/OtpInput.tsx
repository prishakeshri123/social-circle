import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { OTP_LENGTH } from '@/shared/constants/app.constants';
import { en } from '@/shared/constants/locales/en';
import { cn } from '@/shared/utils/cn';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  error,
  autoFocus,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? '');

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus();
  }, [autoFocus]);

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    const nextValue = next.join('');
    onChange(nextValue);
    if (nextValue.length === OTP_LENGTH && !nextValue.includes('')) {
      onComplete?.(nextValue);
    }
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, '');
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted.padEnd(OTP_LENGTH, '').slice(0, OTP_LENGTH).trimEnd());
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
    if (pasted.length === OTP_LENGTH) onComplete?.(pasted);
  }

  return (
    <div className={cn('flex justify-between gap-2', error && 'animate-shake')}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={en.auth.otpDigitLabel(index + 1)}
          className={cn(
            'h-12 w-10 rounded-md border text-center text-lg font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-error-500 bg-error-100' : 'border-border-strong bg-background',
          )}
        />
      ))}
    </div>
  );
}
