import mongoose, { Schema, Document } from 'mongoose';

export interface MovementDocument extends Document {
  producto: mongoose.Types.ObjectId;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  motivo: string;
  usuario: string;
  fecha: Date;
  notas?: string;
}

const MovementSchema = new Schema<MovementDocument>({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es requerido']
  },
  tipo: {
    type: String,
    enum: ['entrada', 'salida'],
    required: [true, 'El tipo de movimiento es requerido']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
    min: [1, 'La cantidad debe ser mayor a 0']
  },
  motivo: {
    type: String,
    required: [true, 'El motivo es requerido'],
    trim: true,
    maxlength: [100, 'El motivo no puede exceder 100 caracteres']
  },
  usuario: {
    type: String,
    required: [true, 'El usuario es requerido'],
    trim: true,
    maxlength: [50, 'El usuario no puede exceder 50 caracteres']
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  notas: {
    type: String,
    trim: true,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  }
}, {
  timestamps: true
});

export default mongoose.model<MovementDocument>('Movement', MovementSchema);
