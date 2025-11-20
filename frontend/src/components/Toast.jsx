import React, { useEffect, useState } from 'react';

export default function Toast() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setMessage(e.detail);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
    };
    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, []);

  return (
    <div className={`fixed bottom-10 right-10 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-[120%]'}`}
      role="alert">
      <span>{message}</span>
    </div>
  );
}
