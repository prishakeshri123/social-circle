import { Progress } from '@/shared/components/ui/Progress';
import { en } from '@/shared/constants/locales/en';

interface StepperProgressProps {
  step: number;
  total: number;
}

export function StepperProgress({ step, total }: StepperProgressProps) {
  const label = en.onboarding.stepProgress(step, total);

  return (
    <div className="space-y-1.5">
      <p className="text-center text-xs font-medium text-text-muted">{label}</p>
      <Progress value={(step / total) * 100} aria-label={label} />
    </div>
  );
}
