import React from 'react';
import PageHero from '../components/PageHero.jsx';
import { Send, MapPin, Mail as MailIcon } from 'lucide-react';
import { showToast } from '../lib/toast.js';

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Message Sent! (Demo)');
    e.target.reset();
  };

  return (
    <section id="page-contact">
      <PageHero title="Get In Touch" imageUrl="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" fallbackText="Contact Us" />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">Have questions or feedback? We'd love to hear from you.</p>
      <div className="max-w-5xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
            <div className="space-y-6">
              <div>
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Your Name" required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@college.edu" required />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea rows="5" className="form-input" placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full py-3 text-lg"><Send className="inline-block mr-2 w-5 h-5" />Send Message</button>
            </div>
          </form>
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold">Our Office</h4>
                <p className="text-gray-300">Chitkara University, Punjab</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MailIcon className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold">Email Us</h4>
                <p className="text-gray-300">support@eventnest.demo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
