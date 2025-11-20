import React from 'react';
import { Twitter, Instagram, Facebook, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900/70 border-t border-gray-800 mt-24">
      <div className="container mx-auto px-6 py-12 text-center text-gray-400">
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter /></a>
          <a href="#" className="hover:text-emerald-400 transition-colors"><Instagram /></a>
          <a href="#" className="hover:text-emerald-400 transition-colors"><Facebook /></a>
          <a href="#" className="hover:text-emerald-400 transition-colors"><Linkedin /></a>
        </div>
        <p>&copy; {new Date().getFullYear()} EventNest. Made with <Heart className="inline-block w-4 h-4 text-red-500" /> by students.</p>
      </div>
    </footer>
  );
}
