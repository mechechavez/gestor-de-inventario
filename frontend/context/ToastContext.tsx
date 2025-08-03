import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Toast, ToastType } from '../types';

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast_${new Date().getTime()}_${Math.random()}`;
    const newToast: Toast = { id, message, type };
    setToasts(prevToasts => [newToast, ...prevToasts]);

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const value = {
      toasts,
      showToast,
      removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
