import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import type { SocialProvider } from '@/types/auth.types';
import { AppleIcon, FacebookIcon, GoogleIcon } from '@/features/auth/components/SocialIcons';

const PROVIDERS: {
  provider: SocialProvider;
  label: string;
  fullLabel: string;
  icon: ReactNode;
}[] = [
  {
    provider: 'google',
    label: en.auth.google,
    fullLabel: en.auth.continueWithGoogle,
    icon: <GoogleIcon />,
  },
  {
    provider: 'facebook',
    label: en.auth.facebook,
    fullLabel: en.auth.continueWithFacebook,
    icon: <FacebookIcon />,
  },
  {
    provider: 'apple',
    label: en.auth.apple,
    fullLabel: en.auth.continueWithApple,
    icon: <AppleIcon />,
  },
];

interface SocialLoginButtonsProps {
  onSelect: (provider: SocialProvider) => void;
  disabled?: boolean;
}

export function SocialLoginButtons({ onSelect, disabled }: SocialLoginButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PROVIDERS.map(({ provider, label, fullLabel, icon }) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          aria-label={fullLabel}
          disabled={disabled}
          onClick={() => onSelect(provider)}
          className="flex min-w-0 items-center justify-center px-3"
        >
          <span className="flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="flex shrink-0 items-center justify-center">{icon}</span>
            <span className="leading-none">{label}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}
