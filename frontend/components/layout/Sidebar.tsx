import React from 'react';
import { NavLink } from 'react-router-dom';
import type { User } from '../../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const AppNavLink: React.FC<{
  iconClass: string;
  label: string;
  to: string;
}> = ({ iconClass, label, to }) => (
  <NavLink
    to={to}
    end // Use `end` for the dashboard link to prevent it from being active on other routes
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200 ${
        isActive ? 'bg-gray-700 text-white' : ''
      }`
    }
  >
    <i className={`fas ${iconClass} w-6 text-center`}></i>
    <span className="mx-4 font-medium">{label}</span>
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <div className="flex flex-col w-64 h-full bg-gray-800 text-white shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <i className="fas fa-boxes-stacked fa-2x text-blue-400"></i>
        <h1 className="text-2xl font-bold ml-3">Inventario</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <AppNavLink iconClass="fa-tachometer-alt" label="Dashboard" to="/" />
        <AppNavLink iconClass="fa-box-open" label="Productos" to="/products" />
        <AppNavLink iconClass="fa-exchange-alt" label="Movimientos" to="/movements" />
        <AppNavLink iconClass="fa-chart-pie" label="Reportes" to="/reports" />
        {user.rol === 'admin' && (
          <AppNavLink iconClass="fa-cog" label="Configuración" to="/settings" />
        )}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full object-cover" src={`https://i.pravatar.cc/150?u=${user.id}`} alt="User" />
          <div className="ml-3">
            <p className="font-semibold text-sm">{user.nombre}</p>
            <p className="text-xs text-green-400 capitalize">{user.rol}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-red-600/50 hover:bg-red-700/60 rounded-md transition-colors duration-200"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
