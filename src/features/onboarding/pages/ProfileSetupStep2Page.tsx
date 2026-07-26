import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { ONBOARDING_TOTAL_STEPS } from '@/shared/constants/app.constants';
import { onboardingStep2Schema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { useAuthStore } from '@/store/authSlice';
import { Button } from '@/shared/components/ui/Button';
import { toast } from '@/shared/components/ui/Toast';
import { StepperProgress } from '@/features/onboarding/components/StepperProgress';
import { InterestChips } from '@/features/onboarding/components/InterestChips';
import { CityAutocomplete } from '@/features/onboarding/components/CityAutocomplete';
import { useUpdateProfile } from '@/features/onboarding/hooks/useUpdateProfile';
import type { z } from 'zod';

type Step2FormValues = z.infer<typeof onboardingStep2Schema>;

export function ProfileSetupStep2Page() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2FormValues>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: { interests: user?.interests ?? [], city: user?.city ?? '' },
  });

  const interests = watch('interests');
  const city = watch('city') ?? '';

  function toggleInterest(slug: string) {
    const next = interests.includes(slug)
      ? interests.filter((i) => i !== slug)
      : [...interests, slug];
    setValue('interests', next, { shouldValidate: true });
  }

  const finishOnboarding = () => {
    navigate(ROUTES.home);
    toast.success(en.onboarding.welcomeBanner(user?.fullName ?? ''));
  };

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(
      { interests: values.interests, city: values.city },
      { onSuccess: finishOnboarding },
    );
  });

  const handleSkip = () => {
    updateProfile.mutate(
      { interests: [], city, profileComplete: true },
      { onSuccess: finishOnboarding },
    );
  };

  const busy = updateProfile.isPending;

  return (
    <div className="space-y-6">
      <StepperProgress step={2} total={ONBOARDING_TOTAL_STEPS} />

      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">{en.onboarding.step2Heading}</h1>
        <p className="mt-1 text-sm text-text-secondary">{en.onboarding.step2Subheading}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="space-y-2">
          <InterestChips selected={interests} onToggle={toggleInterest} />
          <p className="text-center text-xs text-text-muted" aria-live="polite">
            {en.onboarding.interestsSelectedCount(interests.length)}
          </p>
          {errors.interests && (
            <p className="text-center text-xs text-error-500">{errors.interests.message}</p>
          )}
        </div>

        <CityAutocomplete value={city} onChange={(next) => setValue('city', next)} />

        {updateProfile.isError && (
          <p role="alert" className="text-sm text-error-500">
            {getApiErrorMessage(updateProfile.error)}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {en.onboarding.finishSetupCta}
        </Button>

        <button
          type="button"
          onClick={handleSkip}
          disabled={busy}
          className="block w-full text-center text-sm text-text-secondary hover:underline disabled:opacity-50"
        >
          {en.actions.skip}
        </button>
      </form>
    </div>
  );
}
