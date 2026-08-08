import type MockAdapter from 'axios-mock-adapter';
import { nanoid } from 'nanoid';
import type {
  AboutContent,
  ContactContent,
  ContactFormPayload,
  HowItWorksContent,
  LegalContent,
  LegalPageSlug,
  ServicesContent,
} from '@/types/content.types';
import contentSeed from '@/mock/data/content.json';

const content = contentSeed as {
  about: AboutContent;
  services: ServicesContent;
  howItWorks: HowItWorksContent;
  contact: ContactContent;
  legal: Record<'terms' | 'privacy' | 'refundPolicy' | 'cookiePolicy', LegalContent>;
};

const LEGAL_SLUG_TO_KEY: Record<LegalPageSlug, keyof typeof content.legal> = {
  terms: 'terms',
  privacy: 'privacy',
  'refund-policy': 'refundPolicy',
  'cookie-policy': 'cookiePolicy',
};

function parseBody<T>(data: unknown): T {
  return (typeof data === 'string' ? JSON.parse(data) : data) as T;
}

export function registerContentHandlers(mock: MockAdapter): void {
  mock.onGet('/content/about').reply(200, { data: content.about });
  mock.onGet('/content/services').reply(200, { data: content.services });
  mock.onGet('/content/how-it-works').reply(200, { data: content.howItWorks });
  mock.onGet('/content/contact').reply(200, { data: content.contact });

  mock.onGet(/\/content\/legal\/.+/).reply((config) => {
    const slug = config.url?.split('/').pop() as LegalPageSlug | undefined;
    const key = slug ? LEGAL_SLUG_TO_KEY[slug] : undefined;
    if (!key)
      return [404, { code: 'NOT_FOUND', message: 'The page you are looking for does not exist.' }];
    return [200, { data: content.legal[key] }];
  });

  mock.onPost('/contact').reply((config) => {
    const body = parseBody<Partial<ContactFormPayload>>(config.data);
    if (!body.fullName || !body.email || !body.subject || !body.message) {
      return [400, { code: 'VALIDATION_ERROR', message: 'All fields are required.' }];
    }
    return [
      200,
      {
        message: "Thanks for reaching out — we'll get back to you within 1 business day.",
        referenceId: `MSG-${nanoid(8).toUpperCase()}`,
      },
    ];
  });
}
