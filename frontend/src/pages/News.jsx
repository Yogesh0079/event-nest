import React, { useState, useRef, useCallback } from 'react';
import PageHero from '../components/PageHero.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsPage() {
  const events = [
    {
      title: 'Chitkara Hackathon 2026',
      img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
      desc: '36-hour hackathon on AI, IoT & Sustainability. Cash prizes up to ₹1,00,000. (Jan 15-17, 2026)',
    },
    {
      title: 'Carnival 2026 – Cultural Fest',
      img: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc',
      desc: 'Three-day cultural extravaganza with performances, competitions & celebrity acts. (Jan 22-24, 2026)',
    },
    {
      title: 'Annual DJ Night 2025',
      img: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439',
      desc: 'Glow-themed DJ Night with top artists from Chandigarh. Entry with student ID. (Dec 10, 2025)',
    },
    {
      title: 'Sports Week – December 2025',
      img: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d',
      desc: 'Cricket, Basketball, Volleyball, Athletics, Kabaddi & more. (Dec 1-7, 2025)',
    },
    {
      title: 'Winter Project Expo',
      img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952',
      desc: 'Showcase innovative student projects in engineering and arts. (Dec 15, 2025)',
    },
  ];

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      const scrollAmount = 300 + 24; // Card width (300px) + gap (24px)
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      const scrollAmount = 300 + 24; // Card width (300px) + gap (24px)
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(prevIndex => Math.min(events.length - 1, prevIndex + 1));
    }
  }, [events.length]);

  return (
    <section id="page-news" className="text-white">
      <PageHero
        title="News & Announcements"
        imageUrl="https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="Campus News"
      />

      <h2 className="text-3xl font-bold text-center mt-8 mb-6 text-blue-300 tracking-wide">
        📰 Latest Events & Announcements
      </h2>
      
      {/* --- Carousel Style Layout --- */}
      <div className="relative w-full flex justify-center items-center py-4 mb-16"> {/* Added mb-16 for bottom spacing */}
        
        {/* Left Navigation Button */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 md:left-10 z-10 bg-blue-600/70 p-3 rounded-full shadow-lg hover:bg-blue-700/90 transition-colors duration-200 text-white"
          aria-label="Previous Event"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Carousel Content Container */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-scroll snap-x snap-mandatory px-8 pb-4 no-scrollbar w-full max-w-6xl"
        >
          {events.map((event, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-[300px] snap-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <img
                src={event.img}
                alt={event.title}
                className="rounded-t-xl h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Navigation Button */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 md:right-10 z-10 bg-blue-600/70 p-3 rounded-full shadow-lg hover:bg-blue-700/90 transition-colors duration-200 text-white"
          aria-label="Next Event"
        >
          <ChevronRight size={28} />
        </button>
      </div>
      
      {/* The "Show All News" button div has been removed entirely */}
    </section>
  );
}