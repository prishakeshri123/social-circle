import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/Accordion';
import { en } from '@/shared/constants/locales/en';

interface ClubFaqAccordionProps {
  faqs: { question: string; answer: string }[];
}

export function ClubFaqAccordion({ faqs }: ClubFaqAccordionProps) {
  if (faqs.length === 0) return null;

  return (
    <section
      aria-labelledby="club-faqs-heading"
      className="space-y-2 rounded-2xl border border-border bg-surface p-6"
    >
      <h2 id="club-faqs-heading" className="text-lg font-semibold text-text-primary">
        {en.clubLanding.faqsTitle}
      </h2>
      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
