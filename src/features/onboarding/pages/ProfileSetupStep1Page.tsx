import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { ONBOARDING_TOTAL_STEPS, MAX_BIO_LENGTH } from '@/shared/constants/app.constants';
import { onboardingStep1Schema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuthStore } from '@/store/authSlice';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Textarea } from '@/shared/components/ui/Textarea';
import { StepperProgress } from '@/features/onboarding/components/StepperProgress';
import { AvatarUploadField } from '@/features/onboarding/components/AvatarUploadField';
import { useUpdateProfile } from '@/features/onboarding/hooks/useUpdateProfile';
import type { z } from 'zod';

type Step1FormValues = z.infer<typeof onboardingStep1Schema>;

export function ProfileSetupStep1Page() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: { fullName: user?.fullName ?? '', bio: user?.bio ?? '' },
  });

  const bio = watch('bio') ?? '';

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(
      { fullName: values.fullName, bio: values.bio, avatarUrl },
      { onSuccess: () => navigate(ROUTES.onboardingInterests) },
    );
  });

  const busy = updateProfile.isPending;

  return (
    <div className="space-y-6">
      <StepperProgress step={1} total={ONBOARDING_TOTAL_STEPS} />

      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">{en.onboarding.step1Heading}</h1>
        <p className="mt-1 text-sm text-text-secondary">{en.onboarding.step1Subheading}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <AvatarUploadField
          value={avatarUrl}
          fullNameForFallback={user?.fullName ?? ''}
          onChange={setAvatarUrl}
        />

        <div className="space-y-1.5">
          <Label htmlFor="fullName">{en.labels.fullName}</Label>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder={en.placeholders.fullName}
            disabled={busy}
            {...register('fullName')}
          />
          {errors.fullName && <p className="text-xs text-error-500">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">{en.labels.bio}</Label>
          <Textarea
            id="bio"
            rows={3}
            placeholder={en.placeholders.bio}
            disabled={busy}
            {...register('bio')}
          />
          <p className="text-right text-xs text-text-muted" aria-live="polite">
            {en.onboarding.bioCharCount(bio.length, MAX_BIO_LENGTH)}
          </p>
          {errors.bio && <p className="text-xs text-error-500">{errors.bio.message}</p>}
        </div>

        {updateProfile.isError && (
          <p role="alert" className="text-sm text-error-500">
            {getApiErrorMessage(updateProfile.error)}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {en.actions.next}
        </Button>

        <button
          type="submit"
          disabled={busy}
          className="block w-full text-center text-sm text-text-secondary hover:underline disabled:opacity-50"
        >
          {en.actions.skip}
        </button>
      </form>
    </div>
  );
}
