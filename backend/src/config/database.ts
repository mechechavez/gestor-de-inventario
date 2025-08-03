import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestor_inventario';
    
    console.log('🔄 Intentando conectar a MongoDB (Docker)...');
    console.log('📍 URI:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciales en logs
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // Timeout más largo para Docker
      socketTimeoutMS: 45000,
      family: 4, // Forzar IPv4
    });
    
    console.log('✅ MongoDB connected successfully (Docker)');
    console.log('🗄️  Base de datos:', mongoose.connection.name);
    console.log('🐳 Usando MongoDB en contenedor Docker');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : error);
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
        console.log('💡 Sugerencias:');
        console.log('   1. Ejecuta: docker-compose up -d');
        console.log('   2. Verifica que Docker esté ejecutándose');
        console.log('   3. Espera unos segundos a que MongoDB inicie');
      }
    }
    
    console.log('❌ No se pudo conectar a MongoDB. La aplicación se cerrará.');
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📡 MongoDB connection closed through app termination');
  process.exit(0);
});
