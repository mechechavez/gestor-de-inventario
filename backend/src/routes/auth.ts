import express from 'express';
import { login, register, validateToken } from '../controllers/authController';

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// GET /api/auth/validate - Validar token JWT
router.get('/validate', validateToken);

export default router;
