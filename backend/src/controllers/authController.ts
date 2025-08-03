import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validar que se proporcionen email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar que el usuario esté activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        rol: user.rol 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Remover la contraseña de la respuesta
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login exitoso'
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    
    // Validar contraseña antes de encriptar
    if (!userData.password || userData.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }
    
    // Encriptar la contraseña
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    
    const newUser = new User(userData);
    await newUser.save();
    
    // Remover la contraseña de la respuesta
    const userResponse = newUser.toObject();
    const { password, ...userWithoutPassword } = userResponse;
    
    return res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle duplicate email error
    if ((error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese email'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al crear usuario'
    });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
      
      // Buscar el usuario para verificar que aún existe y está activo
      const user = await User.findById(decoded.userId);
      if (!user || !user.activo) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no válido o desactivado'
        });
      }

      // Remover la contraseña de la respuesta
      const userResponse = user.toObject();
      const { password: _, ...userWithoutPassword } = userResponse;

      return res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        },
        message: 'Token válido'
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  } catch (error) {
    console.error('Error in validateToken:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
