import React from 'react';
import PageHero from '../components/PageHero.jsx';
import { Sparkles, Users, Zap, Calendar } from 'lucide-react'; // Importing icons for visual interest

export default function AboutPage() {
  return (
    <section id="page-about" className="text-white">
      <PageHero
        title="About EventNest: Connecting Campus Life"
        imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="About Us"
      />
      
      {/* Introduction */}
      <div className="max-w-4xl mx-auto text-center py-8">
        <p className="text-xl text-blue-300 font-medium mb-4">
          We're a dedicated team of students, passionate about building a vibrant, connected campus community.
        </p>
        <p className="text-lg text-gray-400">
          EventNest is more than just a platform; it's the digital heartbeat of university life, ensuring no one misses out on the incredible opportunities our campus has to offer.
        </p>
      </div>

      <hr className="border-gray-700 max-w-5xl mx-auto my-10" />

      {/* Core Sections: Mission & Story */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Our Mission */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-shadow duration-300">
          <h2 className="text-3xl font-extrabold mb-4 text-blue-400 flex items-center">
            <Sparkles className="mr-3 h-8 w-8 text-yellow-400" /> Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Our goal is to bridge the organizational gap between student bodies, clubs, and the rest of the campus. We provide powerful, easy-to-use tools for planning, promotion, and registration, maximizing student engagement and simplifying event management from start to finish.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-shadow duration-300">
          <h2 className="text-3xl font-extrabold mb-4 text-blue-400 flex items-center">
            <Calendar className="mr-3 h-8 w-8 text-pink-400" /> Our Story
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            EventNest was born from a late-night dorm-room frustration. After missing several great tech talks and cultural festivals due to scattered announcements, we decided to build a centralized hub. What started as a simple hackathon project is now a robust platform used by thousands of students.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-300">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          
          <div className="p-6 bg-gray-800/50 rounded-lg transform hover:scale-105 transition-transform duration-300">
            <Users className="mx-auto h-10 w-10 text-green-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Community First</h3>
            <p className="text-sm text-gray-400">Everything we build is designed to foster connection and collaboration among students.</p>
          </div>
          
          <div className="p-6 bg-gray-800/50 rounded-lg transform hover:scale-105 transition-transform duration-300">
            <Zap className="mx-auto h-10 w-10 text-red-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Simplicity & Speed</h3>
            <p className="text-sm text-gray-400">Event planning and discovery should be instant and intuitive, not complicated.</p>
          </div>
          
          <div className="p-6 bg-gray-800/50 rounded-lg transform hover:scale-105 transition-transform duration-300">
            <Sparkles className="mx-auto h-10 w-10 text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Transparency</h3>
            <p className="text-sm text-gray-400">Clear communication between organizers and attendees is our highest priority.</p>
          </div>
        </div>
      </div>

      {/* Team Placeholder (Optional) */}
      <div className="max-w-6xl mx-auto text-center mt-20 pb-16">
        <h2 className="text-4xl font-extrabold mb-4 text-blue-300">
          Meet the Team
        </h2>
        <p className="text-lg text-gray-400">
          A small group of Computer Science and Design students dedicated to campus excellence.
        </p>
        {/* Placeholder for team members/photos */}
        <div className="h-40 bg-gray-800/50 rounded-lg mt-8 flex items-center justify-center">
          <p className="text-gray-500 italic">Team Member Profiles/Photos would go here.</p>
        </div>
      </div>
      
    </section>
  );
}