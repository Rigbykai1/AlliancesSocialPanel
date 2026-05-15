import React, { useEffect, useState } from 'react'
import { tiposFormato, DEFAULT_TIPO_FORMATO } from '../../utils/helpers'
import { getTodayInputValue } from '../../utils/date'
import { useNotifications } from '../../hooks/useNotifications'
import ImageUploadPreview from '../UI/ImageUploadPreview'

export default function PostForm({ onSubmit, initialFecha, initialContenido = '', initialImageUrl = '' }) {
  const [formData, setFormData] = useState({
    titulo: '',
    temaIA: '',
    fecha: initialFecha || getTodayInputValue(),
    tipo: DEFAULT_TIPO_FORMATO,
    contenido: initialContenido,
    imagen: null,
    imagenUrl: initialImageUrl
  })
  const [imagePreviewUrl, setImagePreviewUrl] = useState(initialImageUrl || null)
  const { notifySuccess, notifyError } = useNotifications()

  useEffect(() => {
    setFormData(() => ({
      titulo: '',
      temaIA: '',
      fecha: initialFecha || getTodayInputValue(),
      tipo: DEFAULT_TIPO_FORMATO,
      contenido: initialContenido || '',
      imagen: null,
      imagenUrl: initialImageUrl || ''
    }))
    setImagePreviewUrl(initialImageUrl || null)
  }, [initialFecha, initialContenido, initialImageUrl])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (file) => {
    setFormData(prev => ({ ...prev, imagen: file, imagenUrl: file ? '' : prev.imagenUrl }))
    if (file) {
      setImagePreviewUrl(null)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imagen: null, imagenUrl: '' }))
    setImagePreviewUrl(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.fecha || !formData.contenido) {
      notifyError('Por favor completa los campos requeridos (fecha y contenido)')
      return
    }

    const form = new FormData()
    form.append('titulo', formData.titulo)
    form.append('fecha', formData.fecha)
    form.append('tipo', formData.tipo)
    form.append('contenido', formData.contenido)
    if (formData.imagen) {
      form.append('imagen', formData.imagen)
    } else if (formData.imagenUrl) {
      form.append('imagenUrl', formData.imagenUrl)
    }

    try {
      const result = await onSubmit(form)
      const label = result?.id || formData.fecha
      notifySuccess(`Post ${label} creado correctamente`)
      setFormData({
        titulo: '',
        temaIA: '',
        fecha: null,
        tipo: DEFAULT_TIPO_FORMATO,
        contenido: '',
        imagen: null,
        imagenUrl: ''
      })
      setImagePreviewUrl(null)
    } catch (err) {
      notifyError('Error al crear el post: ' + (err?.message || 'Error desconocido'))
    }
  }

  const handleReset = () => {
    setFormData({
      titulo: '',
      temaIA: '',
      fecha: '0000-00-00',
      tipo: DEFAULT_TIPO_FORMATO,
      contenido: '',
      imagen: null,
      imagenUrl: ''
    })
    setImagePreviewUrl(null)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="card bg-base-200 shadow-lg border border-base-300 overflow-hidden">
        <div className="card-body p-6 md:p-8">
          <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-2xl font-bold text-center sm:text-start">Crear Nuevo Post</h2>
          </header>
          <div className="divider my-4">📝 Detalles del Post</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className='flex flex-col gap-3'>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex flex-col w-full sm:w-1/2 items-center sm:items-start">
                  <span className="label-text font-semibold">📅 Fecha</span>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                    className="input input-bordered mt-2 focus:outline-none text-center"
                    aria-label="Fecha de publicación"
                  />
                </label>

                <label className="flex flex-col w-full sm:w-1/2 items-center sm:items-start">
                  <span className="label-text font-semibold">🎨 Formato</span>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="select select-bordered mt-2 focus:outline-none text-center"
                    aria-label="Tipo de formato"
                  >
                    {tiposFormato.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className='flex flex-col gap-3 items-center md:items-start'>
                {imagePreviewUrl && !formData.imagen ? (
                  <div className='w-full rounded-xl border border-base-300 overflow-hidden bg-base-100'>
                    <img src={imagePreviewUrl} alt='Imagen sugerida' className='w-full object-cover max-h-60' />
                    <div className='p-3 text-sm'>
                      Imagen cargada desde Meta. Puedes cambiarla o eliminarla antes de crear.
                    </div>
                    <div className='flex gap-2 p-3'>
                      <button type='button' className='btn btn-outline btn-sm' onClick={handleRemoveImage}>
                        Eliminar imagen
                      </button>
                    </div>
                  </div>
                ) : null}

                <ImageUploadPreview
                  image={formData.imagen}
                  onChange={handleImageChange}
                  label="🖼 Imagen"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-4">
              <label className="block w-full">
                <span className="label-text font-semibold">📝 Contenido</span>
                <textarea
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  placeholder="Escribe el contenido de tu post aquí..."
                  rows="10"
                  required
                  className="textarea textarea-bordered w-full mt-2 min-h-55 resize-vertical focus:outline-none"
                />
                <span className="text-xs text-base-content/50 mt-2 block">
                  Puedes usar **markdown** para dar formato
                </span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-base-content/50">
              <p className='max-w-sm'>
                <strong>Consejo</strong>: usa imágenes en formato JPG o PNG y mantén el tamaño por debajo de 5 MB.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary">
                Crear Post
              </button>
              <button type="button" className="btn btn-outline" onClick={handleReset}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
