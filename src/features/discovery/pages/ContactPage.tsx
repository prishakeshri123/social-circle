import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, LifeBuoy, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import type { z } from 'zod';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Reveal, RevealGroup, RevealItem } from '@/shared/components/ui/Reveal';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { MarketingFooter } from '@/features/discovery/components/MarketingFooter';
import { toast } from '@/shared/components/ui/Toast';
import { useAuth } from '@/shared/hooks/useAuth';
import { useContactContent, useSubmitContactForm } from '@/features/discovery/hooks/useContent';
import { en } from '@/shared/constants/locales/en';
import { contactSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { getIcon } from '@/shared/utils/iconRegistry';
import contactIllustration from '@/assets/images/contact-us.svg';

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const { data, isPending, isError } = useContactContent();
  const submitContact = useSubmitContactForm();

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

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await submitContact.mutateAsync(values);
      setSubmitted(true);
      toast.success(result.message);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  function handleSendAnother() {
    reset();
    setSubmitted(false);
  }

  if (isPending) return <LoadingSpinner className="min-h-[50vh]" />;
  if (isError || !data) return <EmptyState title={en.errors.networkError} />;

  return (
    <PageContainer className="space-y-14">
      <Helmet>
        <title>{data.pageTitle} | Social Circle</title>
        <meta name="description" content={data.metaDescription} />
      </Helmet>

      <section className="grid grid-cols-1 items-center gap-10 py-6 lg:grid-cols-2 lg:gap-16">
        <Reveal className="space-y-5">
          <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600">
            {data.heroEyebrow}
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl">
            {data.heroTitleLine1}
            <br />
            {data.heroTitleLine2Prefix}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              {data.heroTitleHighlight}
            </span>
          </h1>
          <p className="max-w-lg text-base text-text-secondary sm:text-lg">{data.heroSubtitle}</p>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            {data.quickInfo.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <div key={item.title} className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-primary">
                      {item.title}
                    </span>
                    <span className="block text-xs text-text-secondary">{item.value}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="relative mx-auto w-full max-w-md">
          <img
            src={contactIllustration}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="aspect-square w-full rounded-[2rem] bg-primary-50 object-contain p-6 shadow-modal"
          />
          <span className="absolute -left-4 top-8 flex size-11 items-center justify-center rounded-2xl bg-surface text-primary-600 shadow-modal">
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <span className="absolute right-6 -top-4 flex size-11 items-center justify-center rounded-2xl bg-surface text-primary-600 shadow-modal">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
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
                <h2 className="text-xl font-semibold text-text-primary">{data.formTitle}</h2>
                <p className="text-sm text-text-secondary">{data.formSubtitle}</p>
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
                  <Send className="size-4" aria-hidden="true" />
                </Button>
              </form>
            </>
          )}
        </Reveal>

        <div className="space-y-6">
          <RevealGroup className="space-y-2 rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold text-text-primary">{data.channelsTitle}</h3>
            <div className="space-y-4 pt-2">
              {data.channels.map((channel) => {
                const Icon = getIcon(channel.icon);
                return (
                  <RevealItem key={channel.title} className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{channel.title}</p>
                      <p className="text-xs text-text-secondary">{channel.body}</p>
                    </div>
                  </RevealItem>
                );
              })}
            </div>
          </RevealGroup>

          <Reveal className="space-y-3 rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold text-text-primary">{data.officeTitle}</h3>
            <p className="text-xs text-text-secondary">
              {data.officeAddress}
              <br />
              {data.officeAddressLine2}
            </p>
            <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-primary-50">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
                aria-hidden="true"
              />
              <span className="relative flex size-9 items-center justify-center rounded-full bg-primary-600 text-text-inverse shadow-modal">
                <MapPin className="size-4" aria-hidden="true" />
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <section
        className="overflow-hidden rounded-2xl px-6 py-6 text-white sm:px-10"
        style={{ background: 'var(--gradient-brand)' }}
      >
        <Reveal className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <LifeBuoy className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">{data.bannerTitle}</h2>
            <p className="mt-1 text-sm text-white/85">{data.bannerSubtitle}</p>
          </div>
        </Reveal>
      </section>

      {!user && <MarketingFooter />}
    </PageContainer>
  );
}
