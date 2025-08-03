import React from 'react';
import type { Product } from '../../types';
import StatCard from '../ui/StatCard';

interface InventorySummaryProps {
  products: Product[];
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ products }) => {
  const activeProducts = products.filter(p => p.activo);

  const totalInventoryValue = activeProducts.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  const totalUnits = activeProducts.reduce((acc, p) => acc + p.stock, 0);
  const uniqueCategories = new Set(activeProducts.map(p => p.categoria.id)).size;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon="fa-boxes-stacked"
        title="Productos Activos"
        value={activeProducts.length.toString()}
        color="blue"
      />
      <StatCard
        icon="fa-cash-register"
        title="Valor Total Inventario"
        value={`$${totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        color="green"
      />
      <StatCard
        icon="fa-warehouse"
        title="Unidades Totales"
        value={totalUnits.toLocaleString('es-MX')}
        color="purple"
      />
      <StatCard
        icon="fa-tags"
        title="Categorías Únicas"
        value={uniqueCategories.toString()}
        color="yellow"
      />
    </div>
  );
};

export default InventorySummary;
