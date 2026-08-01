import { useState } from 'react';
import type { FormEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, User } from 'lucide-react';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import {
  SIGNUP_TOTAL_STEPS,
  SIGNUP_COMMUNITY_SLUGS,
  LS_SIGNUP_SUBMISSION_KEY,
} from '@/shared/constants/app.constants';
import { CATEGORIES } from '@/shared/constants/categories';
import { signupSchema } from '@/shared/utils/validators';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';
import { formatDate } from '@/shared/utils/formatDate';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { DocumentUploadField } from '@/features/auth/components/DocumentUploadField';
import { DocumentPreviewTile } from '@/features/auth/components/DocumentPreviewTile';
import { ReviewSection } from '@/features/auth/components/ReviewSection';
import { AUTH_FEATURES, AuthSplitLayout } from '@/features/auth/components/AuthSplitLayout';
import { NumberedStepper } from '@/features/auth/components/NumberedStepper';
import { useSignup } from '@/features/auth/hooks/useSignup';
import type { z } from 'zod';

type SignupFormValues = z.infer<typeof signupSchema>;
type DocumentKey =
  | 'aadharFile'
  | 'panFile'
  | 'passportFile'
  | 'referenceId1File'
  | 'referenceId2File'
  | 'photoFile'
  | 'familyPhotoFile';

const REQUIRED_DOCUMENT_KEYS: readonly DocumentKey[] = [
  'aadharFile',
  'panFile',
  'referenceId1File',
  'referenceId2File',
  'photoFile',
];

const SIGNUP_STEP_FIELDS: Record<number, readonly (keyof SignupFormValues)[]> = {
  1: ['fullName', 'email', 'phone', 'community'],
  2: ['address', 'dateOfBirth', 'religion', 'nationality', 'residentStatus'],
  3: [
    'fatherName',
    'motherName',
    'occupation',
    'fieldOfOccupation',
    'spouseName',
    'childrenNames',
    'marriageDate',
  ],
  4: ['referenceContact1', 'referenceContact2'],
};

const SIGNUP_STEP_LABELS = [
  en.auth.signupStepShortLabel1,
  en.auth.signupStepShortLabel2,
  en.auth.signupStepShortLabel3,
  en.auth.signupStepShortLabel4,
  en.auth.signupStepShortLabel5,
  en.auth.signupStepShortLabel6,
] as const;

const SIGNUP_COMMUNITY_OPTIONS = CATEGORIES.filter((category) =>
  (SIGNUP_COMMUNITY_SLUGS as readonly string[]).includes(category.slug),
);

// Shared slide/fade motion for every step panel, and a matching hover/press
// scale for every primary/secondary nav button — the two micro-interactions
// that make the wizard feel fluid rather than a flat form swap.
const STEP_MOTION = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};
const OUTLINE_BUTTON_CLASS =
  'w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97]';

function RequiredMark() {
  return (
    <span className="text-error-500" aria-hidden="true">
      {' '}
      *
    </span>
  );
}

