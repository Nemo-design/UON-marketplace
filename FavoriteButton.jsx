import React, { useState } from 'react';
import './FavoriteButton.css';

const FavoriteButton = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      className={`favorite-button ${isFavorite ? 'active' : ''}`}
      aria-label="Add to favorites"
      onClick={toggleFavorite}
    >
      <svg
        className="heart-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.8 4.6c-1.5-1.3-3.7-1.3-5.2 0L12 8.2 8.4 4.6C6.9 3.3 4.7 3.3 3.2 4.6s-1.6 3.6 0 5l8.8 9 8.8-9c1.6-1.4 1.6-3.7 0-5z" />
      </svg>
    </button>
  );
};

export default FavoriteButton;
