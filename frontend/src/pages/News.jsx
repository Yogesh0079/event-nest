import React, { useState, useRef, useCallback } from 'react';
import PageHero from '../components/PageHero.jsx';
import { Megaphone, Bell, HelpCircle, ArrowRight, Zap, X, CheckCircle, Music } from 'lucide-react';

export default function NewsPage() {
  
  // --- STATE FOR POPUPS ---
  const [activeModal, setActiveModal] = useState(null);
  const [votedOption, setVotedOption] = useState(null);

  // Close function
  const closeModal = () => {
    setActiveModal(null);
    setVotedOption(null); 
  };

  // --- DATA ---
  
  const featuredNews = {
    title: "RANGREZZ '26: The Cultural Phenomenon Returns!",
    date: "Jan 1 - Jan 2, 2026",
    // Main Feature Image (Chitkara)
    image: "https://www.chitkara.edu.in/wp-content/uploads/2018/10/News-Image.jpg", 
    description: "The wait is over! North India's biggest cultural fest is back. Get ready for 48 hours of Drama, Art, Fashion, and the massive Star Night Finale!",
    fullStory: "Rangrezz '26 is set to be bigger and louder than ever before!\n\nScheduled for January 1st and 2nd, 2026, the campus will transform into a vibrant hub of creativity. We have over 50+ events planned, including the famous 'Nukkad Natak', the 'Vogue Fashion Show', and the inter-college 'Battle of Bands'.\n\nThe Grand Finale:\nRumors are swirling about the Star Night performer. Will it be a Punjabi pop sensation or a Bollywood heartthrob? The Student Council has confirmed that the reveal will happen this Friday. \n\nPasses for non-Chitkara students go live on Monday via the dashboard.",
    tag: "FLAGSHIP FEST"
  };

  const sideNews = [
    {
      title: "CodeSprint 2025: Problem Statements Out!",
      desc: "The theme for this year is 'Sustainable AI'. Check the portal for details.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
      tag: "HACKATHON"
    },
    {
      title: "Robotics Exhibition: Call for Projects",
      desc: "Final year students can now submit their prototypes for the Jan 10 expo.",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
      tag: "INNOVATION"
    }
  ];

  const notices = [
    { text: "Rangrezz Auditions: Dance club selections start tomorrow @ 4 PM.", type: "Urgent" },
    { text: "Valorant Tournament: participating teams must submit player IDs by Friday.", type: "Update" },
    { text: "Winter Break begins from Jan 15th (Post-Fest).", type: "Info" }
  ];

  return (
    <section className="bg-gray-900 min-h-screen pb-16 text-white font-sans relative">
      
      {/* --- Ticker --- */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold py-2 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap gap-8 items-center">
          <span className="flex items-center gap-2"><Megaphone size={16}/> RANGREZZ '26 PASSES LIVE SOON</span>
          <span className="text-indigo-200">•</span>
          <span className="flex items-center gap-2"><Zap size={16}/> VALORANT FINALS: DEC 6TH</span>
          <span className="text-indigo-200">•</span>
          <span className="flex items-center gap-2"><Bell size={16}/> LIBRARY CLOSED FOR MAINTENANCE ON SUNDAY</span>
        </div>
      </div>

      {/* --- PAGE HERO WITH NEW FESTIVAL IMAGE --- */}
      <PageHero
        title="Campus Buzz & News"
        imageUrl="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200"
        fallbackText="What's Happening"
      />

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Main News) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Card */}
            <div className="relative group rounded-2xl overflow-hidden h-[400px] border border-gray-700 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <img src={featuredNews.image} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4 z-20 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                FEST SEASON
              </div>
              <div className="absolute bottom-0 left-0 z-20 p-6 md:p-8 w-full">
                <span className="text-purple-400 font-bold tracking-widest text-sm mb-2 block">{featuredNews.tag}</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">{featuredNews.title}</h2>
                <p className="text-gray-300 mb-4 max-w-xl text-sm md:text-base line-clamp-2">{featuredNews.description}</p>
                
                <button 
                  onClick={() => setActiveModal('story')}
                  className="flex items-center gap-2 text-white font-semibold border-b-2 border-purple-500 hover:text-purple-400 transition-colors"
                >
                  Read Full Story <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Side News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sideNews.map((item, idx) => (
                <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors group cursor-pointer">
                  <div className="h-40 overflow-hidden relative bg-gray-900">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-2 right-2 bg-blue-600/90 text-[10px] font-bold px-2 py-1 rounded text-white">{item.tag}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-blue-400">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN (Voting & Notices) */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* VOTING CARD */}
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-1 border border-white/10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-6 h-full text-center relative z-10">
                <div className="bg-gray-800 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border-2 border-pink-500 text-pink-400">
                  <Music size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Star Night Headliner?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Who do you think is performing at Rangrezz '26? Vote for your favorite!
                </p>
                <div className="h-24 w-full bg-gray-800 rounded-lg mb-4 overflow-hidden relative group">
                   <img src="https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover blur-md opacity-50 group-hover:blur-sm transition-all duration-500" alt="Mystery" />
                   <span className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-white/20">?</span>
                </div>
                
                <button 
                  onClick={() => setActiveModal('vote')}
                  className="w-full py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-sm font-bold text-white transition-colors"
                >
                  Vote Now
                </button>
              </div>
            </div>

            {/* NOTICE BOARD */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                <Bell className="text-yellow-400" size={20} />
                <h3 className="font-bold text-lg text-white">Official Notices</h3>
              </div>
              <ul className="space-y-4">
                {notices.map((notice, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notice.type === 'Urgent' ? 'bg-red-500' : notice.type === 'Update' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    <div>
                      <p className="text-gray-300 text-sm hover:text-white cursor-pointer transition-colors">{notice.text}</p>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{notice.type}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ========================== */}
      {/* POPUPS / MODALS            */}
      {/* ========================== */}
      
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* STORY POPUP */}
          {activeModal === 'story' && (
            <div className="relative bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeInUp">
              <div className="relative h-64 w-full shrink-0">
                 <img src={featuredNews.image} alt="Cover" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                 <button onClick={closeModal} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"><X size={20}/></button>
              </div>
              <div className="p-8 overflow-y-auto">
                 <span className="text-purple-500 font-bold text-xs tracking-widest mb-2 block">{featuredNews.tag}</span>
                 <h2 className="text-3xl font-bold text-white mb-4">{featuredNews.title}</h2>
                 <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                   {featuredNews.fullStory}
                 </p>
                 <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end">
                    <button onClick={closeModal} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-semibold transition-colors">Close</button>
                 </div>
              </div>
            </div>
          )}

          {/* VOTING POPUP */}
          {activeModal === 'vote' && (
            <div className="relative bg-gray-900 border border-pink-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-scaleIn">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20}/></button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-pink-600/20 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white">Vote for Star Night!</h3>
                <p className="text-gray-400 text-sm mt-2">Who do you want to see live at Rangrezz '26?</p>
              </div>

              {!votedOption ? (
                <div className="space-y-3">
                  {['Diljit Dosanjh', 'Arijit Singh', 'Arjan Dhillon', 'Karan Aujla'].map((option) => (
                    <button 
                      key={option}
                      onClick={() => setVotedOption(option)}
                      className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-pink-500 hover:bg-gray-750 flex items-center justify-between transition-all group"
                    >
                      <span className="text-white font-medium">{option}</span>
                      <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-pink-500"></div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-6 text-center animate-fadeIn">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-white mb-1">Vote Recorded!</h4>
                  <p className="text-gray-400 text-sm">You want <span className="text-green-400 font-bold">{votedOption}</span> to perform!</p>
                  <p className="text-xs text-gray-500 mt-4">Results will be shared on our Instagram page.</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </section>
  );
}