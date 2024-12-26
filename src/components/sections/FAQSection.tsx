import { Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is PicDeck?",
    answer: "PicDeck is a powerful image resizing service that helps you optimize your images quickly and efficiently."
  },
  {
    question: "How does pricing work?",
    answer: "We offer a free tier with basic features, and Pro/Premium subscriptions for advanced capabilities. Check our pricing section for details."
  },
  {
    question: "What image formats are supported?",
    answer: "PicDeck supports all major image formats including JPG, PNG, and GIF."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard security measures to protect your data and images."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time through your dashboard."
  }
];

export function FAQSection() {
  return (
    <section className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Info className="h-8 w-8 text-primary" />
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">Find answers to common questions about PicDeck</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}