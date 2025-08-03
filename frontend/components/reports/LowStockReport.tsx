import React from 'react';
import type { Product } from '../../types';
import { exportToCsv } from '../../utils/exportUtils';

interface LowStockReportProps {
  products: Product[];
}

const LowStockReport: React.FC<LowStockReportProps> = ({ products }) => {
  const lowStockProducts = products.filter(p => p.activo && p.stock < p.stockMinimo);

  const handleExport = () => {
    const dataToExport = lowStockProducts.map(p => ({
      Nombre: p.nombre,
      Categoria: p.categoria.nombre,
      StockActual: p.stock,
      StockMinimo: p.stockMinimo,
      Proveedor: p.proveedor,
      CodigoBarras: p.codigoBarras,
    }));
    exportToCsv('reporte_stock_bajo.csv', dataToExport);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400">Productos que necesitan reabastecimiento.</p>
        <button 
          onClick={handleExport}
          disabled={lowStockProducts.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <i className="fas fa-file-export mr-2"></i>Exportar
        </button>
      </div>
      <div className="overflow-y-auto max-h-96">
        {lowStockProducts.length > 0 ? (
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-xs sticky top-0">
              <tr>
                <th className="py-2 px-4">Producto</th>
                <th className="py-2 px-4 text-center">Stock</th>
                <th className="py-2 px-4 text-center">Mínimo</th>
                <th className="py-2 px-4">Proveedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {lowStockProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-700/50">
                  <td className="py-2 px-4 font-medium">{product.nombre}</td>
                  <td className="py-2 px-4 text-center text-yellow-400 font-bold">{product.stock}</td>
                  <td className="py-2 px-4 text-center">{product.stockMinimo}</td>
                  <td className="py-2 px-4 text-gray-400">{product.proveedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <i className="fas fa-check-circle fa-3x mb-2 text-green-500"></i>
            <p className="font-semibold">¡Excelente! No hay productos con bajo stock.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockReport;