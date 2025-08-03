import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query = {
        $or: [
          { nombre: { $regex: search, $options: 'i' } },
          { descripcion: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query)
      .populate('categoria')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id).populate('categoria');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error getting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener producto'
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    
    const newProduct = new Product(productData);
    await newProduct.save();
    
    // Populate para devolver los datos completos
    await newProduct.populate('categoria');
    
    return res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear producto'
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('categoria');
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      data: updatedProduct,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar producto'
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Producto eliminado permanentemente'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar producto'
    });
  }
};
