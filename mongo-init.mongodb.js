// Script de inicialización para MongoDB
// Se ejecuta automáticamente cuando se crea el contenedor por primera vez

// Crear la base de datos y usuario
db = db.getSiblingDB('gestor_inventario');

// Crear usuario para la aplicación
db.createUser({
  user: 'gestor_user',
  pwd: 'gestor_password',
  roles: [
    {
      role: 'readWrite',
      db: 'gestor_inventario'
    }
  ]
});

// Crear colecciones básicas
db.createCollection('products');
db.createCollection('categories');
db.createCollection('movements');
db.createCollection('users');

// Insertar datos iniciales
db.categories.insertMany([
  {
    nombre: 'Electrónicos',
    descripcion: 'Productos electrónicos y tecnológicos',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Oficina',
    descripcion: 'Productos de oficina y papelería',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Herramientas',
    descripcion: 'Herramientas y equipos de trabajo',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Obtener IDs de categorías
const electronicos = db.categories.findOne({nombre: 'Electrónicos'});
const oficina = db.categories.findOne({nombre: 'Oficina'});

// Insertar productos iniciales
db.products.insertMany([
  {
    nombre: 'Laptop Dell Inspiron 15',
    descripcion: 'Laptop para uso profesional con procesador Intel i7',
    codigoBarras: 'DELL-LAP-001',
    categoria: electronicos._id,
    precio: 15000,
    stock: 25,
    stockMinimo: 5,
    proveedor: 'Dell México',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Mouse Logitech MX Master',
    descripcion: 'Mouse inalámbrico profesional ergonómico',
    codigoBarras: 'LOG-MOU-002',
    categoria: electronicos._id,
    precio: 800,
    stock: 50,
    stockMinimo: 10,
    proveedor: 'Logitech',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Papel Bond A4 500 hojas',
    descripcion: 'Resma de papel bond blanco tamaño carta',
    codigoBarras: 'PAP-BON-003',
    categoria: oficina._id,
    precio: 120,
    stock: 2,
    stockMinimo: 10,
    proveedor: 'Papelería Corp',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nombre: 'Teclado Mecánico RGB',
    descripcion: 'Teclado mecánico gaming con retroiluminación RGB',
    codigoBarras: 'TEC-RGB-004',
    categoria: electronicos._id,
    precio: 1200,
    stock: 15,
    stockMinimo: 5,
    proveedor: 'Gaming Gear',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Crear usuario administrador
db.users.insertOne({
  nombre: 'Administrador',
  email: 'admin@utm.edu.ec',
  password: '$2a$10$wf2PB9sllunOs.i91uzjcOn.pwEPS7K.Vl8JCGsRhCYwKaScS3VHa', // admin123
  rol: 'admin',
  activo: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ Base de datos inicializada correctamente');
print('📊 Productos creados: ' + db.products.countDocuments());
print('📂 Categorías creadas: ' + db.categories.countDocuments());
print('👤 Usuarios creados: ' + db.users.countDocuments());
