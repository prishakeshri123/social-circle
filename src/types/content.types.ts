// Marketing/legal page content, served by the mock "CMS" endpoints under
// /content/*. Icon fields are lucide icon names resolved via getIcon().

export interface IconedItem {
  icon: string;
  title: string;
  body: string;
}

export interface StatItem {
  icon: string;
  value: string;
  label: string;
}

export interface StoryTimelineItem {
  year: string;
  icon: string;
  title: string;
  body: string;
}

export interface AboutContent {
  pageTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2Prefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroHighlight: string;
  heroCardSubtitle: string;
  stats: StatItem[];
  missionEyebrow: string;
  missionTitle: string;
  missionBody: string;
  missionFeatures: IconedItem[];
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string[];
  storyTimeline: StoryTimelineItem[];
  valuesEyebrow: string;
  valuesTitle: string;
  values: IconedItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimaryCta: string;
  ctaSecondaryCta: string;
}

export interface ServicesContent {
  pageTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  services: IconedItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimaryCta: string;
  ctaSecondaryCta: string;
}

export interface HowItWorksContent {
  pageTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroSubtitle: string;
  stats: StatItem[];
  stepsEyebrow: string;
  stepsTitle: string;
  steps: IconedItem[];
  whyEyebrow: string;
  whyTitle: string;
  whyBody: string;
  whyFeatures: IconedItem[];
}

export interface ContactQuickInfoItem {
  icon: string;
  title: string;
  value: string;
}

export interface ContactContent {
  pageTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2Prefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  quickInfo: ContactQuickInfoItem[];
  formTitle: string;
  formSubtitle: string;
  channelsTitle: string;
  channels: IconedItem[];
  officeTitle: string;
  officeAddress: string;
  officeAddressLine2: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

export interface ContactFormPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResponse {
  message: string;
  referenceId: string;
}

export interface LegalSection {
  heading: string;
  icon?: string;
  body?: string[];
  list?: string[];
}

export interface LegalContent {
  pageTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  intro: string;
  calloutText?: string;
  lastUpdatedDate: string;
  sections: LegalSection[];
}

export type LegalPageSlug = 'terms' | 'privacy' | 'refund-policy' | 'cookie-policy';
