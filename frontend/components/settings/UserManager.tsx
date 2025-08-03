import React, { useState } from 'react';
import type { User, NewUserData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../ui/Modal';
import ConfirmationModal from '../ui/ConfirmationModal';
import UserForm from './UserForm';

const UserManager: React.FC = () => {
  const { users, currentUser, addUser, editUser, deleteUser } = useAuth();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleOpenAddModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleSaveUser = (formData: NewUserData) => {
    if (userToEdit) {
      // Si se está editando y la contraseña está vacía, no incluirla en la actualización
      if (!formData.password || formData.password.trim() === '') {
        const { password, ...userProps } = formData;
        editUser({ ...userToEdit, ...userProps });
      } else {
        // Si hay una nueva contraseña, crear objeto User sin la contraseña para el contexto
        const { password, ...userProps } = formData;
        editUser({ ...userToEdit, ...userProps });
        // Aquí podrías hacer una llamada al backend para actualizar la contraseña si fuera necesario
        showToast("Contraseña actualizada (simulado en frontend).", 'info');
      }
    } else {
      if (!formData.password) {
        showToast("La contraseña es obligatoria para nuevos usuarios.", 'error');
        return;
      }
      addUser(formData);
    }
    closeModal();
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      // Validación adicional de seguridad
      if (userToDelete.id === currentUser?.id) {
        showToast("No puedes eliminarte a ti mismo", 'error');
        setUserToDelete(null);
        return;
      }
      
      // Validación para el administrador principal
      if (userToDelete.email === 'admin@utm.edu.ec') {
        showToast("No se puede eliminar el usuario administrador principal del sistema", 'error');
        setUserToDelete(null);
        return;
      }
      
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={userToEdit ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
      >
        <UserForm
          onSave={handleSaveUser}
          onCancel={closeModal}
          userToEdit={userToEdit}
        />
      </Modal>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        confirmText="Eliminar"
        confirmColor="red"
      >
        <p>¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete?.nombre}</strong>?</p>
        <p className="text-sm text-gray-400 mt-2">Esta acción es permanente y no se puede deshacer.</p>
      </ConfirmationModal>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300">Gestiona los usuarios y sus roles en el sistema.</p>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>Añadir Usuario
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-sm">
              <tr>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-700/50">
                  <td className="py-3 px-4 font-medium">{user.nombre}</td>
                  <td className="py-3 px-4 text-gray-400">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.rol}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => handleOpenEditModal(user)} className="text-blue-400 hover:text-blue-300 mr-4" aria-label={`Editar ${user.nombre}`}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                      aria-label={`Eliminar ${user.nombre}`}
                      disabled={user.id === currentUser?.id || user.email === 'admin@utm.edu.ec'}
                      title={
                        user.id === currentUser?.id 
                          ? 'No puedes eliminarte a ti mismo' 
                          : user.email === 'admin@utm.edu.ec'
                          ? 'No se puede eliminar el administrador principal'
                          : 'Eliminar usuario'
                      }
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

export default UserManager;