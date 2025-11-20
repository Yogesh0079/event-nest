import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CalendarSearch, Plus, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  return (
    <section className="panel-glass p-8">
      <h2 className="text-3xl font-bold mb-6 text-amber-400"><ShieldCheck className="inline-block w-8 h-8 mr-2" /> Admin Panel</h2>
      <p className="text-lg mb-8">Welcome, {user?.name}. Manage campus events and users.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/events/new" className="admin-card"><Plus className="w-12 h-12 mb-4" /><h3 className="text-xl font-semibold">Create New Event</h3></Link>
        <Link to="/admin/events" className="admin-card"><CalendarSearch className="w-12 h-12 mb-4" /><h3 className="text-xl font-semibold">Manage My Events</h3></Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin/users" className="admin-card"><Users className="w-12 h-12 mb-4" /><h3 className="text-xl font-semibold">Manage Users</h3></Link>
        )}
      </div>
    </section>
  );
}
