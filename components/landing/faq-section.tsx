"use client";

import JsonLd from "@/components/json-ld";
import { Section } from "@/components/section";

const faqs = [
  {
    question: "What is Mesh Reality?",
    answer: "Mesh Reality is an AI-powered 3D model generation mobile app that allows you to create, customize, and share stunning 3D models with unprecedented ease."
  },
  {
    question: "When will the app be available?",
    answer: "The Mesh Reality app will be available soon on iOS and Google Play. Sign up for our newsletter to be notified when it launches."
  },
  {
    question: "How does the AI-powered generation work?",
    answer: "Our advanced AI technology analyzes your inputs and preferences to generate high-quality 3D models that match your vision. The AI learns from your feedback to improve results over time."
  },
  {
    question: "Can I collaborate with others on 3D projects?",
    answer: "Yes! Mesh Reality includes team collaboration features that allow multiple users to work on shared 3D projects simultaneously."
  },
  {
    question: "Is cloud storage included?",
    answer: "Yes, all your 3D models are securely stored in the cloud, allowing you to access them from anywhere and across devices."
  }
];

export default function FAQSection() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Section id="faq" subtitle="Frequently Asked Questions">
      <JsonLd data={faqJsonLd} />
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
