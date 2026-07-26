import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { LS_HOME_WELCOME_DISMISSED_KEY } from '@/shared/constants/app.constants';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { scaleIn } from '@/shared/utils/animations';

interface WelcomeBannerProps {
  fullName: string;
}

export function WelcomeBanner({ fullName }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useLocalStorage(LS_HOME_WELCOME_DISMISSED_KEY, false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={scaleIn}
          className="flex items-center justify-between gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3"
        >
          <p className="text-sm font-medium text-primary-700">
            {en.onboarding.welcomeBanner(fullName)}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-primary-700 hover:bg-primary-100"
            aria-label={en.actions.close}
            onClick={() => setDismissed(true)}
          >
            <X className="size-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
