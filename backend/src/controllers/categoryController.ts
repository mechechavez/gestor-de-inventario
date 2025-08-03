import { Request, Response } from 'express';
import Category from '../models/Category';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ nombre: 1 });
    
    return res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener categorías'
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error getting category:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener categoría'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    
    const newCategory = new Category(categoryData);
    await newCategory.save();
    
    return res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Categoría creada exitosamente'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al crear categoría'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.json({
      success: true,
      data: updatedCategory,
      message: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Hard delete - eliminar permanentemente
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    return res.json({
      success: true,
      message: 'Categoría eliminada permanentemente'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría'
    });
  }
};
