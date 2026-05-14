"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionContainer } from "@/components/section-container";

interface Faq1Props {
  heading: string;
  items: { question: string; answer: string }[];
}

export function Faq1({ heading, items }: Faq1Props) {
  return (
    <SectionContainer>
      <h2 className="mx-auto mb-12 max-w-2xl text-center text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        {heading}
      </h2>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger className="py-5 text-left text-base font-medium text-gray-900 hover:text-gray-700 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionContainer>
  );
}
