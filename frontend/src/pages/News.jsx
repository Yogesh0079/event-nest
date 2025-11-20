import React from 'react';
import PageHero from '../components/PageHero.jsx';

export default function NewsPage() {
  return (
    <section id="page-news">
      <PageHero title="News & Announcements" imageUrl="https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" fallbackText="Campus News" />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">The latest updates from around the campus.</p>
      <div className="panel-glass p-8 md:p-12 rounded-2xl text-center">More news coming soon.</div>
    </section>
  );
}
