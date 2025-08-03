import express from 'express';
import { 
  getMovements, 
  getMovementById, 
  createMovement, 
  updateMovement, 
  deleteMovement 
} from '../controllers/movementController';

const router = express.Router();

// GET /api/movements - Obtener todos los movimientos
router.get('/', getMovements);

// GET /api/movements/:id - Obtener movimiento por ID
router.get('/:id', getMovementById);

// POST /api/movements - Crear nuevo movimiento
router.post('/', createMovement);

// PUT /api/movements/:id - Actualizar movimiento
router.put('/:id', updateMovement);

// DELETE /api/movements/:id - Eliminar movimiento permanentemente
router.delete('/:id', deleteMovement);

export default router;
