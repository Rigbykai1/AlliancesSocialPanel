# AlliancesTech ObsPanel

Panel de administración para gestionar posts de Facebook vinculados a un vault de Obsidian. Permite crear, editar y eliminar posts que se almacenan como archivos `.md` con frontmatter YAML, organizados por año y mes, junto con sus imágenes asociadas.

---

## 📁 Estructura del Proyecto

```
AlliancesSocialPanel/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── UI/                        # Componentes de layout global
│       │   │   ├── NavBar.jsx             # Barra de navegación superior
│       │   │   ├── MainContent.jsx        # Enrutador de vistas principal
│       │   │   └── DrawerSidebar.jsx      # Sidebar lateral con estadísticas
│       │   └── PostsUI/                   # Componentes específicos de posts
│       │       ├── PostForm.jsx           # Formulario de creación de posts
│       │       ├── PostsList.jsx          # Lista de posts con tarjetas
│       │       └── PostModal/             # Modal de detalle/edición
│       │           ├── PostModalIndex.jsx        # Orquestador del modal
│       │           ├── PostModalView.jsx          # Vista de solo lectura
│       │           ├── PostModalEdit.jsx          # Formulario de edición
│       │           ├── PostModalActions.jsx       # Botones de acción
│       │           └── PostModalDeleteConfirm.jsx # Confirmación de borrado
│       ├── hooks/
│       │   ├── usePosts.js                # Estado, carga y acciones de posts
│       │   └── useNotifications.js        # Sistema de notificaciones toast
│       ├── services/
│       │   └── api.js                     # Cliente Axios y endpoints
│       ├── utils/
│       │   └── helpers.js                 # Constantes y funciones auxiliares
│       ├── App.jsx                        # Componente raíz y orquestador
│       └── main.jsx                       # Punto de entrada
│
└── backend/
    ├── routes/
    │   └── posts.js                       # Endpoints REST de posts
    ├── middleware/
    │   └── upload.js                      # Multer para subida de imágenes
    ├── utils/
    │   ├── paths.js                       # Generación de rutas por fecha
    │   ├── markdown.js                    # Parser y generador de archivos .md
    │   └── logger.js                      # Logger de consola
    └── config.js                          # Rutas del vault y configuración
```

---

## 🏗️ Arquitectura

El proyecto sigue una separación clara entre frontend y backend, sin base de datos — el vault de Obsidian actúa como fuente de verdad.

### Frontend

- **Hooks** (`usePosts`, `useNotifications`): toda la lógica de estado, efectos y acciones vive aquí, separada de la UI.
- **Servicios** (`api.js`): único punto de comunicación con el backend vía Axios.
- **Componentes**: divididos en componentes de layout global (`UI/`) y componentes de dominio (`PostsUI/`). El modal está further descompuesto en sub-componentes por responsabilidad.

### Backend

- **Sin base de datos**: los posts son archivos `.md` con frontmatter YAML organizados en `POSTS_PATH/año/mes/`.
- **Imágenes**: se guardan en el vault bajo `Recursos visuales/Posts de Facebook/año/mes/` con nombre canónico derivado de la fecha del post.
- **Sufijos numéricos**: varios posts en la misma fecha generan nombres como `Post 11 abril 2026.md`, `Post 11 abril 2026 1.md`, `Post 11 abril 2026 2.md`, etc.

---

## 📋 Funcionalidades

- ✅ Lista de posts con tarjetas y vista previa
- ✅ Creación de posts con imagen, fecha, tipo de formato y contenido
- ✅ Edición completa desde modal (fecha, tipo, contenido, imagen, publicado)
- ✅ Eliminación con confirmación
- ✅ Soporte para múltiples posts en la misma fecha (sufijos automáticos)
- ✅ Vista previa de imagen antes de subir
- ✅ Notificaciones toast de éxito y error
- ✅ Navegación responsive con drawer lateral

---

## 🚀 Inicio Rápido

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
node index.js
```

Asegúrate de configurar las rutas del vault en `backend/config.js` antes de iniciar.

---

## 🔧 Tecnologías

**Frontend**
- React 18 con Hooks
- Vite
- Tailwind CSS + DaisyUI
- Axios
- react-icons

**Backend**
- Node.js + Express
- Multer (subida de archivos)
- fs-extra
- js-yaml (a través del parser de markdown propio)

---

## 📖 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/posts` | Obtener todos los posts |
| `GET` | `/api/posts/:id` | Obtener un post por ID |
| `POST` | `/api/posts` | Crear nuevo post |
| `PUT` | `/api/posts/:id` | Editar post existente |
| `DELETE` | `/api/posts/:id?fecha=` | Eliminar post |