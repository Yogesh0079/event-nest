import React from 'react';
import PageHero from '../components/PageHero.jsx';

export default function NewsPage() {
  return (
    <section id="page-news">
      <PageHero 
        title="News & Announcements" 
        imageUrl="https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
        fallbackText="Campus News" 
      />
      
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">
        The latest updates from around the campus.
      </p>

      <div className="panel-glass p-8 md:p-12 rounded-2xl text-center">
        More news coming soon.
      </div>

      {/* ---- Newly Added Event & Fest Updates (No changes to earlier code) ---- */}
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        
        <div className="panel-glass p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-2">TechFest 2025 – Registrations Open</h3>
          <p className="text-gray-300">The annual college TechFest is scheduled for March 15–17. Events include Hackathon, Robo-Race, CodeSprint, and AI Expo. Students can register online until March 10.</p>
        </div>

        <div className="panel-glass p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-2">Cultural Fest – “Aarohan 2025”</h3>
          <p className="text-gray-300">Get ready for dance battles, singing competitions, drama performances, and fashion show! The cultural fest begins on February 22. Auditions start next week.</p>
        </div>

        <div className="panel-glass p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-2">Sports Week Announced</h3>
          <p className="text-gray-300">The Sports Committee has announced Sports Week from April 5–12. Games include Cricket, Football, Volleyball, Chess, and Athletics. Team registrations open soon.</p>
        </div>

        <div className="panel-glass p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-2">Guest Lecture Series</h3>
          <p className="text-gray-300">Industry experts from Google, TCS, and Infosys will be visiting campus in February for special career and technology sessions. Seats are limited.</p>
        </div>

      </div>
    </section>
  );
}
