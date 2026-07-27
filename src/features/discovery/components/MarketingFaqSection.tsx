import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/Accordion';
import { en } from '@/shared/constants/locales/en';
import { Reveal } from '@/shared/components/ui/Reveal';
import { Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export function MarketingFaqSection() {
  return (
    <section id="faqs" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wider text-primary-600">
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-text-primary">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
            Find answers to the most common questions about joining, creating, and managing
            communities on Social Circle.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left illustration + support */}
          <div className="flex flex-col items-center lg:items-start gap-0">
            <div className="w-full max-w-sm">
              {/* Illustration (simplified vector) */}
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-white p-8">
                <svg viewBox="0 0 240 180" className="w-full h-auto" aria-hidden="true">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                      <stop offset="0%" stopColor="#EDE9FE" />
                      <stop offset="100%" stopColor="#F3E8FF" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="240" height="180" rx="16" fill="url(#g1)" />
                  <circle cx="60" cy="60" r="20" fill="#7C3AED" />
                  <circle cx="100" cy="40" r="16" fill="#6D28D9" />
                  <circle cx="140" cy="60" r="14" fill="#8B5CF6" />
                  <path
                    d="M100 110c20-18 60-18 80 0"
                    stroke="#C7B3FF"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <text
                    x="120"
                    y="40"
                    fontSize="52"
                    textAnchor="middle"
                    fill="#6D28D9"
                    opacity="0.12"
                  >
                    ?
                  </text>
                </svg>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <Headphones className="size-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-text-primary">
                    Still have questions?
                  </h4>
                  <p className="mt-2 text-sm text-text-secondary">
                    Can't find what you're looking for? Our support team is here to help you 24/7
                    with clubs, memberships, events and payments.
                  </p>
                  <div className="mt-4">
                    <Link
                      to={ROUTES.contact}
                      className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Accordion list */}
          <div className="lg:col-span-2">
            <Reveal className="rounded-2xl border border-border bg-surface px-6 py-6">
              <div className="space-y-4">
                <Accordion type="single" collapsible>
                  {en.marketing.faqs.map((faq, index) => {
                    const number = String(index + 1).padStart(2, '0');
                    return (
                      <AccordionItem
                        key={index}
                        value={`marketing-faq-${index}`}
                        className="border-0"
                      >
                        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                          <AccordionTrigger className="px-6 py-4">
                            <div className="flex items-center gap-4 w-full">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-50 text-primary-600 font-semibold">
                                {number}
                              </div>
                              <div className="flex-1 text-left font-medium">{faq.question}</div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="bg-purple-50 border-l-4 border-primary-500 px-6 py-4">
                            <p className="text-text-secondary">{faq.answer}</p>
                          </AccordionContent>
                        </div>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
