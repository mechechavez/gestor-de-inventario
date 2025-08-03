import express from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/userController';

const router = express.Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', getUsers);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', getUserById);

// POST /api/users - Crear nuevo usuario
router.post('/', createUser);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', updateUser);

// DELETE /api/users/:id - Eliminar usuario permanentemente
router.delete('/:id', deleteUser);

export default router;
