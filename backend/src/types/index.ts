export interface User {
  _id?: string;
  id?: string;
  nombre: string;
  email: string;
  password?: string;
  rol: 'admin' | 'usuario';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  id?: string;
  nombre: string;
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  _id?: string;
  id?: string;
  nombre: string;
  descripcion: string;
  categoria: Category | string;
  precio: number;
  stock: number;
  stockMinimo: number;
  codigoBarras: string;
  proveedor: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Movement {
  _id?: string;
  id?: string;
  producto: Product | string;
  productoNombre: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  responsable: string;
  motivo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export type NewUserData = Omit<User, '_id' | 'id' | 'createdAt' | 'updatedAt'>;
export type NewCategoryData = Omit<Category, '_id' | 'id' | 'createdAt' | 'updatedAt'>;
export type NewProductData = Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt' | 'activo'>;
export type NewMovementData = Omit<Movement, '_id' | 'id' | 'createdAt' | 'updatedAt' | 'productoNombre'>;
