import { useMemo, useState, useEffect } from 'react'
import PostCard from './PostCard'
import PostModal from './PostModal/PostModal'
import { PiArrowsClockwise } from "react-icons/pi"
import { usePostActions } from '../../hooks/usePosts'
import { useNotifications } from '../../hooks/useNotifications'
import { postsApi } from '../../services/api'
import { tiposFormato } from '../../utils/helpers'

const isPostPublished = (post) => {
  const value = post['Publicado']
  return value === true || value === 'true' || value === '1' || value === 1
}

const FILTERS_STORAGE_KEY = 'postsListFilters'

const loadFiltersFromStorage = () => {
  try {
    const saved = localStorage.getItem(FILTERS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch (err) {
    console.error('Error loading filters from storage:', err)
    return null
  }
}

const saveFiltersToStorage = (filters) => {
  try {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters))
  } catch (err) {
    console.error('Error saving filters to storage:', err)
  }
}

export default function PostsList({ posts, onRefresh, setError, onNavigate }) {
  const savedFilters = loadFiltersFromStorage()
  
  const [selectedPost, setSelectedPost] = useState(null)
  const [createDate, setCreateDate] = useState('')
  const [searchQuery, setSearchQuery] = useState(savedFilters?.searchQuery || '')
  const [statusFilter, setStatusFilter] = useState(savedFilters?.statusFilter || 'all')
  const [tipoFilter, setTipoFilter] = useState(savedFilters?.tipoFilter || 'all')
  const [dateFilter, setDateFilter] = useState(savedFilters?.dateFilter || '')
  const { handleDeletePost, handleUpdatePost } = usePostActions(onRefresh, setError)
  const { notifySuccess } = useNotifications()

  // Guardar filtros en localStorage cada vez que cambien
  useEffect(() => {
    const filters = {
      searchQuery,
      statusFilter,
      tipoFilter,
      dateFilter
    }
    saveFiltersToStorage(filters)
  }, [searchQuery, statusFilter, tipoFilter, dateFilter])

  const openPostModal = (post) => {
    setSelectedPost(post)
  }

  const closePostModal = () => {
    const dialog = document.getElementById('my_modal_2')
    if (dialog) dialog.close()
    setSelectedPost(null)
  }

  const handleUpdate = async (id, formData) => {
    await handleUpdatePost(id, formData)
    closePostModal()
  }

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return posts.filter((post) => {
      const nombre = String(post.nombre || post.titulo || '').toLowerCase()
      const contenido = String(post.contenido || post['Contenido'] || '').toLowerCase()
      const tipo = String(post['Tipo de formato'] || '').toLowerCase()
      const fecha = String(post['Fecha de publicación'] || '').toLowerCase()
      const publicado = isPostPublished(post)

      if (statusFilter === 'published' && !publicado) return false
      if (statusFilter === 'pending' && publicado) return false
      if (tipoFilter !== 'all' && tipo !== tipoFilter.toLowerCase()) return false
      if (dateFilter && fecha !== dateFilter) return false
      if (!query) return true

      return (
        nombre.includes(query) ||
        contenido.includes(query) ||
        tipo.includes(query) ||
        fecha.includes(query)
      )
    })
  }, [posts, searchQuery, statusFilter, tipoFilter, dateFilter])

  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setTipoFilter('all')
    setDateFilter('')
    localStorage.removeItem(FILTERS_STORAGE_KEY)
  }

  const handleCreateDateChange = (e) => {
    const val = e.target.value
    setCreateDate(val)
    onNavigate('create', null, { initialFecha: val })
  }

  return (
    <div>
      <PostModal
        post={selectedPost}
        onClose={closePostModal}
        onDelete={handleDeletePost}
        onUpdate={handleUpdate}
        onTogglePublished={(post) => {
          const wasPublished = isPostPublished(post)
          const newPublished = !wasPublished
          
          // Notificar si pasa de pendiente a publicado
          if (!wasPublished && newPublished) {
            notifySuccess(`¡Post "${post.nombre.replace('.md', '')}" publicado! 🎉`)
          }
          
          handleUpdate(post.id, { ...post, publicado: newPublished, 'Publicado': newPublished })
        }}
      />

      <div className="flex flex-col gap-4 bg-base-200 px-4 py-6 my-3 rounded-box shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={onRefresh}
            title="Actualizar"
            className="btn btn-outline w-full sm:w-auto"
          >
            <PiArrowsClockwise className='size-5' />
            Refrescar
          </button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex flex-col gap-1 text-sm">
              Fecha para crear post
              <input
                type="date"
                className="input input-bordered w-full"
                value={createDate}
                onChange={handleCreateDateChange}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre, contenido, tipo o fecha..."
            className="input input-bordered col-span-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicado</option>
            <option value="pending">Pendiente</option>
          </select>

          <select
            className="select select-bordered"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            {tiposFormato.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          <div className="flex items-end gap-2">
            <input
              type="date"
              className="input input-bordered w-full"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetFilters}
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-base-content/70">
          <p>
            Mostrando {filteredPosts.length} de {posts.length} posts
          </p>
          {searchQuery || statusFilter !== 'all' || tipoFilter !== 'all' || dateFilter ? (
            <p className="text-info">Filtros activos</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={openPostModal}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-base-content/70">
            No se encontraron posts con esos filtros.
          </div>
        )}
      </div>
    </div>
  )
}
