import React from 'react';

export default function NotFoundPage() {
  return (
    <section className="text-center py-24">
      <h1 className="text-8xl font-extrabold text-emerald-500">404</h1>
      <h2 className="text-4xl font-bold my-4">Page Not Found</h2>
      <p className="text-lg text-gray-300 mb-8">Sorry, we couldn't find the page you're looking for.</p>
      <a href="/" className="btn btn-primary text-lg">Go Back Home</a>
    </section>
  );
}
