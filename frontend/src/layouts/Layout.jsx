import React from 'react';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Footer from '../components/Footer.jsx';
import Toast from '../components/Toast.jsx';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 antialiased">
      <Header />
      <div className="container mx-auto px-6 py-8 md:flex md:gap-8">
        <aside className="hidden md:block md:w-60 md:shrink-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toast />
    </div>
  );
}
