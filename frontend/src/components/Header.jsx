import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarHeart, LayoutDashboard, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { showToast } from '../lib/toast.js';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    showToast('You have been logged out.');
  };

  return (
    <header className="bg-gray-950/80 backdrop-blur sticky top-0 z-50 w-full border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarHeart className="text-emerald-500" />
          EventNest
        </Link>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/events" className="nav-link">Events</Link>
          <Link to="/news" className="nav-link">News</Link>
          <Link to="/faq" className="nav-link">FAQ</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="btn btn-secondary"><LayoutDashboard className="w-5 h-5 mr-1"/>Dashboard</Link>
          )}
          {user && (user.role === 'ADMIN' || user.role === 'ORGANIZER') && (
            <Link to="/admin" className="btn btn-secondary"><ShieldCheck className="w-5 h-5 mr-1"/>Admin</Link>
          )}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn btn-primary"><LogOut className="w-5 h-5 mr-1"/>Logout</button>
          ) : (
            <Link to="/login" className="btn btn-primary"><LogIn className="w-5 h-5 mr-1"/>Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
