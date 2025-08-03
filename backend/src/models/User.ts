import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  nombre: string;
  email: string;
  password: string;
  rol: 'admin' | 'usuario';
  activo: boolean;
}

const UserSchema = new Schema<UserDocument>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<UserDocument>('User', UserSchema);
