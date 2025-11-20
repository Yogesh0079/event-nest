import React, { useEffect, useState } from 'react';
import { Search, TicketX } from 'lucide-react';
import EventCard from '../components/EventCard.jsx';
import PageHero from '../components/PageHero.jsx';
import { fetchEvents } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const data = await fetchEvents(params);
      setEvents(data);
    } catch {
      showToast('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load({}); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (category !== 'all') params.category = category;
    if (searchTerm) params.search = searchTerm;
    load(params);
  };

  return (
    <section id="page-events">
      <PageHero
        title="All Events"
        imageUrl="https://images.unsplash.com/photo-1519452575417-564c1401ecc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="All Events"
      />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">Browse all the exciting events happening on campus.</p>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center panel-glass p-6 rounded-2xl">
        <div className="relative w-full md:w-1/3">
          <input type="text" placeholder="Search events..." className="form-input pl-12" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        <select className="form-input w-full md:w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="tech">Tech</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="academic">Academic</option>
        </select>
        <button type="submit" className="btn btn-primary w-full md:w-auto">Search</button>
      </form>

      {loading ? (
        <p className="text-center text-lg">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-400 text-lg py-12">
          <TicketX className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-2xl font-semibold mb-2">No Events Found</h3>
          <p>Try adjusting your search terms or category.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </section>
  );
}
