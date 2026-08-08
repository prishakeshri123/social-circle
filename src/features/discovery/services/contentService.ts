import { apiClient } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/shared/constants/apiEndpoints';
import type {
  AboutContent,
  ContactContent,
  ContactFormPayload,
  ContactFormResponse,
  HowItWorksContent,
  LegalContent,
  LegalPageSlug,
  ServicesContent,
} from '@/types/content.types';

export const contentService = {
  getAbout: () =>
    apiClient.get<{ data: AboutContent }>(API_ENDPOINTS.content.about).then((r) => r.data.data),

  getServices: () =>
    apiClient
      .get<{ data: ServicesContent }>(API_ENDPOINTS.content.services)
      .then((r) => r.data.data),

  getHowItWorks: () =>
    apiClient
      .get<{ data: HowItWorksContent }>(API_ENDPOINTS.content.howItWorks)
      .then((r) => r.data.data),

  getContact: () =>
    apiClient.get<{ data: ContactContent }>(API_ENDPOINTS.content.contact).then((r) => r.data.data),

  getLegal: (slug: LegalPageSlug) =>
    apiClient
      .get<{ data: LegalContent }>(API_ENDPOINTS.content.legal(slug))
      .then((r) => r.data.data),

  submitContactForm: (payload: ContactFormPayload) =>
    apiClient
      .post<ContactFormResponse>(API_ENDPOINTS.content.submitContact, payload)
      .then((r) => r.data),
};
