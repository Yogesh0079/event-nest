import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function EventCard({ event }) {
  return (
    <div className="event-card">
      <img
        src={event.image_url || `https://placehold.co/400x250/1f2937/a3a3a3?text=${event.title.split(' ').join('+')}`}
        alt={event.title}
        className="w-full h-48 object-cover rounded-t-2xl"
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x250/1f2937/a3a3a3?text=Image+Not+Found'; }}
      />
      <div className="p-6">
        <span className="text-sm font-medium text-emerald-400">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <h3 className="text-xl font-semibold my-2 truncate">{event.title}</h3>
        <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden text-ellipsis">
          {event.description.substring(0, 100)}...
        </p>
        <Link to={`/events/${event.id}`} className="font-medium text-amber-400 hover:text-amber-300">
          View Details <ArrowLeft className="inline-block w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}
