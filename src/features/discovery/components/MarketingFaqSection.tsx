import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/Accordion';
import { en } from '@/shared/constants/locales/en';
import { Reveal } from '@/shared/components/ui/Reveal';
import faqIllustration from '@/assets/images/faq.svg';

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
          {/* Left illustration */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-full max-w-sm">
              <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-white p-8">
                <img
                  src={faqIllustration}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>

          {/* Right: Accordion list */}
          <div className="lg:col-span-2">
            <Reveal className="rounded-2xl border border-border bg-surface px-6 py-6">
              <Accordion type="single" collapsible className="space-y-4">
                {en.marketing.faqs.map((faq, index) => {
                  const number = String(index + 1).padStart(2, '0');
                  return (
                    <AccordionItem
                      key={index}
                      value={`marketing-faq-${index}`}
                      className="border-0"
                    >
                      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                        <AccordionTrigger className="px-6 py-5">
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
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
