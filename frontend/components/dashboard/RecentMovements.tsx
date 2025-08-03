
import React from 'react';
import type { Movement } from '../../types';

interface RecentMovementsProps {
  movements: Movement[];
}

const RecentMovements: React.FC<RecentMovementsProps> = ({ movements }) => {
  const recentMovements = movements.slice(0, 5);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-semibold mb-4 text-white">Movimientos Recientes</h3>
      {recentMovements.length > 0 ? (
        <ul className="divide-y divide-gray-700">
          {recentMovements.map(mov => (
            <li key={mov.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className={`mr-3 p-2 rounded-full ${mov.tipo === 'entrada' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  <i className={`fas ${mov.tipo === 'entrada' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                </div>
                <div>
                  <p className="font-medium text-gray-200">{mov.productoNombre}</p>
                  <p className="text-sm text-gray-400">
                    <span className="font-bold">{mov.cantidad}</span> unidades - {mov.responsable}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{formatDate(mov.fecha)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No hay movimientos recientes.</p>
      )}
    </div>
  );
};

export default RecentMovements;
