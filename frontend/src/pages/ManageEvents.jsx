import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trash2, Edit, Users } from 'lucide-react';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/users/me/events');
      setEvents(data || []);
    } catch (error) {
      showToast('Could not load your events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This will remove all registrations and certificates.`)) {
      return;
    }

    try {
      await apiClient.delete(`/events/${eventId}`);
      showToast('Event deleted successfully!');
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete event.');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading your events...</p>;

  return (
    <section id="page-manage-events">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">My Events</h2>
        <Link to="/admin/events/new" className="btn btn-primary">Create New Event</Link>
      </div>

      {events.length === 0 ? (
        <div className="panel-glass p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-2xl font-semibold mb-2">No Events Yet</h3>
          <p className="text-gray-400 mb-6">You haven't created any events yet.</p>
          <Link to="/admin/events/new" className="btn btn-primary">Create Your First Event</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map(event => (
            <div key={event.id} className="panel-glass p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={event.image_url || `https://placehold.co/300x200/1f2937/a3a3a3?text=${event.title.split(' ').join('+')}`}
                  alt={event.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/300x200/1f2937/a3a3a3?text=Image+Not+Found'; }}
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                      <span className="text-sm font-medium text-emerald-400 capitalize">{event.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                      <Users className="w-4 h-4" />
                      <span>{event._count?.registrations || 0} registered</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/admin/events/${event.id}/attendance`} className="btn btn-secondary btn-sm">
                      Manage Attendance
                    </Link>
                    <Link to={`/admin/events/${event.id}/edit`} className="btn btn-secondary btn-sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
