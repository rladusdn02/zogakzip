import React from 'react';
import '../styles/BigModal.css';

function BigModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="bigmodal">
      <div className="bigmodal-content">
        {children}
        <button className="big-close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
}