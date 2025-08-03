# 📦 Gestor de Inventario UTM

Sistema completo de gestión de inventario desarrollado como proyecto académico para la materia de Diseño de Sistemas Informáticos de la Facultad de Ciencias Informáticas - Universidad Técnica de Manabí.

## 🏗️ Arquitectura del Proyecto

```
gestor-de-inventario/
├── frontend/          # Aplicación React + TypeScript
│   ├── components/    # Componentes React reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── context/       # Context API para estado global
│   ├── utils/         # Utilidades y helpers
│   └── types.ts       # Tipos TypeScript compartidos
├── backend/           # API REST con Node.js + TypeScript
│   ├── src/
│   │   ├── config/    # Configuración de DB y servicios
│   │   ├── controllers/ # Controladores de rutas
│   │   ├── models/    # Modelos MongoDB con Mongoose
│   │   ├── routes/    # Rutas de la API REST
│   │   ├── middleware/ # Middleware personalizado
│   │   └── types/     # Tipos TypeScript del backend
│   └── package.json
├── docker-compose.yml # Orquestación de contenedores
├── mongo-init.mongodb.js # Script de inicialización de BD
└── README.md
```

## 🚀 Tecnologías

### Frontend
- **React 19.1.0** con **TypeScript**
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS
- **React Router DOM** - Navegación
- **Context API** - Gestión de estado global

### Backend
- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **MongoDB 7.0** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación y autorización
- **bcrypt** - Encriptación de contraseñas
- **Docker** - Contenedores para MongoDB

## 📋 Características

- ✅ **Gestión completa de productos** (CRUD)
- ✅ **Sistema de categorías**
- ✅ **Control de movimientos** (entradas/salidas)
- ✅ **Dashboard con métricas**
- ✅ **Reportes y estadísticas**
- ✅ **Sistema de usuarios y roles**
- ✅ **Alertas de stock bajo**
- ✅ **Exportación de datos**
- ✅ **Interfaz responsive**

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- Docker y Docker Compose
- Git

### 🚀 Instalación Rápida

#### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd gestor-de-inventario
```

#### 2. Iniciar MongoDB con Docker
```bash
docker-compose up -d
# MongoDB: http://localhost:27017
# Mongo Express: http://localhost:8081
```

#### 3. Configurar y ejecutar Backend
```bash
cd backend
npm install
npm run dev
# API corriendo en http://localhost:5000
```

#### 4. Configurar y ejecutar Frontend
```bash
cd frontend
npm install
npm run dev
# App corriendo en http://localhost:5173
```

### 🔧 Configuración Manual

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
# Editar .env.local si es necesario
npm run dev
```

## 🏃‍♂️ Ejecución

### 🐳 Con Docker (Recomendado)

```bash
# Iniciar servicios de base de datos
docker-compose up -d

# Ejecutar backend
cd backend && npm run dev

# Ejecutar frontend  
cd frontend && npm run dev
```

### 💻 Desarrollo Local

1. **Iniciar MongoDB:**
   ```bash
   docker-compose up -d mongodb
   # MongoDB en http://localhost:27017
   # Mongo Express en http://localhost:8081
   ```

2. **Iniciar Backend:**
   ```bash
   cd backend
   npm run dev
   # API en http://localhost:5000
   # Health check: http://localhost:5000/health
   ```

3. **Iniciar Frontend:**
   ```bash
   cd frontend
   npm run dev
   # App en http://localhost:5173
   ```

### Producción

1. **Backend:**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

## 🔧 Configuración

### 🐳 Docker Services

El proyecto incluye `docker-compose.yml` con:
- **MongoDB 7.0** - Base de datos principal
- **Mongo Express** - Interfaz web para administrar MongoDB

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs mongodb

