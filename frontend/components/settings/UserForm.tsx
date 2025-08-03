import React, { useState, FC, useEffect } from 'react';
import type { NewUserData, User } from '../../types';

interface UserFormProps {
  onSave: (data: NewUserData) => void;
  onCancel: () => void;
  userToEdit?: User | null;
}

const UserForm: FC<UserFormProps> = ({ onSave, onCancel, userToEdit }) => {
  const getInitialState = (): NewUserData => ({
    nombre: '',
    email: '',
    rol: 'usuario',
    password: '',
  });

  const [formData, setFormData] = useState<NewUserData>(getInitialState());

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nombre: userToEdit.nombre,
        email: userToEdit.email,
        rol: userToEdit.rol,
        password: '', // Password field is cleared for editing
      });
    } else {
      setFormData(getInitialState());
    }
  }, [userToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar contraseña para usuarios nuevos
    if (!userToEdit && (!formData.password || formData.password.length < 6)) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Validar contraseña para usuarios editados si se proporciona
    if (userToEdit && formData.password && formData.password.length > 0 && formData.password.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    onSave(formData);
  };

  const inputClass = "w-full py-2 px-3 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-300 mb-1">Rol</label>
            <select id="rol" name="rol" value={formData.rol} onChange={handleChange} className={inputClass} required>
                <option key="usuario" value="usuario">Usuario</option>
                <option key="admin" value="admin">Administrador</option>
            </select>
        </div>
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              {userToEdit ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className={inputClass} 
              required={!userToEdit}
              minLength={6}
              placeholder={userToEdit ? 'Dejar en blanco para mantener actual' : 'Mínimo 6 caracteres'}
            />
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

export default UserForm;
