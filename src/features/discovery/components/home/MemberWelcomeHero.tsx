import { en } from '@/shared/constants/locales/en';
import clubGroupIllustration from '@/assets/images/club-group.svg';

interface MemberWelcomeHeroProps {
  fullName: string;
}

export function MemberWelcomeHero({ fullName }: MemberWelcomeHeroProps) {
  const firstName = fullName.split(' ')[0] ?? fullName;

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 px-6 py-8 sm:px-8">
      <div className="max-w-md">
        <p className="text-sm font-medium text-text-secondary">{en.home.welcomeBack}</p>
        <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold text-text-primary">
          {firstName} <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{en.home.welcomeSubtitle}</p>
      </div>

      <img
        src={clubGroupIllustration}
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -right-6 bottom-0 hidden h-40 w-40 object-contain sm:block md:h-48 md:w-48"
      />
    </section>
  );
}
