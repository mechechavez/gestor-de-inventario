export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
}

export type NewUserData = Omit<User, 'id'> & { password?: string };

export interface Category {
  id: string;
  nombre: string;
  descripcion: string;
}

export type NewCategoryData = Omit<Category, 'id'>;

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: Category;
  precio: number;
  stock: number;
  stockMinimo: number;
  codigoBarras: string;
  proveedor: string;
  activo: boolean;
  createdAt: string;
}

export type NewProductData = Omit<Product, 'id' | 'createdAt' | 'activo' | 'categoria'> & {
  categoriaId: string;
};

export interface Movement {
  id: string;
  producto: {
    _id: string;
    nombre: string;
    descripcion: string;
    id: string;
  };
  tipo: 'entrada' | 'salida';
  cantidad: number;
  motivo: string;
  usuario: string;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

export type NewMovementData = {
  productoId: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  motivo: string;
  responsable: string;
};

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
