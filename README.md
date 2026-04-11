# AlliancesTech ObsPanel - Frontend

Aplicación React modularizada para gestión de posts de Obsidian.

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes UI
│   ├── NavBar.jsx       # Barra de navegación
│   ├── PostCard.jsx     # Tarjeta individual de post
│   ├── PostModal.jsx    # Modal de vista previa
│   ├── PostForm.jsx     # Formulario de creación
│   └── PostsList.jsx    # Lista de posts
├── hooks/               # Hooks personalizados
│   └── usePosts.js      # Lógica de estado y acciones
├── services/            # Servicios API
│   └── api.js           # Cliente HTTP y endpoints
├── utils/               # Utilidades
│   └── helpers.js       # Funciones helper (formatFecha, constantes)
├── contexts/            # Contextos React (para futuro uso)
├── App.jsx              # Componente principal
└── main.jsx             # Punto de entrada
```

## 🏗️ Arquitectura

### Componentes
- **Presentacionales**: `PostCard`, `PostModal`, `NavBar`
- **Contenedores**: `PostsList`, `PostForm`
- **Principal**: `App` (orquestador)

### Lógica Separada
- **Hooks**: Manejo de estado y efectos secundarios
- **Servicios**: Comunicación con API
- **Utilidades**: Funciones puras y constantes

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📋 Funcionalidades

- ✅ Lista de posts con vista previa modal
- ✅ Creación de nuevos posts
- ✅ Vista detalle completa
- ✅ Eliminación de posts
- ✅ Navegación responsive
- ✅ Manejo de errores
- ✅ Estados de carga

## 🔧 Tecnologías

- **React 18** con Hooks
- **Vite** para desarrollo
- **Tailwind CSS** + DaisyUI
- **Axios** para HTTP
- **ESLint** para linting

## 📖 API Endpoints

- `GET /api/posts` - Obtener todos los posts
- `POST /api/posts` - Crear nuevo post
- `DELETE /api/posts/:id` - Eliminar post

## 🎯 Mejores Prácticas Implementadas

- **Separación de responsabilidades**: UI, lógica, datos
- **Reutilización**: Componentes modulares
- **Mantenibilidad**: Código organizado por funcionalidad
- **Escalabilidad**: Estructura preparada para crecimiento
- **Testing**: Código preparado para pruebas unitarias