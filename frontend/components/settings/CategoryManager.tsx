import React, { useState } from 'react';
import type { Category, Product, NewCategoryData } from '../../types';
import Modal from '../ui/Modal';
import ConfirmationModal from '../ui/ConfirmationModal';
import CategoryForm from './CategoryForm';

interface CategoryManagerProps {
  categories: Category[];
  products: Product[];
  onAddCategory: (data: NewCategoryData) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  products,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleOpenAddModal = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleSaveCategory = (formData: NewCategoryData) => {
    if (categoryToEdit) {
      onEditCategory({ ...categoryToEdit, ...formData });
    } else {
      onAddCategory(formData);
    }
    closeModal();
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const isCategoryInUse = (categoryId: string) => {
    return products.some(p => p.categoria.id === categoryId);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={categoryToEdit ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
      >
        <CategoryForm
          onSave={handleSaveCategory}
          onCancel={closeModal}
          categoryToEdit={categoryToEdit}
        />
      </Modal>

      <ConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        confirmText="Eliminar"
        confirmColor="red"
      >
        <p>¿Estás seguro de que quieres eliminar la categoría <strong>{categoryToDelete?.nombre}</strong>?</p>
        <p className="text-sm text-gray-400 mt-2">Esta acción es permanente y no se puede deshacer.</p>
      </ConfirmationModal>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">Gestiona las categorías de tus productos.</p>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>Añadir Categoría
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-sm">
              <tr>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {categories.map((cat, index) => (
                <tr key={cat.id || `category-${index}`} className="hover:bg-gray-700/50">
                  <td className="py-3 px-4 font-medium">{cat.nombre}</td>
                  <td className="py-3 px-4 text-gray-400">{cat.descripcion}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleOpenEditModal(cat)} className="text-blue-400 hover:text-blue-300 mr-4" aria-label={`Editar ${cat.nombre}`}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                      aria-label={`Eliminar ${cat.nombre}`}
                      disabled={isCategoryInUse(cat.id)}
                      title={isCategoryInUse(cat.id) ? 'No se puede eliminar, categoría en uso' : 'Eliminar categoría'}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CategoryManager;
