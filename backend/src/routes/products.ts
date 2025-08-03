import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// GET /api/products - Obtener todos los productos
router.get('/', asyncHandler(getProducts));

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', asyncHandler(getProductById));

// POST /api/products - Crear nuevo producto
router.post('/', asyncHandler(createProduct));

// PUT /api/products/:id - Actualizar producto
router.put('/:id', asyncHandler(updateProduct));

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', asyncHandler(deleteProduct));

export default router;
