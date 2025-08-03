import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, NewUserData } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (userData: NewUserData) => Promise<void>;
  editUser: (updatedUser: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  loadUsers: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado y validar la sesión
    const token = localStorage.getItem('authToken');
    if (token) {
      validateSession(token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cargar usuarios cuando hay un usuario autenticado
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  const validateSession = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentUser(data.data.user);
        }
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error validating session:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      if (data.success) {
        const userWithId = {
          ...data.data.user,
          id: data.data.user._id // Convertir _id a id para compatibilidad
        };
        setCurrentUser(userWithId);
        localStorage.setItem('authToken', data.data.token);
        showToast(`Bienvenido de nuevo, ${userWithId.nombre}!`, 'success');
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast('Error de conexión: Backend no disponible', 'error');
        throw new Error('Backend no disponible. Por favor, inicia el servidor.');
      } else {
        showToast('Credenciales inválidas.', 'error');
        throw new Error('Credenciales inválidas.');
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    showToast('Has cerrado sesión.', 'info');
  };

  const addUser = async (userData: NewUserData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(`Usuario "${data.data.nombre}" creado exitosamente.`, 'success');
        // Recargar lista de usuarios
        await loadUsers();
      } else {
        showToast('Error al crear usuario', 'error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('Error al crear usuario', 'error');
    }
  };

  const editUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(`Usuario "${data.data.nombre}" actualizado exitosamente.`, 'success');
        // Actualizar usuario actual si es el mismo
        if (currentUser?.id === updatedUser.id) {
          setCurrentUser(data.data);
        }
        // Recargar lista de usuarios
        await loadUsers();
      } else {
        showToast('Error al actualizar usuario', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Error al actualizar usuario', 'error');
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      showToast("No puedes eliminarte a ti mismo.", 'error');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        showToast(`Usuario eliminado exitosamente.`, 'success');
        // Recargar lista de usuarios
        await loadUsers();
      } else {
        showToast('Error al eliminar usuario', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error al eliminar usuario', 'error');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      
      if (data.success) {
        // Convertir _id a id para compatibilidad
        const usersWithId = data.data.map((user: any) => ({
          ...user,
          id: user._id
        }));
        setUsers(usersWithId);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Error al cargar usuarios', 'error');
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, users, login, logout, addUser, editUser, deleteUser, loadUsers, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};