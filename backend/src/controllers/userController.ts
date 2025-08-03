import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password') // No incluir la contraseña
      .sort({ nombre: 1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
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
      message: 'Usuario creado exitosamente'
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Si se está actualizando la contraseña, validar y encriptarla
    if (updateData.password) {
      if (updateData.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
      success: true,
      data: updatedUser,
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle duplicate email error
    if ((error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese email'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario'
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe antes de intentar eliminarlo
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Validación de seguridad: No permitir que un usuario se elimine a sí mismo
    // Nota: En un sistema real con autenticación, aquí verificarías el token JWT
    // Por ahora, validamos que no se pueda eliminar el usuario admin principal
    if (userToDelete.email === 'admin@utm.edu.ec') {
      return res.status(403).json({
        success: false,
        message: 'No se puede eliminar el usuario administrador principal del sistema'
      });
    }
    
    // Eliminar permanentemente el usuario
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Error al eliminar usuario'
      });
    }

    return res.json({
      success: true,
      message: 'Usuario eliminado permanentemente'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    });
  }
};
