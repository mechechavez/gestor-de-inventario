import React from 'react';
import { useToast } from '../../context/ToastContext';
import type { Toast as ToastProps } from '../../types';

const toastIcons = {
  success: 'fa-check-circle',
  error: 'fa-times-circle',
  warning: 'fa-exclamation-triangle',
  info: 'fa-info-circle',
};

const toastColors = {
  success: 'bg-green-600 border-green-700',
  error: 'bg-red-600 border-red-700',
  warning: 'bg-yellow-500 border-yellow-600',
  info: 'bg-blue-600 border-blue-700',
};


const Toast: React.FC<{ toast: ToastProps; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  return (
    <div
      className={`relative w-full max-w-sm p-4 mb-4 text-white rounded-lg shadow-2xl flex items-center border-l-4 ${toastColors[toast.type]} animate-slide-in-right`}
    >
      <i className={`fas ${toastIcons[toast.type]} fa-lg mr-4`}></i>
      <div className="flex-1">{toast.message}</div>
      <button onClick={() => onDismiss(toast.id)} className="ml-4 text-white/70 hover:text-white transition-colors" aria-label="Cerrar notificación">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};


export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (!toasts.length) return null;

    return (
        <div className="fixed top-5 right-5 z-[100] w-full max-w-sm">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
            ))}
        </div>
    );
};
