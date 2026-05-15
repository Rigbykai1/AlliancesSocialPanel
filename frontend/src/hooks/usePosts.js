import { useState, useEffect, useCallback } from 'react'
import { postsApi } from '../services/api'
import { formatDateLabel } from '../utils/date'
import { useApi } from './useApi'

const getIndicePorFecha = (posts, fecha, excludeId = null) => {
  return posts.filter(p => {
    const postFecha = p['Fecha de publicación'] || p.fecha || ''
    const mismaFecha = postFecha === fecha
    const noEsElMismo = excludeId ? p.id !== excludeId : true
    return mismaFecha && noEsElMismo
  }).length
}

// ─────────────────────────────────────────────
export const usePosts = (onError) => {
  const [posts, setPosts] = useState([])
  const { loading, error, setError, execute } = useApi({ onError })

  const cargarPosts = useCallback(async () => {
    return execute(async () => {
      const response = await postsApi.getAll()
      setPosts(response.data)
      return response
    })
  }, [execute])

  useEffect(() => {
    cargarPosts()
  }, [cargarPosts])

  return { posts, loading, error, cargarPosts, setError }
}

// ─────────────────────────────────────────────
export const usePostActions = (cargarPosts, setError, posts) => {  // 👈 recibe posts

  const handleCreatePost = async (formData) => {
    try {
      const fecha = formData.get('fecha')

      // Calcular índice según cuántos posts ya existen en esa fecha
      const indice = getIndicePorFecha(posts, fecha)
      const nombre = `Post ${formatDateLabel(fecha)} ${indice}`
      formData.set('titulo', nombre)

      const response = await postsApi.create(formData)
      await cargarPosts()
      return response.data
    } catch (err) {
      setError('Error al crear post: ' + err.message)
      throw err
    }
  }

  const handleDeletePost = async (id, fecha) => {
    try {
      await postsApi.delete(id, fecha)
      await cargarPosts()
    } catch (err) {
      setError('Error al eliminar post: ' + err.message)
      throw err
    }
  }

  const handleUpdatePost = async (id, formData) => {
    try {
      const fechaNueva = formData.fecha || formData['Fecha de publicación'] || ''
      const fechaOriginal = formData['Fecha de publicación'] || ''
      const fechaCambiada = fechaNueva !== fechaOriginal

      const body = new FormData()
      body.append('fechaOriginal', fechaOriginal)
      body.append('fecha', fechaNueva)
      body.append('tipo', formData.tipo || formData['Tipo de formato'] || '')
      body.append('contenido', formData.contenido || '')
      body.append('publicado', formData.publicado ? 'true' : 'false')
      if (formData.imagen) body.append('imagen', formData.imagen)

      // Recalcular nombre solo si cambió la fecha
      if (fechaCambiada) {
        const indice = getIndicePorFecha(posts, fechaNueva, id)
        const nombre = `Post ${formatDateLabel(fechaNueva)} ${indice}`
        body.append('nombre', nombre)
      }

      await postsApi.update(id, body)
      await cargarPosts()
    } catch (err) {
      setError('Error al actualizar post: ' + err.message)
      throw err
    }
  }

  return { handleCreatePost, handleDeletePost, handleUpdatePost }
}