import React from 'react';
import type { Product, Movement } from '../types';
import StatCard from '../components/ui/StatCard';
import LowStockProducts from '../components/dashboard/LowStockProducts';
import RecentMovements from '../components/dashboard/RecentMovements';

interface DashboardPageProps {
  products: Product[];
  movements: Movement[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ products, movements }) => {
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.precio * p.stock), 0);
  const lowStockCount = products.filter(p => p.activo && p.stock < p.stockMinimo).length;
  const totalActiveProducts = products.filter(p => p.activo).length;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon="fa-box" 
          title="Total de Productos" 
          value={totalActiveProducts.toString()} 
          color="blue"
          linkTo="/products"
        />
        <StatCard
          icon="fa-dollar-sign"
          title="Valor del Inventario"
          value={`$${totalInventoryValue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          color="green"
        />
        <StatCard 
          icon="fa-exclamation-triangle" 
          title="Productos Bajos en Stock" 
          value={lowStockCount.toString()} 
          color="yellow"
          linkTo="/products?status=low_stock"
        />
        <StatCard 
          icon="fa-exchange-alt" 
          title="Movimientos Recientes" 
          value={movements.slice(0, 5).length.toString()} 
          color="purple" 
          linkTo="/movements"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LowStockProducts products={products} />
        <RecentMovements movements={movements} />
      </div>
    </div>
  );
};

export default DashboardPage;