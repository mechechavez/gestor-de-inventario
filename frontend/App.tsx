import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import MovementsPage from './pages/MovementsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import type { Product, Movement, Category, NewProductData, NewMovementData, NewCategoryData } from './types';
import { useToast } from './context/ToastContext';
import { SearchProvider } from './context/SearchContext';

const API_BASE_URL = 'http://localhost:5000/api';

const App: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos desde la API
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadCategories(),
        loadProducts(),
        loadMovements()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      showToast('Error al cargar datos iniciales', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const categoriesWithId = data.data.map((cat: any) => ({
          ...cat,
          id: cat._id
        }));
        setCategories(categoriesWithId);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?limit=1000`);
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const productsWithId = data.data.map((product: any) => ({
          ...product,
          id: product._id,
          categoria: {
            ...product.categoria,
            id: product.categoria._id
          }
        }));
        setProducts(productsWithId);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadMovements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movements?limit=1000`);
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const movementsWithId = data.data.map((movement: any) => ({
          ...movement,
          id: movement._id
        }));
        setMovements(movementsWithId);
      }
    } catch (error) {
      console.error('Error loading movements:', error);
    }
  };

  const handleAddProduct = async (productData: NewProductData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const productWithId = {
          ...data.data,
          id: data.data._id,
          categoria: {
            ...data.data.categoria,
            id: data.data.categoria._id
          }
        };
        setProducts(prev => [productWithId, ...prev]);
        showToast(`Producto "${data.data.nombre}" agregado exitosamente.`, 'success');
      } else {
        showToast('Error al agregar producto', 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Error al agregar producto', 'error');
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const productWithId = {
          ...data.data,
          id: data.data._id,
          categoria: {
            ...data.data.categoria,
            id: data.data.categoria._id
          }
        };
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? productWithId : p));
        showToast(`Producto "${data.data.nombre}" actualizado exitosamente.`, 'success');
      } else {
        showToast('Error al actualizar producto', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Error al actualizar producto', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        const productName = products.find(p => p.id === productId)?.nombre || '';
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast(`Producto "${productName}" eliminado exitosamente.`, 'success');
      } else {
        showToast('Error al eliminar producto', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Error al eliminar producto', 'error');
    }
  };

  const handleAddMovement = async (movementData: NewMovementData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movementData),
      });
      
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const movementWithId = {
          ...data.data,
          id: data.data._id
        };
        setMovements(prev => [movementWithId, ...prev]);
        // Actualizar stock del producto
        await loadProducts();
        showToast('Movimiento registrado exitosamente.', 'success');
      } else {
        showToast('Error al registrar movimiento', 'error');
      }
    } catch (error) {
      console.error('Error adding movement:', error);
      showToast('Error al registrar movimiento', 'error');
    }
  };

  const handleAddCategory = async (categoryData: NewCategoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const categoryWithId = {
          ...data.data,
          id: data.data._id
        };
        setCategories(prev => [categoryWithId, ...prev]);
        showToast(`Categoría "${data.data.nombre}" agregada exitosamente.`, 'success');
      } else {
        showToast('Error al agregar categoría', 'error');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showToast('Error al agregar categoría', 'error');
    }
  };

  const handleEditCategory = async (updatedCategory: Category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${updatedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
      });
      
      const data = await response.json();
      if (data.success) {
        // Transform _id to id for frontend compatibility
        const categoryWithId = {
          ...data.data,
          id: data.data._id
        };
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? categoryWithId : c));
        showToast(`Categoría "${data.data.nombre}" actualizada exitosamente.`, 'success');
      } else {
        showToast('Error al actualizar categoría', 'error');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Error al actualizar categoría', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // Verificar si hay productos usando esta categoría
      if (products.some(p => p.categoria?.id === categoryId)) {
        showToast("No se puede eliminar una categoría que tiene productos asociados.", 'error');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        const categoryName = categories.find(c => c.id === categoryId)?.nombre || '';
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        showToast(`Categoría "${categoryName}" eliminada exitosamente.`, 'success');
      } else {
        showToast('Error al eliminar categoría', 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Error al eliminar categoría', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <SearchProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={
              <DashboardPage 
                products={products} 
                movements={movements}
              />
            } />
            <Route path="products" element={
              <ProductsPage 
                products={products}
                categories={categories}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            } />
            <Route path="movements" element={
              <MovementsPage 
                movements={movements}
                products={products}
                onRegisterMovement={handleAddMovement}
              />
            } />
            <Route path="reports" element={
              <ReportsPage 
                products={products}
              />
            } />
            <Route path="settings" element={
              <SettingsPage 
                categories={categories}
                products={products}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            } />
          </Route>
        </Route>
      </Routes>
    </SearchProvider>
  );
};

export default App;
