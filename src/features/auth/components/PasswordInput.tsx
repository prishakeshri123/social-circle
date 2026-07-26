import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from '@/shared/components/ui/Input';
import { cn } from '@/shared/utils/cn';
import { en } from '@/shared/constants/locales/en';

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
          aria-label={visible ? en.auth.hidePassword : en.auth.showPassword}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
