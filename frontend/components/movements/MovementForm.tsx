import React, { useState, FC, useEffect } from 'react';
import type { NewMovementData, Product } from '../../types';
import { useToast } from '../../context/ToastContext';

interface MovementFormProps {
  products: Product[];
  onSave: (data: NewMovementData) => void;
  onCancel: () => void;
}

const MovementForm: FC<MovementFormProps> = ({ products, onSave, onCancel }) => {
  const { showToast } = useToast();
  
  const getInitialState = (): NewMovementData => ({
    productoId: products[0]?.id || '',
    tipo: 'salida',
    cantidad: 1,
    motivo: '',
    responsable: 'Admin',
  });

  const [formData, setFormData] = useState<NewMovementData>(getInitialState());
  const [selectedProductStock, setSelectedProductStock] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (formData.productoId) {
      const product = products.find(p => p.id === formData.productoId);
      setSelectedProductStock(product?.stock);
    } else {
      setSelectedProductStock(undefined);
    }
  }, [formData.productoId, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cantidad <= 0) {
      showToast("La cantidad debe ser mayor que cero.", 'error');
      return;
    }
    if (!formData.motivo.trim()) {
      showToast("El motivo es obligatorio.", 'error');
      return;
    }
    onSave(formData);
  };

  const inputClass = "w-full py-2 px-3 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="productoId" className="block text-sm font-medium text-gray-300 mb-1">Producto</label>
        <select id="productoId" name="productoId" value={formData.productoId} onChange={handleChange} className={inputClass} required>
          <option key="default" value="" disabled>Seleccione un producto...</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        {selectedProductStock !== undefined && (
          <p className="text-xs text-gray-400 mt-1">Stock actual: <span className="font-bold">{selectedProductStock}</span></p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Movimiento</label>
          <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} className={inputClass} required>
            <option key="salida" value="salida">Salida</option>
            <option key="entrada" value="entrada">Entrada</option>
          </select>
        </div>
        <div>
          <label htmlFor="cantidad" className="block text-sm font-medium text-gray-300 mb-1">Cantidad</label>
          <input type="number" id="cantidad" name="cantidad" value={formData.cantidad} onChange={handleChange} className={inputClass} required min="1" />
        </div>
      </div>
      
      <div>
        <label htmlFor="motivo" className="block text-sm font-medium text-gray-300 mb-1">Motivo</label>
        <input type="text" id="motivo" name="motivo" value={formData.motivo} onChange={handleChange} className={inputClass} required placeholder="Ej: Venta, Ajuste de inventario, etc." />
      </div>
      
      <div>
        <label htmlFor="responsable" className="block text-sm font-medium text-gray-300 mb-1">Responsable</label>
        <input type="text" id="responsable" name="responsable" value={formData.responsable} onChange={handleChange} className={inputClass} required />
      </div>

      <div className="flex justify-end pt-4 space-x-3">
        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200">
          Cancelar
        </button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200">
          Registrar Movimiento
        </button>
      </div>
    </form>
  );
};

export default MovementForm;