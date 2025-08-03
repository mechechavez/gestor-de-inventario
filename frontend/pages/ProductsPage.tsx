import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product, NewProductData, Category } from '../types';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/products/ProductForm';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import Pagination from '../components/ui/Pagination';
import { useSearch } from '../context/SearchContext';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (productData: NewProductData) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

type ProductStatus = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'inactive';

const ProductsPage: React.FC<ProductsPageProps> = ({ products, categories, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { globalSearchTerm } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ProductStatus>(searchParams.get('status') as ProductStatus || 'all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Usar búsqueda global si está disponible, sino usar búsqueda local
  const effectiveSearchTerm = globalSearchTerm || searchTerm;


  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      setStatusFilter(status as ProductStatus);
    }
  }, [searchParams]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [effectiveSearchTerm, categoryFilter, statusFilter]);

  const filteredProducts = React.useMemo(() => {
    return products
      .filter(product => {
        // Text search filter
        const matchesSearchTerm =
          product.nombre.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
          product.categoria.nombre.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
          product.proveedor.toLowerCase().includes(effectiveSearchTerm.toLowerCase());
        
        // Category filter
        const matchesCategory = categoryFilter === 'all' || product.categoria.id === categoryFilter;

        // Status filter
        const matchesStatus = () => {
          switch (statusFilter) {
            case 'in_stock':
              return product.activo && product.stock >= product.stockMinimo;
            case 'low_stock':
              return product.activo && product.stock < product.stockMinimo && product.stock > 0;
            case 'out_of_stock':
              return product.activo && product.stock === 0;
            case 'inactive':
              return !product.activo;
            case 'all':
            default:
              return true;
          }
        };

        return matchesSearchTerm && matchesCategory && matchesStatus();
      });
  }, [products, effectiveSearchTerm, categoryFilter, statusFilter]);

  const sortedProducts = React.useMemo(() => {
    let sortableItems = [...filteredProducts];
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
  }, [filteredProducts, sortConfig]);

  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const requestSort = (key: keyof Product) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Product) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <i className="fas fa-sort text-gray-500 ml-2"></i>;
    }
    if (sortConfig.direction === 'ascending') {
      return <i className="fas fa-sort-up text-blue-400 ml-2"></i>;
    }
    return <i className="fas fa-sort-down text-blue-400 ml-2"></i>;
  };

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  }

  const handleSaveProduct = (productFormData: NewProductData) => {
    if (productToEdit) {
      const category = categories.find(c => c.id === productFormData.categoriaId);
      if(!category) return;

      const updatedProduct: Product = {
        ...productToEdit,
        ...productFormData,
        categoria: category,
      };
      onEditProduct(updatedProduct);
    } else {
      onAddProduct(productFormData);
    }
    closeModal();
  };
  
  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSearchParams({});
  };

  const inputClass = "py-2 px-3 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600";

  return (
    <>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={productToEdit ? 'Editar Producto' : 'Añadir Nuevo Producto'}
      >
        <ProductForm 
          categories={categories} 
          onSave={handleSaveProduct} 
          onCancel={closeModal} 
          productToEdit={productToEdit}
        />
      </Modal>

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        confirmText="Eliminar"
        confirmColor="red"
      >
        <p>¿Estás seguro de que quieres eliminar el producto <strong>{productToDelete?.nombre}</strong>?</p>
        <p className="text-sm text-gray-400 mt-2">Esta acción es permanente y no se puede deshacer.</p>
      </ConfirmationModal>


      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              Buscar {globalSearchTerm && <span className="text-blue-400">(usando búsqueda global: "{globalSearchTerm}")</span>}
            </label>
            <input
              type="text"
              placeholder={globalSearchTerm ? "Búsqueda global activa..." : "Buscar por nombre, categoría, proveedor..."}
              className={`${inputClass} w-full ${globalSearchTerm ? 'bg-gray-600 text-gray-400' : ''}`}
              value={globalSearchTerm ? '' : searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!!globalSearchTerm}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Categoría</label>
            <select className={`${inputClass} w-full`} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option key="all" value="all">Todas</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">Estado</label>
            <select className={`${inputClass} w-full`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ProductStatus)}>
              <option key="all" value="all">Todos</option>
              <option key="in_stock" value="in_stock">En Stock</option>
              <option key="low_stock" value="low_stock">Bajo Stock</option>
              <option key="out_of_stock" value="out_of_stock">Agotado</option>
              <option key="inactive" value="inactive">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
           <button onClick={clearFilters} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Limpiar Filtros
            </button>
            <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
                onClick={handleOpenAddModal}
            >
                <i className="fas fa-plus mr-2"></i>Añadir Producto
            </button>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 cursor-pointer" onClick={() => requestSort('nombre')}>Nombre {getSortIcon('nombre')}</th>
                <th className="py-3 px-4 cursor-pointer" onClick={() => requestSort('categoria')}>Categoría {getSortIcon('categoria')}</th>
                <th className="py-3 px-4 text-center cursor-pointer" onClick={() => requestSort('stock')}>Stock {getSortIcon('stock')}</th>
                <th className="py-3 px-4 text-right cursor-pointer" onClick={() => requestSort('precio')}>Precio {getSortIcon('precio')}</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-700/50">
                  <td className="py-3 px-4 font-medium">{product.nombre}</td>
                  <td className="py-3 px-4">{product.categoria.nombre}</td>
                  <td className="py-3 px-4 text-center">{product.stock}</td>
                  <td className="py-3 px-4 text-right">${product.precio.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge stock={product.stock} stockMinimo={product.stockMinimo} activo={product.activo} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleOpenEditModal(product)} className="text-blue-400 hover:text-blue-300 mr-4" aria-label={`Editar ${product.nombre}`}><i className="fas fa-pencil-alt"></i></button>
                    <button onClick={() => setProductToDelete(product)} className="text-red-500 hover:text-red-400" aria-label={`Eliminar ${product.nombre}`}><i className="fas fa-trash-alt"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {sortedProducts.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                  <i className="fas fa-search fa-2x mb-2"></i>
                  <p>No se encontraron productos que coincidan con los filtros.</p>
              </div>
           )}
        </div>
        
        <Pagination
          totalItems={sortedProducts.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </>
  );
};

export default ProductsPage;