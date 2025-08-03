import React, { useState, useEffect } from 'react';
import type { Movement, Product, NewMovementData } from '../types';
import Modal from '../components/ui/Modal';
import MovementForm from '../components/movements/MovementForm';
import Pagination from '../components/ui/Pagination';
import { useSearch } from '../context/SearchContext';

interface MovementsPageProps {
  movements: Movement[];
  products: Product[];
  onRegisterMovement: (data: NewMovementData) => void;
}

const MovementsPage: React.FC<MovementsPageProps> = ({ movements, products, onRegisterMovement }) => {
  const { globalSearchTerm } = useSearch();
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Movement; direction: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Usar búsqueda global si está disponible, sino usar búsqueda local
  const effectiveSearchTerm = globalSearchTerm || filter;

  useEffect(() => {
    setCurrentPage(1);
  }, [effectiveSearchTerm]);

  const sortedMovements = React.useMemo(() => {
    let sortableItems = [...movements];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [movements, sortConfig]);

  const filteredMovements = sortedMovements.filter(movement =>
    movement.producto?.nombre?.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    movement.usuario?.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    movement.motivo?.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    movement.tipo.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
  );

  const paginatedMovements = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovements, currentPage, itemsPerPage]);


  const requestSort = (key: keyof Movement) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Movement) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <i className="fas fa-sort text-gray-500 ml-2"></i>;
    }
    if (sortConfig.direction === 'ascending') {
      return <i className="fas fa-sort-up text-blue-400 ml-2"></i>;
    }
    return <i className="fas fa-sort-down text-blue-400 ml-2"></i>;
  };
  
  const handleSaveMovement = (movementData: NewMovementData) => {
    onRegisterMovement(movementData);
    setIsModalOpen(false);
  }

  return (
    <>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nuevo Movimiento"
      >
        <MovementForm
          products={products.filter(p => p.activo)}
          onSave={handleSaveMovement}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 mr-4">
            <input
              type="text"
              placeholder={globalSearchTerm ? `Búsqueda global activa: "${globalSearchTerm}"` : "Filtrar movimientos..."}
              className={`w-1/3 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                globalSearchTerm ? 'bg-gray-600 text-gray-400 border-gray-500' : 'bg-gray-700 text-gray-100'
              }`}
              value={globalSearchTerm ? '' : filter}
              onChange={(e) => setFilter(e.target.value)}
              disabled={!!globalSearchTerm}
            />
            {globalSearchTerm && (
              <p className="text-xs text-blue-400 mt-1">Usando búsqueda global del header</p>
            )}
          </div>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="fas fa-plus mr-2"></i>Registrar Movimiento
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-sm">
              <tr>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => requestSort('tipo')}>Tipo {getSortIcon('tipo')}</th>
                <th className="py-3 px-4 text-center cursor-pointer" onClick={() => requestSort('cantidad')}>Cantidad {getSortIcon('cantidad')}</th>
                <th className="py-3 px-4">Motivo</th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => requestSort('usuario')}>Responsable {getSortIcon('usuario')}</th>
                <th className="py-3 px-4 text-right cursor-pointer" onClick={() => requestSort('fecha')}>Fecha {getSortIcon('fecha')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedMovements.map(movement => (
                <tr key={movement.id} className="hover:bg-gray-700/50">
                  <td className="py-3 px-4 font-medium">{movement.producto?.nombre || 'Producto desconocido'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${movement.tipo === 'entrada' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {movement.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{movement.cantidad}</td>
                  <td className="py-3 px-4">{movement.motivo}</td>
                  <td className="py-3 px-4">{movement.usuario}</td>
                  <td className="py-3 px-4 text-right">{new Date(movement.fecha).toLocaleString('es-ES')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMovements.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <i className="fas fa-search fa-2x mb-2"></i>
                <p>No se encontraron movimientos que coincidan con el filtro.</p>
            </div>
          )}
        </div>
        <Pagination
            totalItems={filteredMovements.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </>
  );
};

export default MovementsPage;