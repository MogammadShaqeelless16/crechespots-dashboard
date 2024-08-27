// src/components/Overlay.js
import React from 'react';
import './Overlay.css'; // Import your CSS file for styling

const Overlay = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="overlay-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Overlay;



