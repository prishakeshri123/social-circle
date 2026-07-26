import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import type { z } from 'zod';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { toast } from '@/shared/components/ui/Toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { en } from '@/shared/constants/locales/en';
import { contactSchema } from '@/shared/utils/validators';
import { MOCK_API_DELAY_MS } from '@/shared/constants/app.constants';

const iconMap = Icons as unknown as Record<string, LucideIcon>;

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY_MS));
    setSubmitted(true);
    toast.success(en.marketing.contactSuccessTitle);
  });

  function handleSendAnother() {
    reset();
    setSubmitted(false);
  }

  return (
    <PageContainer className="space-y-14">
      <Helmet>
        <title>{en.marketing.contactPageTitle} | Social Circle</title>
        <meta name="description" content={en.marketing.contactMetaDescription} />
      </Helmet>

      <section className="marketing-dark relative overflow-hidden rounded-3xl bg-background px-6 py-20 text-center sm:py-28">
        <Reveal className="relative mx-auto max-w-2xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
            {en.marketing.contactHeroEyebrow}
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {en.marketing.contactHeroTitle}
          </h1>
          <p className="mx-auto max-w-xl text-base text-text-secondary sm:text-lg">
            {en.marketing.contactHeroSubtitle}
          </p>
        </Reveal>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="space-y-3 rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-success-100 text-success-500">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">
                {en.marketing.contactSuccessTitle}
              </h2>
              <p className="max-w-sm text-sm text-text-secondary">
                {en.marketing.contactSuccessBody}
              </p>
              <Button variant="outline" className="mt-2" onClick={handleSendAnother}>
                {en.marketing.contactSuccessCta}
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {en.marketing.contactFormTitle}
                </h2>
                <p className="text-sm text-text-secondary">{en.marketing.contactFormSubtitle}</p>
              </div>

              <form onSubmit={onSubmit} noValidate className="space-y-4 pt-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">{en.labels.fullName}</Label>
                    <Input
                      id="fullName"
                      autoComplete="name"
                      placeholder={en.placeholders.fullName}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      disabled={isSubmitting}
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className="text-xs text-error-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">{en.labels.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder={en.placeholders.email}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      disabled={isSubmitting}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-error-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">{en.labels.subject}</Label>
                  <Input
                    id="subject"
                    placeholder={en.placeholders.subject}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    disabled={isSubmitting}
                    {...register('subject')}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="text-xs text-error-500">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">{en.labels.message}</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder={en.placeholders.contactMessage}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    disabled={isSubmitting}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-error-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? en.marketing.contactSubmitLoading : en.marketing.contactSubmitCta}
                </Button>
              </form>
            </>
          )}
        </Reveal>

        <RevealGroup className="space-y-4">
          {en.marketing.contactChannels.map((channel) => {
            const Icon = iconMap[channel.icon] ?? Icons.Circle;
            return (
              <RevealItem
                key={channel.title}
                className="space-y-2 rounded-2xl border border-border bg-surface p-6"
              >
                <div
                  className="flex size-11 items-center justify-center rounded-xl text-text-inverse"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{channel.title}</h3>
                <p className="text-sm text-text-secondary">{channel.body}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
