import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarSearch, Newspaper, HelpCircle, Info, Mail, LayoutDashboard, ShieldCheck, LogOut, LogIn, Ticket } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { showToast } from '../lib/toast.js';

const links = [
  { id: 'home', text: 'Home', icon: Home, path: '/' },
  { id: 'events', text: 'Events', icon: CalendarSearch, path: '/events' },
  { id: 'news', text: 'News', icon: Newspaper, path: '/news' },
  { id: 'faq', text: 'FAQ', icon: HelpCircle, path: '/faq' },
  { id: 'about', text: 'About', icon: Info, path: '/about' },
  { id: 'contact', text: 'Contact', icon: Mail, path: '/contact' },
];

export default function Sidebar() {
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuthStore();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.');
  };

  return (
    <nav className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-3 space-y-2">
      {links.map(({ id, text, icon: Icon, path }) => (
        <Link key={id} to={path} className={`sidebar-link ${isActive(path) ? 'active' : ''}`}>
          <Icon className="w-5 h-5" />
          <span>{text}</span>
        </Link>
      ))}

      {isLoggedIn && (
        <>
          <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/dashboard/tickets" className={`sidebar-link ${isActive('/dashboard/tickets') ? 'active' : ''}`}>
            <Ticket className="w-5 h-5" />
            <span>My Tickets</span>
          </Link>
        </>
      )}

      {user && (user.role === 'ADMIN' || user.role === 'ORGANIZER') && (
        <Link to="/admin" className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}>
          <ShieldCheck className="w-5 h-5" />
          <span>Admin</span>
        </Link>
      )}

      <hr className="border-gray-800 my-2" />

      {isLoggedIn ? (
        <button onClick={handleLogout} className="sidebar-link w-full"><LogOut className="w-5 h-5" /><span>Logout</span></button>
      ) : (
        <Link to="/login" className={`sidebar-link ${isActive('/login') ? 'active' : ''}`}><LogIn className="w-5 h-5" /><span>Login / Sign Up</span></Link>
      )}
    </nav>
  );
}
