import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import type { SocialProvider } from '@/types/auth.types';
import { FacebookIcon, GoogleIcon } from '@/features/auth/components/SocialIcons';

const PROVIDERS: { provider: SocialProvider; label: string; icon: ReactNode }[] = [
  { provider: 'google', label: en.auth.continueWithGoogle, icon: <GoogleIcon /> },
  { provider: 'facebook', label: en.auth.continueWithFacebook, icon: <FacebookIcon /> },
];

interface SocialLoginButtonsProps {
  onSelect: (provider: SocialProvider) => void;
  disabled?: boolean;
}

export function SocialLoginButtons({ onSelect, disabled }: SocialLoginButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map(({ provider, label, icon }) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          className="w-full"
          disabled={disabled}
          onClick={() => onSelect(provider)}
        >
          {icon}
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
