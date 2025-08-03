
import React from 'react';

interface StatusBadgeProps {
  stock: number;
  stockMinimo: number;
  activo: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ stock, stockMinimo, activo }) => {
  if (!activo) {
    return <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">Inactivo</span>;
  }
  if (stock === 0) {
    return <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">Agotado</span>;
  }
  if (stock < stockMinimo) {
    return <span className="px-2 py-1 text-xs font-semibold text-black bg-yellow-400 rounded-full">Bajo Stock</span>;
  }
  return <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">En Stock</span>;
};

export default StatusBadge;
