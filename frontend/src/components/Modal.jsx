import React from 'react';
import '../styles/Modal.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default Modal;