function TermsConsentText() {
  return (
    <>
      {en.auth.termsLabelPrefix}{' '}
      <Link to={ROUTES.terms} className="font-medium gradient-text hover:underline">
        {en.marketing.footerLinkTermsOfService}
      </Link>{' '}
      {en.auth.legalConsentAnd}{' '}
      <Link to={ROUTES.privacyPolicy} className="font-medium gradient-text hover:underline">
        {en.marketing.footerLinkPrivacyPolicy}
      </Link>
    </>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signup = useSignup();

  const requestedCommunitySlug = (location.state as { communitySlug?: string } | null)
    ?.communitySlug;
  const prefilledCommunity = SIGNUP_COMMUNITY_OPTIONS.some(
    (option) => option.slug === requestedCommunitySlug,
  )
    ? requestedCommunitySlug
    : '';

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      community: prefilledCommunity,
      address: '',
      dateOfBirth: '',
      religion: '',
      nationality: '',
      residentStatus: '',
      fatherName: '',
      motherName: '',
      occupation: '',
      fieldOfOccupation: '',
      spouseName: '',
      childrenNames: '',
      marriageDate: '',
      referenceContact1: '',
      referenceContact2: '',
      terms: false,
    },
  });

  const [step, setStep] = useState(1);

  const [documents, setDocuments] = useState<Record<DocumentKey, File | null>>({
    aadharFile: null,
    panFile: null,
    passportFile: null,
    referenceId1File: null,
    referenceId2File: null,
    photoFile: null,
    familyPhotoFile: null,
  });
  const [documentErrors, setDocumentErrors] = useState<Partial<Record<DocumentKey, string>>>({});

  const updateDocument = (key: DocumentKey, file: File) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
    setDocumentErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validateDocuments = () => {
    const nextErrors: Partial<Record<DocumentKey, string>> = {};
    for (const key of REQUIRED_DOCUMENT_KEYS) {
      if (!documents[key]) nextErrors[key] = en.errors.fileRequired;
    }
    setDocumentErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToNextStep = async () => {
    if (step === 5) {
      if (validateDocuments()) setStep((current) => current + 1);
      return;
    }
    const fields = SIGNUP_STEP_FIELDS[step];
    const valid = fields ? await trigger(fields) : true;
    if (valid) setStep((current) => current + 1);
  };

  const goToPreviousStep = () => setStep((current) => Math.max(1, current - 1));

  const onSubmit = handleSubmit((values) => {
    const documentMetadata = Object.fromEntries(
      Object.entries(documents).map(([key, file]) => [
        key,
        file ? { name: file.name, size: file.size, type: file.type } : null,
      ]),
    );
    const submissionData = { ...values, documents: documentMetadata };

    console.warn('Signup submission data:', submissionData);
    localStorage.setItem(LS_SIGNUP_SUBMISSION_KEY, JSON.stringify(submissionData));

    signup.mutate(
      { fullName: values.fullName, email: values.email },
      {
        onSuccess: () => {
          const communityLabel = SIGNUP_COMMUNITY_OPTIONS.find(
            (option) => option.slug === values.community,
          )?.label;
          navigate(ROUTES.signupSuccess, { state: { communityLabel } });
        },
      },
    );
  });

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (step < SIGNUP_TOTAL_STEPS) {
      event.preventDefault();
      void goToNextStep();
      return;
    }
    void onSubmit(event);
  };

  const busy = signup.isPending;

  return (
    <AuthSplitLayout
      heading={en.auth.signupWelcomeHeading}
      subtitle={en.auth.signupWelcomeSubtitle}
      features={AUTH_FEATURES}
      cardTitle={en.auth.signupTitle}
      cardWidth="2xl"
      bottomPrompt={
        <>
          {en.auth.alreadyHaveAccount}{' '}
          <Link to={ROUTES.login} className="font-medium gradient-text hover:underline">
            {en.auth.loginLink}
          </Link>
        </>
      }
    >
      <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
        <NumberedStepper steps={SIGNUP_STEP_LABELS} currentStep={step} />

        <motion.div layout className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div key="step-1" {...STEP_MOTION} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {en.auth.signupStep1Heading}
                  </h3>
                  <p className="text-sm text-text-secondary">{en.auth.signupStep1Subheading}</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-sm">
                    {en.labels.fullName}
                    <RequiredMark />
                  </Label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                      aria-hidden="true"
                    />
                    <Input
                      id="fullName"
                      autoComplete="name"
                      placeholder={en.placeholders.fullName}
                      autoFocus
                      disabled={busy}
                      className="pl-9"
                      {...register('fullName')}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-error-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-sm">
                      {en.labels.email}
                      <RequiredMark />
                    </Label>
                    <div className="relative">
                      <Mail
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                        aria-hidden="true"
                      />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder={en.placeholders.email}
                        disabled={busy}
                        className="pl-9"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-error-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-sm">
                      {en.labels.phone}
                      <RequiredMark />
                    </Label>
                    <div className="relative">
                      <Phone
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                        aria-hidden="true"
                      />
                      <Input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder={en.placeholders.phone}
                        disabled={busy}
                        className="pl-9"
                        {...register('phone')}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-error-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="community" className="text-sm">
                    {en.labels.community}
                    <RequiredMark />
                  </Label>
                  <Controller
                    name="community"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={busy}>
                        <SelectTrigger id="community">
                          <SelectValue placeholder={en.placeholders.community} />
                        </SelectTrigger>
                        <SelectContent>
                          {SIGNUP_COMMUNITY_OPTIONS.map((option) => (
                            <SelectItem key={option.slug} value={option.slug}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.community && (
                    <p className="text-xs text-error-500">{errors.community.message}</p>
                  )}
                </div>

                <Button type="button" className="w-full" disabled={busy} onClick={goToNextStep}>
                  {en.auth.signupContinueCta}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step-2" {...STEP_MOTION} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {en.auth.signupStep2Heading}
                  </h3>
                  <p className="text-sm text-text-secondary">{en.auth.signupStep2Subheading}</p>
                  <p className="text-xs text-text-muted">{en.auth.signupOptionalFieldsNote}</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-sm">
                    {en.labels.address}
                  </Label>
                  <Input
                    id="address"
                    autoComplete="street-address"
                    placeholder={en.placeholders.address}
                    disabled={busy}
                    {...register('address')}
                  />
                  {errors.address && (
                    <p className="text-xs text-error-500">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="dateOfBirth" className="text-sm">
                      {en.labels.dateOfBirth}
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      disabled={busy}
                      {...register('dateOfBirth')}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="religion" className="text-sm">
                      {en.labels.religion}
                    </Label>
                    <Input
                      id="religion"
                      placeholder={en.placeholders.religion}
                      disabled={busy}
                      {...register('religion')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="nationality" className="text-sm">
                      {en.labels.nationality}
                    </Label>
                    <Input
                      id="nationality"
                      placeholder={en.placeholders.nationality}
                      disabled={busy}
                      {...register('nationality')}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="residentStatus" className="text-sm">
                      {en.labels.residentStatus}
                    </Label>
                    <Input
                      id="residentStatus"
                      placeholder={en.placeholders.residentStatus}
                      disabled={busy}
                      {...register('residentStatus')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={OUTLINE_BUTTON_CLASS}
                    disabled={busy}
                    onClick={goToPreviousStep}
                  >
                    {en.actions.back}
                  </Button>
                  <Button type="button" className="w-full" disabled={busy} onClick={goToNextStep}>
                    {en.auth.signupContinueCta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step-3" {...STEP_MOTION} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {en.auth.signupStep3Heading}
                  </h3>
                  <p className="text-sm text-text-secondary">{en.auth.signupStep3Subheading}</p>
                  <p className="text-xs text-text-muted">{en.auth.signupOptionalFieldsNote}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="fatherName" className="text-sm">
                      {en.labels.fatherName}
                    </Label>
                    <Input
                      id="fatherName"
                      placeholder={en.placeholders.fatherName}
                      disabled={busy}
                      {...register('fatherName')}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="motherName" className="text-sm">
                      {en.labels.motherName}
                    </Label>
                    <Input
                      id="motherName"
                      placeholder={en.placeholders.motherName}
                      disabled={busy}
                      {...register('motherName')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="occupation" className="text-sm">
                      {en.labels.occupation}
                    </Label>
                    <Input
                      id="occupation"
                      placeholder={en.placeholders.occupation}
                      disabled={busy}
                      {...register('occupation')}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="fieldOfOccupation" className="text-sm">
                      {en.labels.fieldOfOccupation}
                    </Label>
                    <Input
                      id="fieldOfOccupation"
                      placeholder={en.placeholders.fieldOfOccupation}
                      disabled={busy}
                      {...register('fieldOfOccupation')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="spouseName" className="text-sm">
                      {en.labels.spouseName}
                    </Label>
                    <Input
                      id="spouseName"
                      placeholder={en.placeholders.spouseName}
                      disabled={busy}
                      {...register('spouseName')}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="marriageDate" className="text-sm">
                      {en.labels.marriageDate}
                    </Label>
                    <Input
                      id="marriageDate"
                      type="date"
                      disabled={busy}
                      {...register('marriageDate')}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="childrenNames" className="text-sm">
                    {en.labels.childrenNames}
                  </Label>
                  <Input
                    id="childrenNames"
                    placeholder={en.placeholders.childrenNames}
                    disabled={busy}
                    {...register('childrenNames')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={OUTLINE_BUTTON_CLASS}
                    disabled={busy}
                    onClick={goToPreviousStep}
                  >
                    {en.actions.back}
                  </Button>
                  <Button type="button" className="w-full" disabled={busy} onClick={goToNextStep}>
                    {en.auth.signupContinueCta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step-4" {...STEP_MOTION} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {en.auth.signupStep4Heading}
                  </h3>
                  <p className="text-sm text-text-secondary">{en.auth.signupStep4Subheading}</p>
                  <p className="text-xs text-text-muted">{en.auth.signupOptionalFieldsNote}</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="referenceContact1" className="text-sm">
                    {en.labels.referenceContact1}
                  </Label>
                  <Input
                    id="referenceContact1"
                    placeholder={en.placeholders.referenceContact}
                    disabled={busy}
                    {...register('referenceContact1')}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="referenceContact2" className="text-sm">
                    {en.labels.referenceContact2}
                  </Label>
                  <Input
                    id="referenceContact2"
                    placeholder={en.placeholders.referenceContact}
                    disabled={busy}
                    {...register('referenceContact2')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={OUTLINE_BUTTON_CLASS}
                    disabled={busy}
                    onClick={goToPreviousStep}
                  >
                    {en.actions.back}
                  </Button>
                  <Button type="button" className="w-full" disabled={busy} onClick={goToNextStep}>
                    {en.auth.signupContinueCta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step-5" {...STEP_MOTION} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {en.auth.signupStep5Heading}
                  </h3>
                  <p className="text-sm text-text-secondary">{en.auth.signupStep5Subheading}</p>
                </div>

                <DocumentUploadField
                  id="aadharFile"
                  label={en.labels.aadharCard}
                  required
                  file={documents.aadharFile}
                  onChange={(file) => updateDocument('aadharFile', file)}
                  disabled={busy}
                  error={documentErrors.aadharFile}
                />
                <DocumentUploadField
                  id="panFile"
                  label={en.labels.panCard}
                  required
                  file={documents.panFile}
                  onChange={(file) => updateDocument('panFile', file)}
                  disabled={busy}
                  error={documentErrors.panFile}
                />
                <DocumentUploadField
                  id="passportFile"
                  label={en.labels.passport}
                  file={documents.passportFile}
                  onChange={(file) => updateDocument('passportFile', file)}
                  disabled={busy}
                />
                <DocumentUploadField
                  id="referenceId1File"
                  label={en.labels.referenceId1}
                  required
                  file={documents.referenceId1File}
                  onChange={(file) => updateDocument('referenceId1File', file)}
                  disabled={busy}
                  error={documentErrors.referenceId1File}
                />
                <DocumentUploadField
                  id="referenceId2File"
                  label={en.labels.referenceId2}
                  required
                  file={documents.referenceId2File}
                  onChange={(file) => updateDocument('referenceId2File', file)}
                  disabled={busy}
                  error={documentErrors.referenceId2File}
                />
                <DocumentUploadField
                  id="photoFile"
                  label={en.labels.photo}
                  required
                  file={documents.photoFile}
                  onChange={(file) => updateDocument('photoFile', file)}
                  disabled={busy}
                  error={documentErrors.photoFile}
                />
                <DocumentUploadField
                  id="familyPhotoFile"
                  label={en.labels.familyPhoto}
                  file={documents.familyPhotoFile}
                  onChange={(file) => updateDocument('familyPhotoFile', file)}
                  disabled={busy}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={OUTLINE_BUTTON_CLASS}
                    disabled={busy}
                    onClick={goToPreviousStep}
                  >
                    {en.actions.back}
                  </Button>
                  <Button type="button" className="w-full" disabled={busy} onClick={goToNextStep}>
                    {en.auth.signupContinueCta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step-6" {...STEP_MOTION} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {en.auth.signupStep6Heading}
                  </h3>
                  <p className="text-sm text-text-secondary">{en.auth.signupStep6Subheading}</p>
                </div>

                {/* Selected community — the single most important choice, called out above the rest */}
                <div className="gradient-bg rounded-2xl p-4 text-white shadow-[0_0_40px_-12px_var(--color-glow-primary)]">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/75">
                    {en.auth.signupReviewCommunity}
                  </p>
                  <p className="font-display text-lg font-bold">
                    {SIGNUP_COMMUNITY_OPTIONS.find((option) => option.slug === watch('community'))
                      ?.label || en.auth.signupReviewNotProvided}
                  </p>
                </div>

                <ReviewSection
                  title={en.auth.signupStep1Heading}
                  stepNumber={1}
                  onEdit={setStep}
                  rows={[
                    { label: en.auth.signupReviewName, value: watch('fullName') },
                    { label: en.auth.signupReviewEmail, value: watch('email') },
                    { label: en.auth.signupReviewPhone, value: watch('phone') },
                  ]}
                />

                <ReviewSection
                  title={en.auth.signupStep2Heading}
                  stepNumber={2}
                  onEdit={setStep}
                  rows={[
                    { label: en.labels.address, value: watch('address') ?? '' },
                    {
                      label: en.labels.dateOfBirth,
                      value: watch('dateOfBirth') ? formatDate(watch('dateOfBirth')!) : '',
                    },
                    { label: en.labels.religion, value: watch('religion') ?? '' },
                    { label: en.labels.nationality, value: watch('nationality') ?? '' },
                    { label: en.labels.residentStatus, value: watch('residentStatus') ?? '' },
                  ]}
                />

                <ReviewSection
                  title={en.auth.signupStep3Heading}
                  stepNumber={3}
                  onEdit={setStep}
                  rows={[
                    { label: en.labels.fatherName, value: watch('fatherName') ?? '' },
                    { label: en.labels.motherName, value: watch('motherName') ?? '' },
                    { label: en.labels.occupation, value: watch('occupation') ?? '' },
                    { label: en.labels.fieldOfOccupation, value: watch('fieldOfOccupation') ?? '' },
                    { label: en.labels.spouseName, value: watch('spouseName') ?? '' },
                    {
                      label: en.labels.marriageDate,
                      value: watch('marriageDate') ? formatDate(watch('marriageDate')!) : '',
                    },
                    { label: en.labels.childrenNames, value: watch('childrenNames') ?? '' },
                  ]}
                />

                <ReviewSection
                  title={en.auth.signupStep4Heading}
                  stepNumber={4}
                  onEdit={setStep}
                  rows={[
                    {
                      label: en.labels.referenceContact1,
                      value: watch('referenceContact1') ?? '',
                    },
                    {
                      label: en.labels.referenceContact2,
                      value: watch('referenceContact2') ?? '',
                    },
                  ]}
                />

                <ReviewSection title={en.auth.signupStep5Heading} stepNumber={5} onEdit={setStep}>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <DocumentPreviewTile label={en.labels.aadharCard} file={documents.aadharFile} />
                    <DocumentPreviewTile label={en.labels.panCard} file={documents.panFile} />
                    <DocumentPreviewTile label={en.labels.passport} file={documents.passportFile} />
                    <DocumentPreviewTile
                      label={en.labels.referenceId1}
                      file={documents.referenceId1File}
                    />
                    <DocumentPreviewTile
                      label={en.labels.referenceId2}
                      file={documents.referenceId2File}
                    />
                    <DocumentPreviewTile label={en.labels.photo} file={documents.photoFile} />
                    <DocumentPreviewTile
                      label={en.labels.familyPhoto}
                      file={documents.familyPhotoFile}
                    />
                  </div>
                </ReviewSection>

                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <Controller
                      name="terms"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={busy}
                        />
                      )}
                    />
                    <Label htmlFor="terms" className="font-normal">
                      <TermsConsentText />
                    </Label>
                  </div>
                  {errors.terms && <p className="text-xs text-error-500">{errors.terms.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className={OUTLINE_BUTTON_CLASS}
                    disabled={busy}
                    onClick={goToPreviousStep}
                  >
                    {en.actions.back}
                  </Button>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {signup.isPending ? en.auth.signupLoading : en.auth.signupCta}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {step === SIGNUP_TOTAL_STEPS && signup.isError && (
          <p role="alert" className="text-sm text-error-500">
            {getApiErrorMessage(signup.error)}
          </p>
        )}
      </form>
    </AuthSplitLayout>
  );
}
