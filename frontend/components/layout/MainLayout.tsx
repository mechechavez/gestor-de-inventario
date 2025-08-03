import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer } from '../ui/Toaster';

const MainLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/products':
        return 'Productos';
      case '/movements':
        return 'Movimientos';
      case '/reports':
        return 'Reportes';
      case '/settings':
        return 'Configuración';
      default:
        return 'Gestor de Inventario';
    }
  };

  // This should not happen due to ProtectedRoute, but as a safeguard.
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar user={currentUser} onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitle()} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MainLayout;