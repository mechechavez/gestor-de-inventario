import { Request, Response } from 'express';
import Movement from '../models/Movement';
import Product from '../models/Product';

export const getMovements = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const movements = await Movement.find()
      .populate('producto', 'nombre descripcion')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Movement.countDocuments();

    return res.json({
      success: true,
      data: movements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting movements:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener movimientos'
    });
  }
};

export const getMovementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const movement = await Movement.findById(id).populate('producto');
    
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    return res.json({
      success: true,
      data: movement
    });
  } catch (error) {
    console.error('Error getting movement:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener movimiento'
    });
  }
};

export const createMovement = async (req: Request, res: Response) => {
  try {
    const movementData = req.body;
    
    // Verificar que el producto existe
    // El frontend envía productoId, así que lo mapeamos a producto
    const productId = movementData.productoId || movementData.producto;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Mapear los campos del frontend al esquema del backend
    const newMovementData = {
      producto: productId,
      tipo: movementData.tipo,
      cantidad: movementData.cantidad,
      motivo: movementData.motivo || 'Movimiento de inventario',
      usuario: movementData.responsable || movementData.usuario || 'Admin',
      fecha: new Date(),
      notas: movementData.notas
    };

    const newMovement = new Movement(newMovementData);
    await newMovement.save();
    
    // Actualizar el stock del producto
    if (newMovementData.tipo === 'entrada') {
      product.stock += newMovementData.cantidad;
    } else {
      if (product.stock < newMovementData.cantidad) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuficiente para realizar la salida'
        });
      }
      product.stock -= newMovementData.cantidad;
    }
    
    await product.save();
    
    // Populate para devolver los datos completos
    await newMovement.populate('producto');
    
    return res.status(201).json({
      success: true,
      data: newMovement,
      message: 'Movimiento creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating movement:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear movimiento'
    });
  }
};

export const updateMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Obtener el movimiento original
    const originalMovement = await Movement.findById(id);
    if (!originalMovement) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    // Obtener el producto
    const product = await Product.findById(originalMovement.producto);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Revertir el movimiento original
    if (originalMovement.tipo === 'entrada') {
      product.stock -= originalMovement.cantidad;
    } else {
      product.stock += originalMovement.cantidad;
    }

    // Aplicar el nuevo movimiento
    if (updateData.tipo === 'entrada') {
      product.stock += updateData.cantidad;
    } else {
      if (product.stock < updateData.cantidad) {
        return res.status(400).json({
          success: false,
          message: 'Stock insuficiente para realizar la salida'
        });
      }
      product.stock -= updateData.cantidad;
    }

    await product.save();

    const updatedMovement = await Movement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('producto');

    return res.json({
      success: true,
      data: updatedMovement,
      message: 'Movimiento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating movement:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar movimiento'
    });
  }
};

export const deleteMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Obtener el movimiento antes de eliminarlo
    const movement = await Movement.findById(id);
    if (!movement) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }

    // Obtener el producto y revertir el movimiento
    const product = await Product.findById(movement.producto);
    if (product) {
      if (movement.tipo === 'entrada') {
        product.stock -= movement.cantidad;
      } else {
        product.stock += movement.cantidad;
      }
      await product.save();
    }

    // Eliminar permanentemente el movimiento
    await Movement.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: 'Movimiento eliminado permanentemente'
    });
  } catch (error) {
    console.error('Error deleting movement:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar movimiento'
    });
  }
};
