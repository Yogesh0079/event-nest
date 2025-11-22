import React from 'react';
import PageHero from '../components/PageHero.jsx';
import { Sparkles, Users, Zap, Calendar } from 'lucide-react';

export default function AboutPage() {
  
  const teamMembers = [
    {
      name: 'Arshbir',
      img: 'https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6839.jpg?w=740'
    },
    {
      name: 'Abhay',
      img: 'https://img.freepik.com/premium-photo/3d-avatar-boy-character_914455-603.jpg' 
    },
    {
      name: 'Yogesh',
      img: 'https://img.freepik.com/premium-photo/3d-illustration-cartoon-character-boy_1142-52672.jpg?w=740'
    },
    {
      name: 'Yuvraj',
      img: 'https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6836.jpg?w=740'
    }
  ];

  return (
    <section id="page-about" className="text-white bg-[#0a0f18] pb-16 font-sans">
      <PageHero
        title="About EventNest: Connecting Campus Life"
        imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="About Us"
      />
      
      {/* Introduction */}
      <div className="max-w-4xl mx-auto text-center py-12 px-4">
        <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
          We build digital bridges for the campus community.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed">
          EventNest is more than just a platform; it is the <strong>digital heartbeat</strong> of our university. 
          We ensure that no student ever misses a hackathon, a cultural fest, or a club meet-up again. 
          Built by students, for students.
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-4"></div>

      {/* Core Sections: Mission & Story */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 mt-12">
        {/* Our Mission */}
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-xl hover:border-blue-500/50 transition-all duration-300 group">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center group-hover:text-blue-400 transition-colors">
            <Sparkles className="mr-3 h-6 w-6 text-yellow-400" /> Our Mission
          </h2>
          <p className="text-gray-400 leading-relaxed">
            To bridge the gap between student bodies, clubs, and the students themselves. 
            We provide powerful, easy-to-use tools for planning, promotion, and registration, 
            simplifying event management from start to finish.
          </p>
        </div>
        {/* Our Story */}
        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 p-8 rounded-2xl shadow-xl hover:border-pink-500/50 transition-all duration-300 group">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center group-hover:text-pink-400 transition-colors">
            <Calendar className="mr-3 h-6 w-6 text-pink-400" /> The Origin Story
          </h2>
          <p className="text-gray-400 leading-relaxed">
            EventNest was born from frustration. After missing several great tech talks due to 
            scattered WhatsApp messages, we decided to build a centralized hub. What started as 
            a simple project is now the robust platform you see today.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="max-w-6xl mx-auto mt-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          Our Core Values
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <Users className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Community First</h3>
            <p className="text-sm text-gray-400">Everything we build is designed to foster connection and collaboration.</p>
          </div>
          <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <Zap className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Speed & Simplicity</h3>
            <p className="text-sm text-gray-400">Discovery should be instant. We prioritize intuitive design over complexity.</p>
          </div>
          <div className="p-6 bg-gray-800/30 border border-gray-700 rounded-xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Transparency</h3>
            <p className="text-sm text-gray-400">Clear communication between organizers and attendees is our priority.</p>
          </div>
        </div>
      </div>

      {/* --- MEET THE TEAM SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mt-24 text-center">
        
        {/* --- ADDED HEADING AND DESCRIPTION --- */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Meet the Team Behind EventNest
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
          Passionate developers dedicated to building the best digital experience for our campus.
        </p>
        {/* ------------------------------------- */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx} 
              className="bg-[#161b22] rounded-2xl p-8 flex flex-col items-center text-center border border-white/5 shadow-lg hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Avatar Container */}
              <div className="w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-[#2d333b] bg-gray-700 shadow-xl">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-white">
                {member.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}