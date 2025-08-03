import React, { useState, FC, useEffect } from 'react';
import type { NewProductData, Category, Product } from '../../types';

interface ProductFormProps {
  categories: Category[];
  onSave: (data: NewProductData) => void;
  onCancel: () => void;
  productToEdit?: Product | null;
}

const ProductForm: FC<ProductFormProps> = ({ categories, onSave, onCancel, productToEdit }) => {
  
  const getInitialState = (): NewProductData => {
    return {
      nombre: '',
      descripcion: '',
      categoriaId: categories[0]?.id || '',
      precio: 0,
      stock: 0,
      stockMinimo: 10,
      codigoBarras: '',
      proveedor: '',
    };
  };

  const [formData, setFormData] = useState<NewProductData>(getInitialState());

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        categoriaId: productToEdit.categoria.id,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        stockMinimo: productToEdit.stockMinimo,
        codigoBarras: productToEdit.codigoBarras,
        proveedor: productToEdit.proveedor,
      });
    } else {
      setFormData(getInitialState());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit, categories]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' || name === 'stockMinimo' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = "w-full py-2 px-3 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre del Producto</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
          <select id="categoriaId" name="categoriaId" value={formData.categoriaId} onChange={handleChange} className={inputClass} required>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
        <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} className={inputClass} rows={3}></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-300 mb-1">Precio</label>
          <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} className={inputClass} required min="0" step="0.01" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
          <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className={inputClass} required min="0" />
        </div>
        <div>
          <label htmlFor="stockMinimo" className="block text-sm font-medium text-gray-300 mb-1">Stock Mínimo</label>
          <input type="number" id="stockMinimo" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange} className={inputClass} required min="0" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="proveedor" className="block text-sm font-medium text-gray-300 mb-1">Proveedor</label>
          <input type="text" id="proveedor" name="proveedor" value={formData.proveedor} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label htmlFor="codigoBarras" className="block text-sm font-medium text-gray-300 mb-1">Código de Barras</label>
          <input type="text" id="codigoBarras" name="codigoBarras" value={formData.codigoBarras} onChange={handleChange} className={inputClass} />
        </div>
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

export default ProductForm;