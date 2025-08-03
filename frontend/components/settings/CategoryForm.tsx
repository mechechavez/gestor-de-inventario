import React, { useState, FC, useEffect } from 'react';
import type { NewCategoryData, Category } from '../../types';

interface CategoryFormProps {
  onSave: (data: NewCategoryData) => void;
  onCancel: () => void;
  categoryToEdit?: Category | null;
}

const CategoryForm: FC<CategoryFormProps> = ({ onSave, onCancel, categoryToEdit }) => {
  const getInitialState = (): NewCategoryData => ({
    nombre: '',
    descripcion: '',
  });

  const [formData, setFormData] = useState<NewCategoryData>(getInitialState());

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        nombre: categoryToEdit.nombre,
        descripcion: categoryToEdit.descripcion,
      });
    } else {
      setFormData(getInitialState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = "w-full py-2 px-3 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre de la Categoría</label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputClass} required />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} className={inputClass} rows={3} required></textarea>
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200">
          Cancelar
        </button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200">
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
