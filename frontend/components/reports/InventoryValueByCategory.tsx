import React from 'react';
import type { Product } from '../../types';
import { exportToCsv } from '../../utils/exportUtils';

interface InventoryValueByCategoryProps {
  products: Product[];
}

const InventoryValueByCategory: React.FC<InventoryValueByCategoryProps> = ({ products }) => {
  const valueByCategory = products
    .filter(p => p.activo)
    .reduce((acc, product) => {
      const categoryName = product.categoria.nombre;
      const value = product.precio * product.stock;

      if (!acc[categoryName]) {
        acc[categoryName] = { totalValue: 0, productCount: 0 };
      }
      
      acc[categoryName].totalValue += value;
      acc[categoryName].productCount += 1;

      return acc;
    }, {} as { [key: string]: { totalValue: number; productCount: number } });

  const sortedCategories = Object.entries(valueByCategory).sort(([,a], [,b]) => b.totalValue - a.totalValue);
  
  const handleExport = () => {
    const dataToExport = sortedCategories.map(([categoryName, data]) => ({
      Categoria: categoryName,
      NumeroDeProductos: data.productCount,
      ValorTotal: data.totalValue.toFixed(2),
    }));
    exportToCsv('reporte_valor_por_categoria.csv', dataToExport);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400">Desglose del valor del inventario por categoría.</p>
        <button 
          onClick={handleExport}
          disabled={sortedCategories.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <i className="fas fa-file-export mr-2"></i>Exportar
        </button>
      </div>
      <div className="overflow-y-auto max-h-96">
        {sortedCategories.length > 0 ? (
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-xs sticky top-0">
              <tr>
                <th className="py-2 px-4">Categoría</th>
                <th className="py-2 px-4 text-center"># Productos</th>
                <th className="py-2 px-4 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedCategories.map(([categoryName, data]) => (
                <tr key={categoryName} className="hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{categoryName}</td>
                  <td className="py-2 px-4 text-center">{data.productCount}</td>
                  <td className="py-2 px-4 text-right font-semibold">
                    ${data.totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400">
             <i className="fas fa-box-open fa-3x mb-2"></i>
            <p className="font-semibold">No hay datos de inventario para analizar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryValueByCategory;