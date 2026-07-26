import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/Accordion';
import { en } from '@/shared/constants/locales/en';
import { Reveal } from '@/shared/components/ui/Reveal';

export function MarketingFaqSection() {
  return (
    <section className="space-y-6 py-8">
      <h2 className="text-center text-2xl font-semibold text-text-primary sm:text-3xl">
        {en.marketing.faqTitle}
      </h2>
      <Reveal className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface px-6">
        <Accordion type="single" collapsible>
          {en.marketing.faqs.map((faq, index) => (
            <AccordionItem key={index} value={`marketing-faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
