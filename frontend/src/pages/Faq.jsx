import React from 'react';
import PageHero from '../components/PageHero.jsx';
import FaqItem from '../components/FaqItem.jsx';

export default function FaqPage() {
  const faqs = [
    { q: "How do I register for an event?", a: "Login, open the event, and click Register." },
    { q: "Can I see my registrations?", a: "Yes, in the Dashboard under My Registered Events." },
    { q: "Who can create events?", a: "Organizers and Admins." },
    { q: "How do I get a certificate?", a: "Organizer marks attendance and issues certificates." }
  ];
  return (
    <section id="page-faq">
      <PageHero title="How Can We Help?" imageUrl="https://images.unsplash.com/photo-1559863013-5f0d366a7f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" fallbackText="FAQ" />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">Find answers to common questions about EventNest.</p>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((f, i) => <FaqItem key={i} question={f.q} answer={f.a} />)}
      </div>
    </section>
  );
}
