import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import EventCard from '../components/EventCard.jsx';
import { fetchFeaturedEvents } from '../lib/api.js';

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => { (async () => setFeaturedEvents(await fetchFeaturedEvents(3)))(); }, []);

  return (
    <section id="page-home">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 min-h-[60vh]">
        <div className="md:w-1/2 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Experience <span className="text-emerald-400">Campus Life</span>
            <br />Like Never Before with <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400">EventNest</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">Discover, join, and manage all your college events in one place.</p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link to="/events" className="btn btn-primary text-lg"><Search className="inline-block mr-2 w-5 h-5" />Discover Events</Link>
          </div>
        </div>
        <div className="md:w-1/2 relative h-80 md:h-[420px] flex items-center justify-center">
          <div className="abstract-graphic">
            <div className="graphic-element"></div>
            <div className="graphic-element"></div>
            <div className="graphic-element"></div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredEvents.length > 0 ? (
            featuredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="text-center col-span-3 text-gray-400">No featured events right now. Check back soon!</p>
          )}
        </div>
      </div>
    </section>
  );
}
