import mongoose, { Schema, Document } from 'mongoose';

export interface CategoryDocument extends Document {
  nombre: string;
  descripcion: string;
  activo: boolean;
}

const CategorySchema = new Schema<CategoryDocument>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    unique: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<CategoryDocument>('Category', CategorySchema);
