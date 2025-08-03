import React, { FC, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-6 relative transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-700">
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <i className="fas fa-times fa-lg"></i>
          </button>
        </div>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;