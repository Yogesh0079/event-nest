import React from 'react';
import PageHero from '../components/PageHero.jsx';

export default function AboutPage() {
  return (
    <section id="page-about">
      <PageHero title="About EventNest" imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" fallbackText="About Us" />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">We're students, passionate about building community.</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="panel-glass p-8 md:p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300">Bridge the gap between organizers and the student body.</p>
        </div>
        <div className="panel-glass p-8 md:p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-300">Born from a dorm-room idea to never miss great events again.</p>
        </div>
      </div>
    </section>
  );
}
