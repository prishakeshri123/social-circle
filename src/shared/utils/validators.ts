import { z } from 'zod';
import {
  MAX_BIO_LENGTH,
  MAX_CONTACT_SUBJECT_LENGTH,
  MIN_CONTACT_MESSAGE_LENGTH,
  OTP_LENGTH,
  MIN_POLL_OPTIONS,
  MAX_POLL_OPTIONS,
  MAX_CAPTION_LENGTH,
  MAX_ADDRESS_LENGTH,
  MAX_SHORT_FIELD_LENGTH,
  MAX_REFERENCE_CONTACT_LENGTH,
} from '@/shared/constants/app.constants';
import { en } from '@/shared/constants/locales/en';

const e = en.errors;

// ── Primitives ────────────────────────────────────────────
export const emailSchema = z.string().min(1, e.required).email(e.emailInvalid);

// India-only mobile numbers: optional +91/91/0 prefix, then a 10-digit
// number starting 6-9 (the range TRAI allocates to mobile subscribers).
// e.g. 9876543210, +919876543210, 919876543210, 09876543210 are all valid;
// with the +91 prefix the longest valid input is 13 characters.
const INDIA_PHONE_REGEX = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export const indiaPhoneSchema = z
  .string()
  .min(1, e.required)
  .refine((value) => INDIA_PHONE_REGEX.test(value.trim().replace(/[\s-]/g, '')), {
    message: e.indiaPhoneInvalid,
  });

export const emailOrPhoneSchema = z
  .string()
  .min(1, e.required)
  .refine(
    (value) =>
      z.string().email().safeParse(value).success ||
      INDIA_PHONE_REGEX.test(value.trim().replace(/[\s-]/g, '')),
    { message: e.emailOrPhoneInvalid },
  );

export const passwordSchema = z
  .string()
  .min(8, e.passwordMin)
  .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/, e.passwordWeak);

export const urlSchema = z.string().url(e.urlInvalid).optional().or(z.literal(''));

export const otpSchema = z.string().length(OTP_LENGTH, e.otpInvalid).regex(/^\d+$/, e.otpInvalid);

// ── Auth forms ────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailOrPhoneSchema,
  password: z.string().min(1, e.required),
  rememberMe: z.boolean().optional(),
});

export const fullNameSchema = z.string().min(2, e.nameTooShort).max(100, e.nameTooLong);

export const signupSchema = z.object({
  // Step 1 — account & contact
  fullName: fullNameSchema,
  email: emailSchema,
  phone: indiaPhoneSchema,

  // Step 2 — community & personal info
  community: z.string().min(1, e.required),
  address: z.string().max(MAX_ADDRESS_LENGTH).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  religion: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),
  nationality: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),
  residentStatus: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),

  // Step 3 — family & occupation (all optional)
  fatherName: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),
  motherName: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),
  occupation: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),
  fieldOfOccupation: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),
  spouseName: z.string().max(MAX_SHORT_FIELD_LENGTH).optional().or(z.literal('')),
  childrenNames: z.string().max(MAX_ADDRESS_LENGTH).optional().or(z.literal('')),
  marriageDate: z.string().optional().or(z.literal('')),

  // Step 4 — references (optional)
  referenceContact1: z.string().max(MAX_REFERENCE_CONTACT_LENGTH).optional().or(z.literal('')),
  referenceContact2: z.string().max(MAX_REFERENCE_CONTACT_LENGTH).optional().or(z.literal('')),

  // Step 6 — terms
  terms: z.boolean().refine((v) => v === true, { message: e.termsRequired }),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, e.nameTooShort).max(100, e.nameTooLong),
  email: emailSchema,
  subject: z.string().min(1, e.required).max(MAX_CONTACT_SUBJECT_LENGTH),
  message: z.string().min(MIN_CONTACT_MESSAGE_LENGTH, e.messageTooShort),
});

export const forgotPasswordSchema = z.object({
  target: emailOrPhoneSchema,
});

export const resetPasswordSchema = z
  .object({
    otp: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: e.passwordMatch,
    path: ['confirmPassword'],
  });

// ── Profile ───────────────────────────────────────────────
export const profileSchema = z.object({
  fullName: z.string().min(2, e.nameTooShort).max(100, e.nameTooLong),
  bio: z.string().max(MAX_BIO_LENGTH, e.bioTooLong).optional(),
  city: z.string().max(80).optional(),
  websiteUrl: urlSchema,
  interests: z.array(z.string()).min(1, e.atLeastOneInterest),
});

// ── Onboarding (2-step profile setup) ──────────────────────
export const onboardingStep1Schema = z.object({
  fullName: z.string().min(2, e.nameTooShort).max(100, e.nameTooLong),
  bio: z.string().max(MAX_BIO_LENGTH, e.bioTooLong).optional().or(z.literal('')),
});

export const onboardingStep2Schema = z.object({
  interests: z.array(z.string()).min(1, e.atLeastOneInterest),
  city: z.string().max(80).optional().or(z.literal('')),
});

// ── Events ────────────────────────────────────────────────
// Event creation happens entirely in the separate Admin Dashboard. This
// schema covers only the fields the owning member can edit from Event
// Detail (Part 2 S-13) -- ticket pricing/type/quantity, visibility,
// recurrence, and type are set once at creation and not editable here.
export const eventEditSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20),
  coverImageUrl: z.string().optional(),
  startAt: z.string().refine((d) => new Date(d) > new Date(), e.dateMustBeFuture),
  endAt: z.string().optional(),
  timezone: z.string(),
  locationType: z.enum(['physical', 'virtual']),
  physicalAddress: z.string().min(5).optional(),
  virtualLink: urlSchema,
  capacity: z.number().int().min(0).optional(),
  rsvpDeadline: z.string().optional(),
});

// ── Albums ────────────────────────────────────────────────
export const createAlbumSchema = z.object({
  title: z.string().min(3, e.required).max(80),
  description: z.string().optional(),
  visibility: z.enum(['members_only', 'public']),
  allowMemberUploads: z.boolean(),
});

export const mediaCaptionSchema = z.object({
  caption: z.string().max(MAX_CAPTION_LENGTH).optional(),
});

// ── Chat: polls ───────────────────────────────────────────
export const pollCreateSchema = z.object({
  question: z.string().min(3, e.required).max(200),
  options: z
    .array(z.string().min(1, e.required).max(80))
    .min(MIN_POLL_OPTIONS)
    .max(MAX_POLL_OPTIONS),
  allowMultiple: z.boolean(),
});
