import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item panel-glass rounded-xl overflow-hidden">
      <button className="faq-question w-full flex justify-between items-center text-left p-6" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-xl font-semibold">{question}</span>
        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`faq-answer p-6 pt-0 text-gray-300 ${isOpen ? 'block' : 'hidden'}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}
