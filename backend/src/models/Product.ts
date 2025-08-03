import mongoose, { Schema, Document } from 'mongoose';

export interface ProductDocument extends Document {
  nombre: string;
  descripcion: string;
  categoria: mongoose.Types.ObjectId;
  precio: number;
  stock: number;
  stockMinimo: number;
  codigoBarras: string;
  proveedor: string;
  activo: boolean;
}

const ProductSchema = new Schema<ProductDocument>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio debe ser mayor a 0']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo']
  },
  stockMinimo: {
    type: Number,
    required: [true, 'El stock mínimo es requerido'],
    min: [0, 'El stock mínimo no puede ser negativo']
  },
  codigoBarras: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  proveedor: {
    type: String,
    trim: true,
    maxlength: [100, 'El proveedor no puede exceder 100 caracteres']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indices para mejorar performance
ProductSchema.index({ nombre: 'text', descripcion: 'text' });
ProductSchema.index({ categoria: 1 });
ProductSchema.index({ activo: 1 });
ProductSchema.index({ stock: 1 });

// Virtual para verificar si está en stock bajo
ProductSchema.virtual('isLowStock').get(function(this: ProductDocument) {
  return this.stock <= this.stockMinimo;
});

// Middleware pre-save para validaciones adicionales
ProductSchema.pre('save', function(this: ProductDocument, next) {
  if (this.stock < 0) {
    next(new Error('El stock no puede ser negativo'));
  }
  next();
});

export default mongoose.model<ProductDocument>('Product', ProductSchema);
