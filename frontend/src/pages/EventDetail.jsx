import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, Ticket } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { apiClient, fetchEvent } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function EventDetailPage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const e = await fetchEvent(id);
      if (!e) {
        showToast('Event not found.');
        navigate('/events');
        return;
      }
      setEvent(e);
      setLoading(false);
    })();
  }, [id, navigate]);

  const handleRegister = async () => {
    if (!isLoggedIn) {
      showToast('Please log in to register for events.');
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    try {
      await apiClient.post(`/events/${id}/register`);
      showToast(`Successfully registered for ${event.title}!`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed (demo).');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading event details...</p>;
  if (!event) return null;

  const placeholder = `https://placehold.co/600x300/374151/f3f4f6?text=${event.title.split(' ').join('+')}`;

  return (
    <section className="max-w-4xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <img src={event.image_url || placeholder} alt={event.title} className="w-full h-64 md:h-96 object-cover rounded-lg mb-8" onError={(e) => { e.currentTarget.src = placeholder; }} />

      <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>

      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 text-lg">
        <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-emerald-400" /><span>{new Date(event.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span></div>
        <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400" /><span>{event.location}</span></div>
        <div className="flex items-center gap-2"><Tag className="w-5 h-5 text-emerald-400" /><span className="capitalize">{event.category}</span></div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">About this event</h3>
      <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">{event.description}</p>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
        <Link to="/events" className="btn btn-secondary">Back to Events</Link>
        {user?.role === 'STUDENT' && (
          <button onClick={handleRegister} className="btn btn-primary text-lg"><Ticket className="inline-block mr-2 w-5 h-5" /> Register</button>
        )}
      </div>
    </section>
  );
}
