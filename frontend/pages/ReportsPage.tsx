import React from 'react';
import type { Product } from '../types';
import InventorySummary from '../components/reports/InventorySummary';
import LowStockReport from '../components/reports/LowStockReport';
import InventoryValueByCategory from '../components/reports/InventoryValueByCategory';

interface ReportsPageProps {
  products: Product[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ products }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">Resumen General del Inventario</h2>
        <InventorySummary products={products} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
           <h2 className="text-2xl font-semibold text-white mb-4">Reporte de Stock Bajo</h2>
           <LowStockReport products={products} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
           <h2 className="text-2xl font-semibold text-white mb-4">Valor de Inventario por Categoría</h2>
           <InventoryValueByCategory products={products} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