# Detener servicios
docker-compose down
```

### Variables de Entorno

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://admin:admin123@localhost:27017/gestor_inventario?authSource=gestor_inventario
JWT_SECRET=tu_jwt_secret_muy_seguro
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

### 👤 Usuario por Defecto

```
Email: admin@utm.edu.ec
Password: admin123
Rol: Administrador
```

## 📊 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |

### Categorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |
| PUT | `/api/categories/:id` | Actualizar categoría |
| DELETE | `/api/categories/:id` | Eliminar categoría |

### Movimientos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/movements` | Listar movimientos |
| POST | `/api/movements` | Registrar movimiento |

### Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |

## 🎯 Funcionalidades Principales

### Dashboard
- Métricas en tiempo real
- Productos con stock bajo
- Movimientos recientes
- Estadísticas de inventario

### Gestión de Productos
- CRUD completo con validaciones
- Categorización avanzada
- Control de stock en tiempo real
- Códigos de barras únicos
- Gestión de proveedores

### Reportes
- Resumen completo de inventario
- Análisis de valor por categoría
- Alertas de stock bajo
- Exportación de datos a CSV

### Sistema de Usuarios
- Roles diferenciados (admin/usuario)
- Autenticación JWT segura
- Gestión completa de permisos
- Sesiones persistentes

## 🔐 Seguridad

- **Autenticación JWT** con tokens seguros
- **Encriptación bcrypt** para contraseñas
- **Validación de datos** en frontend y backend
- **CORS configurado** para APIs
- **Headers de seguridad** implementados
- **Variables de entorno** para datos sensibles

## 🐳 Docker

### Servicios Incluidos
```yaml
# docker-compose.yml
services:
  mongodb:     # MongoDB 7.0 en puerto 27017
  mongo-express: # Admin web en puerto 8081
```

### Comandos Útiles
```bash
# Iniciar servicios
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f mongodb

# Reiniciar servicios
docker-compose restart

# Limpiar todo
docker-compose down -v
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Estado del Proyecto

✅ **COMPLETAMENTE FUNCIONAL** - Sistema de inventario en producción

### ✅ Características Implementadas
- [x] **Frontend React + TypeScript** optimizado
- [x] **Backend Node.js + Express** robusto
- [x] **Base de datos MongoDB** con Docker
- [x] **Autenticación JWT** completa
- [x] **CRUD productos y categorías** funcional
- [x] **Sistema de movimientos** implementado
- [x] **Dashboard con métricas** en tiempo real
- [x] **Reportes y exportación** operativos
- [x] **Interfaz responsive** optimizada
- [x] **Configuraciones de desarrollo** listas

### 🔧 Optimizaciones Recientes
- [x] **Docker Compose** para MongoDB
- [x] **Scripts de inicialización** de base de datos
- [x] **Configuraciones TypeScript** optimizadas
- [x] **ESLint rules** ajustadas para desarrollo
- [x] **Estructura de archivos** limpia y organizada

### �️ Desarrollo Local

```bash
# Clonar tu fork
git clone https://github.com/tu-usuario/gestor-de-inventario.git
cd gestor-de-inventario

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# Iniciar servicios
docker-compose up -d
cd backend && npm run dev &
cd frontend && npm run dev
```

---

### 🏆 Proyecto Académico - Universidad Técnica de Manabí

**Sistema de Gestión de Inventario** desarrollado para la materia de **Diseño de Sistemas Informáticos** de la **Facultad de Ciencias Informáticas**. Implementado con las mejores prácticas y tecnologías modernas: Docker, MongoDB, React y Node.js.

#### 🎓 Información Académica
- **Universidad:** Universidad Técnica de Manabí (UTM)
- **Facultad:** Ciencias Informáticas  
- **Materia:** Diseño de Sistemas Informáticos
- **Tecnologías:** React, Node.js, MongoDB, Docker, TypeScript
- **Integrantes:** Mercedes Carmen Chavez Hidalgo - Jaime David Cevallos Rivera - Fernando Guillermo Garay Delgado
