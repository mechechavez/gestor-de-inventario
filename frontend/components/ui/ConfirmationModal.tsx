import React, { FC, ReactNode } from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  confirmColor?: 'red' | 'blue' | 'green';
}

const colorClasses = {
  red: 'bg-red-600 hover:bg-red-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  green: 'bg-green-600 hover:bg-green-700',
};

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirmar',
  confirmColor = 'red',
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-gray-300">
        {children}
      </div>
      <div className="flex justify-end pt-6 space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`${colorClasses[confirmColor]} text-white font-bold py-2 px-6 rounded-md transition-colors duration-200`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;