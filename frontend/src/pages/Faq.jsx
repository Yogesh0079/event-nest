import React from 'react';
import PageHero from '../components/PageHero.jsx';
import FaqItem from '../components/FaqItem.jsx';

export default function FaqPage() {
  const faqs = [
    // --- General Registration & Participation ---
    { 
      q: "How do I register for an event?", 
      a: "Navigate to the event's detail page, ensure you are logged in, and click the 'Register' button. You will receive an email confirmation and the event will appear in your Dashboard under 'My Registered Events'." 
    },
    { 
      q: "Can I cancel my registration?", 
      a: "Yes. Go to your Dashboard, find the event under 'My Registered Events', and click the 'Cancel Registration' button. Note that cancellations for paid events may be subject to the organizer's refund policy." 
    },
    { 
      q: "Can I register for an event after the deadline?", 
      a: "No. Once the registration deadline has passed, the system automatically closes registration. Please ensure you sign up before the cutoff time mentioned on the event page." 
    },
    { 
      q: "How do I check my event attendance or get a certificate?", 
      a: "Your attendance is marked by the event Organizer or Admin after the event concludes. Once marked, the Organizer will issue your certificate, which will be available for download in your Dashboard under the 'Certificates' tab." 
    },

    // --- Account & Profile Management ---
    { 
      q: "I forgot my password. How can I reset it?", 
      a: "On the login screen, click the 'Forgot Password' link. Enter your registered email address, and we will send you a link to securely set a new password." 
    },
    { 
      q: "How can I update my profile picture or personal details?", 
      a: "Log in and go to your Dashboard. Click on the 'Profile Settings' or 'Edit Profile' section. You can update your name, email, contact number, and profile image there." 
    },

    // --- Organizers & Event Creation ---
    { 
      q: "Who is eligible to create and host an event?", 
      a: "Only users with the 'Organizer' or 'Admin' role can create events. If you need to upgrade your account to an Organizer role, please contact the site administrator for approval." 
    },
    { 
      q: "How long does it take for a new event to be approved?", 
      a: "Newly submitted events are typically reviewed by an Admin within 24 to 48 hours. You will receive an email notification once your event is approved and live on the platform." 
    },

    // --- Technical Issues & Support ---
    { 
      q: "The event page isn't loading correctly or gives an error.", 
      a: "First, try clearing your browser's cache and cookies or accessing the site in an Incognito/Private window. If the issue persists, please report it to our technical support team, including the event name and any error codes you see." 
    }
  ];

  return (
    <section id="page-faq">
      <PageHero 
        title="How Can We Help?" 
        imageUrl="https://images.unsplash.com/photo-1559863013-5f0d366a7f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
        fallbackText="FAQ" 
      />
      
      <div className="w-full text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2 pt-6">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-400 mb-12 relative z-10">
          Find answers to common questions about EventNest, registration, and account management.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 px-4 sm:px-6 lg:px-8 mb-16">
        {faqs.map((f, i) => 
          <FaqItem key={i} question={f.q} answer={f.a} />
        )}
      </div>
    </section>
  );
}