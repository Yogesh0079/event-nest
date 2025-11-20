import React from 'react';

export default function PageHero({ title, imageUrl, fallbackText }) {
  const placeholder = `https://placehold.co/1200x400/1f2937/a3a3a3?text=${fallbackText.split(' ').join('+')}`;
  return (
    <div className="page-hero">
      <img
        src={imageUrl || placeholder}
        alt={title}
        className="page-hero-img"
        onError={(e) => { e.currentTarget.src = placeholder; }}
      />
      <div className="page-hero-overlay">
        <h1 className="text-5xl md:text-6xl font-extrabold">{title}</h1>
      </div>
    </div>
  );
}
