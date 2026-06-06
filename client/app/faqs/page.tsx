'use client';

import { useState } from 'react';

const faqs = [
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, American Express, Discover, PayPal, and Apple Pay."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Overnight shipping takes 1-2 business days."
  },
  {
    question: "Can I change or cancel my order?",
    answer: "Orders can be changed or cancelled within 1 hour of placement. Please contact customer service immediately."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of delivery for unworn, unwashed items with original tags attached."
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left p-4 bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
            >
              <span className="font-semibold">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}