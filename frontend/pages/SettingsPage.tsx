import React from 'react';
import { Navigate } from 'react-router-dom';
import type { Category, Product, NewCategoryData } from '../types';
import { useAuth } from '../context/AuthContext';
import Tabs from '../components/ui/Tabs';
import CategoryManager from '../components/settings/CategoryManager';
import UserManager from '../components/settings/UserManager';

interface SettingsPageProps {
  categories: Category[];
  products: Product[];
  onAddCategory: (data: NewCategoryData) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  const { currentUser } = useAuth();

  if (currentUser?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    {
      label: 'Categorías',
      content: (
        <CategoryManager
          categories={props.categories}
          products={props.products}
          onAddCategory={props.onAddCategory}
          onEditCategory={props.onEditCategory}
          onDeleteCategory={props.onDeleteCategory}
        />
      ),
    },
    {
      label: 'Usuarios',
      content: <UserManager />,
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold text-white mb-6">Configuración del Sistema</h2>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SettingsPage;
