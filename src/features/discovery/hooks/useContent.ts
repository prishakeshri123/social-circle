import { useMutation, useQuery } from '@tanstack/react-query';
import { contentService } from '@/features/discovery/services/contentService';
import { queryKeys } from '@/shared/constants/queryKeys';
import type { ContactFormPayload, LegalPageSlug } from '@/types/content.types';

export function useAboutContent() {
  return useQuery({
    queryKey: queryKeys.content.about,
    queryFn: contentService.getAbout,
  });
}

export function useServicesContent() {
  return useQuery({
    queryKey: queryKeys.content.services,
    queryFn: contentService.getServices,
  });
}

export function useHowItWorksContent() {
  return useQuery({
    queryKey: queryKeys.content.howItWorks,
    queryFn: contentService.getHowItWorks,
  });
}

export function useContactContent() {
  return useQuery({
    queryKey: queryKeys.content.contact,
    queryFn: contentService.getContact,
  });
}

export function useLegalContent(slug: LegalPageSlug) {
  return useQuery({
    queryKey: queryKeys.content.legal(slug),
    queryFn: () => contentService.getLegal(slug),
  });
}

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: (payload: ContactFormPayload) => contentService.submitContactForm(payload),
  });
}
