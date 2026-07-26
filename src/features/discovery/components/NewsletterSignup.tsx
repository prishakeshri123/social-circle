import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { en } from '@/shared/constants/locales/en';
import { emailSchema } from '@/shared/utils/validators';
import { toast } from '@/shared/components/ui/Toast';
import { Reveal } from '@/shared/components/ui/Reveal';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setEmail('');
    toast.success(en.marketing.newsletterSuccess);
  }

  return (
    <Reveal className="marketing-dark relative overflow-hidden rounded-3xl bg-background px-6 py-20 text-center">
      <div className="dotted-map pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-4xl">
          <span className="gradient-text">{en.marketing.newsletterTitle}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary sm:text-base">
          {en.marketing.newsletterSubtitle}
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-7 flex max-w-sm flex-col gap-2 sm:flex-row"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={en.marketing.newsletterPlaceholder}
            aria-label={en.marketing.newsletterPlaceholder}
            className="rounded-full border-border-strong bg-surface text-center sm:text-left"
          />
          <Button
            type="submit"
            className="rounded-full bg-white px-6 text-neutral-900 hover:bg-neutral-200"
          >
            {en.marketing.newsletterCta}
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-error-500">{error}</p>}
      </div>
    </Reveal>
  );
}
