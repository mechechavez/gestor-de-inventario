
import React from 'react';
import type { Product } from '../../types';
import StatusBadge from '../ui/StatusBadge';

interface LowStockProductsProps {
  products: Product[];
}

const LowStockProducts: React.FC<LowStockProductsProps> = ({ products }) => {
  const lowStockProducts = products.filter(p => p.activo && p.stock < p.stockMinimo).slice(0, 5);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
      <h3 className="text-xl font-semibold mb-4 text-white">Productos con Poco Stock</h3>
      {lowStockProducts.length > 0 ? (
        <ul className="divide-y divide-gray-700">
          {lowStockProducts.map(product => (
            <li key={product.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-200">{product.nombre}</p>
                <p className="text-sm text-gray-400">Stock: {product.stock} (Min: {product.stockMinimo})</p>
              </div>
              <StatusBadge stock={product.stock} stockMinimo={product.stockMinimo} activo={product.activo} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-4 text-gray-400">
          <i className="fas fa-check-circle fa-2x mb-2 text-green-500"></i>
          <p>¡Todo en orden! No hay productos con bajo stock.</p>
        </div>
      )}
    </div>
  );
};

export default LowStockProducts;
